"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Identifier from "./Identifier";
import SignalPortrait from "./SignalPortrait";
import SignalsPanel from "./SignalsPanel";
import { type IdentifyResult, type SmartSignal, seedFromId } from "@/lib/signals";
import { type PortraitTone, isEnabled, playResolve, playTick, resumeIfAllowed, setBed, setEnabled } from "@/lib/audio";

const hasPublicKey = !!process.env.NEXT_PUBLIC_FINGERPRINT_PUBLIC_KEY;
type Sim = "auto" | "human" | "bot";

export default function Experience() {
  const getDataRef = useRef<null | (() => Promise<any>)>(null);
  const handleReady = useCallback((fn: () => Promise<any>) => { getDataRef.current = fn; }, []);
  const [result, setResult] = useState<IdentifyResult | null>(null);
  const [started, setStarted] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [pulse, setPulse] = useState(0);
  const [sound, setSound] = useState(false);
  const wantSound = useRef(true);
  const [sim, setSim] = useState<Sim>("auto");
  const [panelOpen, setPanelOpen] = useState(false);
  const [flow, setFlow] = useState<"idle" | "out">("idle");
  const [target, setTarget] = useState<[number, number] | null>(null);
  const running = useRef(false);
  const toneTimer = useRef<number | null>(null);

  const cueTone = useCallback((tone: PortraitTone, delay = 220) => {
    if (toneTimer.current) window.clearTimeout(toneTimer.current);
    toneTimer.current = window.setTimeout(() => {
      toneTimer.current = null;
      if (isEnabled()) playResolve(tone);
    }, delay);
  }, []);

  async function reveal(kind: "human" | "bot") {
    if (running.current) return;
    running.current = true;
    setStarted(true);
    if (isEnabled()) playTick();

    const gd = getDataRef.current;
    if (!hasPublicKey || !gd) {
      finish(base({ visitorId: "demo-mode", note: "Demo mode — add NEXT_PUBLIC_FINGERPRINT_PUBLIC_KEY to identify this device." }), kind);
      return;
    }
    try {
      const { visitor_id, event_id } = await gd();
      let enriched: Partial<IdentifyResult> = {};
      try {
        const res = await fetch("/api/identify", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId: event_id }),
        });
        enriched = await res.json();
      } catch { /* soft-fail */ }
      finish(base({
        visitorId: enriched.visitorId ?? visitor_id ?? null,
        confidence: enriched.confidence ?? null,
        enriched: !!enriched.enriched,
        signals: enriched.signals ?? [],
        suspect: enriched.suspect ?? 0,
        bot: enriched.bot ?? false,
        ipCity: enriched.ipCity ?? null,
        ipCountry: enriched.ipCountry ?? null,
        raw: enriched.raw,
        note: enriched.note,
      }), kind);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "";
      const blocked = /script of the agent/i.test(detail);
      finish(base({
        visitorId: null,
        note: blocked
          ? "This browser blocked the Fingerprint script. Allow this site in your ad blocker or tracking protection, then try again."
          : detail || "Identification unavailable.",
      }), kind);
    }
  }

  function finish(r: IdentifyResult, kind: "human" | "bot") {
    const tone: PortraitTone = kind === "bot" || r.bot ? "bot" : "human";
    setResult(r);
    setSim(tone);
    setResolved(true);
    setPanelOpen(true);
    setFlow("out");
    cueTone(tone);
  }

  const closePanel = useCallback(() => {
    if (toneTimer.current) window.clearTimeout(toneTimer.current);
    setPanelOpen(false);
    setStarted(false);
    setResolved(false);
    setSim("auto");
    setFlow("idle");
    running.current = false;
  }, []);

  // once the panel is on screen, measure it and hand the particle bridge a target
  useEffect(() => {
    if (!resolved) return;
    const id = requestAnimationFrame(() => {
      const el = document.getElementById("signals-panel");
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = ((r.left + r.width / 2) / window.innerWidth) * 2 - 1;
      const cy = -(((r.top + r.height / 2) / window.innerHeight) * 2 - 1);
      setTarget([cx, cy]);
    });
    return () => cancelAnimationFrame(id);
  }, [resolved]);

  const onSignalHover = useCallback(() => { setPulse((p) => p + 1); if (isEnabled()) playTick(); }, []);

  // Sound is wanted from the first paint. The label follows the context: browsers
  // often block autoplay, so the first gesture on the page is what actually starts it.
  useEffect(() => {
    let alive = true;
    const sync = (ok: boolean) => { if (alive && wantSound.current) setSound(ok); };
    setEnabled(true);
    resumeIfAllowed().then(sync);
    const kick = () => {
      if (!wantSound.current) return;
      resumeIfAllowed().then(sync);
    };
    window.addEventListener("pointerdown", kick, true);
    window.addEventListener("keydown", kick, true);
    return () => {
      alive = false;
      window.removeEventListener("pointerdown", kick, true);
      window.removeEventListener("keydown", kick, true);
    };
  }, []);

  function toggleSound() {
    const n = !sound;
    wantSound.current = n;
    setEnabled(n);
    setSound(n);
    if (n) {
      resumeIfAllowed().then((ok) => { if (wantSound.current) setSound(ok); });
      playTick();
    }
  }
  function pick(m: Sim) {
    const next: Sim = sim === m ? "auto" : m;
    setSim(next);
    setPulse((p) => p + 1);
    const tone: PortraitTone = next === "bot" || (next === "auto" && !!result?.bot) ? "bot" : "human";
    if (isEnabled()) playResolve(tone);
  }

  const botActive = sim === "bot" || (sim === "auto" && !!result?.bot);
  useEffect(() => {
    setBed(botActive ? "bot" : resolved ? "welcome" : "home");
  }, [botActive, resolved]);
  const displaySuspect = botActive ? 1 : sim === "human" ? 0 : result?.suspect ?? 0;
  const display: IdentifyResult | null = result
    ? { ...result, bot: botActive, suspect: displaySuspect, signals: withBot(result.signals, botActive) }
    : null;
  const seed = seedFromId(result?.visitorId ?? "awaiting-signal");

  return (
    <main className="stage">
      {hasPublicKey && <Identifier onReady={handleReady} />}
      <SignalPortrait className="portrait" seed={seed} revealed={resolved} bot={botActive} suspect={displaySuspect} pulse={pulse} flow={flow} target={target} />

      <div className="overlay">
        <motion.header
          className="hero" key={botActive ? "bot" : resolved ? "human" : "home"}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {botActive ? (
            <>
              <span className="eyebrow small-caps">Fingerprint · AI agent detection</span>
              <h1 className="title">Nice try, <span className="accent">robot</span>.</h1>
              <p className="sub">
                No red carpet for you.
                <br />
                Humans only past here. <span className="bot-mark">🤖</span>
              </p>
            </>
          ) : (
            <>
              <span className="eyebrow small-caps">Fingerprint · device intelligence</span>
              {resolved ? (
                <h1 className="title">This is <span className="accent">your device</span>,<br />computed in real time.</h1>
              ) : (
                <h1 className="title">Every device<br />leaves a <span className="accent">fingerprint</span>.</h1>
              )}
              <p className="sub">
                {resolved
                  ? "Your unique fingerprint, computed from the signals in the panel."
                  : "Every visitor is unique and identifiable, even anonymous ones. Reveal the fingerprint we compute from your browser."}
              </p>
            </>
          )}
          {!started && (
            <div className="cta-wrap">
              <button className="cta" onClick={() => reveal("human")}>
                Show your fingerprint <span className="cta-arrow">→</span>
              </button>
              <button className="cta-ghost" onClick={() => reveal("bot")}>or visit as an AI agent</button>
            </div>
          )}
        </motion.header>

        <AnimatePresence>
          {panelOpen && (
            <SignalsPanel
              key="signals"
              result={display}
              loading={false}
              onSignalHover={onSignalHover}
              onClose={closePanel}
            />
          )}
        </AnimatePresence>
      </div>

      {resolved && (
        <div className="controls">
          <div className="sim mono">
            <span className="sim-label">simulate</span>
            <button className={sim === "human" ? "on" : ""} onClick={() => pick("human")}>human</button>
            <button className={sim === "bot" ? "on" : ""} onClick={() => pick("bot")}>bot</button>
          </div>
        </div>
      )}
      <button className="sound-toggle mono" onClick={toggleSound} aria-pressed={sound}>
        {sound ? "stop sound" : "play sound"}
      </button>
    </main>
  );
}

function base(partial: Partial<IdentifyResult>): IdentifyResult {
  return {
    visitorId: null, confidence: null, enriched: false, signals: [],
    suspect: 0, bot: false, ipCity: null, ipCountry: null, ...partial,
  };
}
function withBot(signals: SmartSignal[], botActive: boolean): SmartSignal[] {
  if (!botActive) return signals;
  return [{ key: "bot", label: "Automation", value: true, tone: "warn" }, ...signals.filter((s) => s.key !== "bot")];
}
