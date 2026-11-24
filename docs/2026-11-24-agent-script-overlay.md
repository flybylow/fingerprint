# Agent script overlay — fixed

`FingerprintError: Failed to load the JS script of the agent` was an unhandled rejection on page load, shown by the Next.js dev overlay. Identification could still succeed afterwards.

## Cause

`FingerprintProvider` calls `start()` while rendering. In `@fingerprint/agent`, `start()` begins downloading `https://fpnpmcdn.net/v4/<publicKey>` immediately and only surfaces that promise from `get()`. Nothing calls `get()` until the visitor clicks, so a rejected load becomes an unhandled rejection. React strict mode made it fire twice.

The public key and region `eu` were fine. The CDN URL returns 200. Calling `start({ region: "eu" }).get()` from a click returns a visitor id. `region: "us"` is `wrong region` for this workspace.

## Fix

`app/layout.tsx` no longer mounts the provider. `app/components/Identifier.tsx` calls `start().get()` only inside the function Experience runs from the reveal button, which already has a try/catch. A failed load stays in that catch (“Identification unavailable”) instead of taking down the page.

Checked on a fresh load: no `FingerprintError` in the dev log, and reveal still returns a real visitor id. Smart Signals still need `FINGERPRINT_SECRET_KEY`.

A later click can still fail inside `get()` if the browser blocks the CDN. That used to surface as “check your public key and region,” which is the wrong diagnosis: the key and `eu` already work, and “Automation / yes” in that state is only the local agent preview. The loader now tries `fpjscdn.net` and then `fpnpmcdn.net`. If both are blocked, the panel says so instead of blaming the key.
