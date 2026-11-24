// Shared types + helpers for turning a visitor ID into deterministic shader
// seeds, and for normalizing the Server API event into a compact signal set.

export type SmartSignal = {
  key: string;
  label: string;
  /** true = flagged/risky, false = clean, null = unknown/not in plan */
  value: boolean | null;
  tone: "ok" | "warn" | "neutral";
};

export type IdentifyResult = {
  visitorId: string | null;
  confidence: number | null; // 0..1
  // enriched (server) data; absent without a secret key
  enriched: boolean;
  signals: SmartSignal[];
  suspect: number; // 0..1 — drives the portrait warning shift
  bot: boolean; // a "bad" bot (automation / AI agent) → triggers the glitch state
  ipCity: string | null;
  ipCountry: string | null;
  raw?: unknown; // full server event for the collapsible engineer view
  note?: string; // e.g. "no secret key configured"
};

/** FNV-1a 32-bit hash → unsigned int. */
function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Deterministically derive N floats in [0,1) from a string, so the same visitor
 * ID always produces the same portrait. Uses a small xorshift seeded by the hash.
 */
export function seedFromId(id: string, n = 6): number[] {
  let s = fnv1a(id || "anonymous") || 1;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    out.push(s / 0xffffffff);
  }
  return out;
}

/** Truncate a long ID for display: 4f9a…c2e1 */
export function shortId(id: string | null): string {
  if (!id) return "—";
  if (id.length <= 12) return id;
  return `${id.slice(0, 6)}…${id.slice(-4)}`;
}

// --- Server event normalization --------------------------------------------
// The v4 Server API returns a flat, snake_case event. Smart Signals available
// depend on the workspace plan, so we read defensively and never assume a field.

function asBool(v: unknown): boolean | null {
  return typeof v === "boolean" ? v : null;
}

export function normalizeEvent(event: Record<string, any>): Partial<IdentifyResult> {
  const ident = event?.identification ?? {};
  const bot = event?.bot ?? {};
  const ip = event?.ip_info ?? event?.ipInfo ?? {};
  const geo = ip?.v4?.geolocation ?? ip?.v6?.geolocation ?? ip?.geolocation ?? {};

  const incognito = asBool(event?.incognito?.result ?? event?.incognito);
  const vpn = asBool(event?.vpn?.result ?? event?.vpn);
  const proxy = asBool(event?.proxy?.result ?? event?.proxy);
  const tampering = asBool(event?.tampering?.result ?? event?.tampering);
  // v4 node-sdk: `event.bot` is the string 'bad' | 'good' | 'not_detected'.
  const botStr = typeof event?.bot === "string" ? event.bot
    : typeof bot?.result === "string" ? bot.result
    : typeof bot?.bot?.result === "string" ? bot.bot.result : null;
  const badBot = botStr == null ? null : botStr === "bad";

  const signals: SmartSignal[] = [
    sig("bot", "Automation", badBot, true),
    sig("incognito", "Incognito", incognito, true),
    sig("vpn", "VPN", vpn, true),
    sig("proxy", "Proxy", proxy, true),
    sig("tampering", "Tampering", tampering, true),
  ];

  // suspect: fraction of risky signals that are flagged (unknowns ignored)
  const known = signals.filter((s) => s.value !== null);
  const flagged = known.filter((s) => s.value === true).length;
  const suspect = known.length ? flagged / known.length : 0;

  return {
    visitorId: ident?.visitor_id ?? null,
    confidence: typeof ident?.confidence?.score === "number"
      ? ident.confidence.score
      : typeof ident?.confidence === "number" ? ident.confidence : null,
    enriched: true,
    signals,
    suspect,
    bot: badBot === true,
    ipCity: geo?.city?.name ?? null,
    ipCountry: geo?.country?.name ?? geo?.country?.code ?? null,
    raw: event,
  };
}

/** A signal where `true` means risky (riskyIsTrue) maps true→warn, false→ok. */
function sig(key: string, label: string, value: boolean | null, riskyIsTrue: boolean): SmartSignal {
  let tone: SmartSignal["tone"] = "neutral";
  if (value !== null) tone = value === riskyIsTrue ? "warn" : "ok";
  return { key, label, value, tone };
}
