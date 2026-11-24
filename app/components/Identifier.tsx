"use client";

import { useEffect } from "react";
import { start, type GetResult } from "@fingerprint/agent";

const apiKey = process.env.NEXT_PUBLIC_FINGERPRINT_PUBLIC_KEY ?? "";
const region = (process.env.NEXT_PUBLIC_FINGERPRINT_REGION || "eu") as "us" | "eu" | "ap";

// The package loader tries fpnpmcdn.net first. Some browsers and ad blockers
// stop that host and let fpjscdn.net through, so try both. A fresh start() per
// attempt matters: a failed load stays stuck on that agent instance.
const scriptHosts = ["https://fpjscdn.net", "https://fpnpmcdn.net"] as const;

async function identify(): Promise<GetResult> {
  let last: unknown;
  for (const endpoints of scriptHosts) {
    try {
      return await start({ apiKey, region, endpoints }).get();
    } catch (error) {
      last = error;
    }
  }
  throw last;
}

// Do not call start() on mount. It downloads the agent immediately, and a
// rejection before the click is an unhandled error in the Next.js overlay.
export default function Identifier({ onReady }: { onReady: (getData: () => Promise<GetResult>) => void }) {
  useEffect(() => {
    onReady(identify);
  }, [onReady]);
  return null;
}
