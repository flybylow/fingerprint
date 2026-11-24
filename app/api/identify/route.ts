import { NextRequest, NextResponse } from "next/server";
import { FingerprintServerApiClient, Region } from "@fingerprint/node-sdk";
import { normalizeEvent } from "@/lib/signals";

// Server-only: enrich a Fingerprint event with trusted Smart Signals via the
// official Node server SDK. The client sends ONLY the event_id — we never trust
// the client's visitor_id. The secret key is read here and never reaches the browser.

const REGION: Record<string, Region> = {
  us: Region.Global,
  global: Region.Global,
  eu: Region.EU,
  ap: Region.AP,
};

export async function POST(req: NextRequest) {
  let eventId: string | undefined;
  try {
    ({ eventId } = await req.json());
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  if (!eventId || typeof eventId !== "string") {
    return NextResponse.json({ error: "missing_event_id" }, { status: 400 });
  }

  const secret = process.env.FINGERPRINT_SECRET_KEY;
  if (!secret) {
    // Graceful degradation: no secret key → no Smart Signals, but the demo runs.
    return NextResponse.json({
      enriched: false,
      note: "No FINGERPRINT_SECRET_KEY set — add it to .env.local for Smart Signals.",
    });
  }

  const regionKey = (process.env.NEXT_PUBLIC_FINGERPRINT_REGION || "eu").toLowerCase();
  const client = new FingerprintServerApiClient({
    apiKey: secret,
    region: REGION[regionKey] ?? Region.EU,
  });

  try {
    const event = await client.getEvent(eventId);
    return NextResponse.json(normalizeEvent(event as unknown as Record<string, any>));
  } catch (e: any) {
    // Keep the client flow alive; surface as a soft state the UI can show.
    return NextResponse.json(
      { enriched: false, error: "server_api_error", detail: String(e?.message ?? e).slice(0, 300) },
      { status: 200 },
    );
  }
}
