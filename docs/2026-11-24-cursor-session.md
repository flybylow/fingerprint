# 2026-11-24 — Cursor handoff

Development moved from the earlier Claude run into this working tree. The zip in `Claude outputs/` is an older snapshot. The app on disk is the current one.

## Milestone — three interactions

Shipped in the React app, not only the static preview:

1. **Audio.** On by default. If the browser blocks autoplay, the first gesture starts the pad and the button switches from "play sound" to "stop sound". The homepage is the soft beating pad. A human identification crossfades into a warmer A-major chord and plays the open fifth. Bot replaces the bed with a TV-test tone (beating 1 kHz squares, a warbling sweep, highpassed noise) plus the short sting. Buttons and chips play a dry tick.
2. **Close (×) reverses the particle bridge.** `SignalPortrait` takes `flow`: `"out"` flies grains to the panel, `"back"` runs `uProg` from its current value down to 0 so they dissolve into the fingerprint. The entry CTAs come back.
3. **Body text plate.** `.sub` has a dark translucent background so the paragraph stays readable over the ridges. In the Cursor browser `backdrop-filter` computed as `none`; the plate color is what actually carries the contrast.

## Keys

`.env.local` (gitignored) is the only place keys go.

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_FINGERPRINT_PUBLIC_KEY` | Public browser key from Dashboard → API keys. About 20 characters. Safe in the client. |
| `NEXT_PUBLIC_FINGERPRINT_REGION` | `eu` for this workspace. |
| `FINGERPRINT_SECRET_KEY` | A second credential, under Secret keys. Shown when it is created. Server only, for Smart Signals via `/api/identify`. |

Restart `npm run dev` after editing the file. Next prints `Environments: .env.local` when it loaded the file.

Without a public key, `app/layout.tsx` skips `FingerprintProvider` and the page stays in demo mode. That was the earlier crash (agent script requested with no key). With the public key present, demo mode is gone and the error below appears instead.

## Open issue — script load overlay

**Symptom.** Runtime `FingerprintError: Failed to load the JS script of the agent`. Next 16.4.6 dev overlay. Server log: `unhandledRejection`, usually twice per load (React strict mode).

**What is already ruled out.**

- The public key is valid. `https://fpnpmcdn.net/v4/<publicKey>` returns `200` `text/javascript` with `access-control-allow-origin: *`. The loader builds that URL (`v4` + the key). Paths like `/eu/v4/` 404; region is not a path prefix.
- Region `eu` is correct. `start({ apiKey, region: "eu" })` in the page returns a visitor id. `region: "us"` fails with `wrong region`.
- Calling `start` three times in parallel also succeeds. So the CDN and the key are not the failure by themselves.
- The SDK rewrites an inner `bundle_not_defined` error into this same message. The string alone does not prove the CDN request 404’d.

**What is still true.** `FingerprintProvider` starts the agent on mount, and a rejected start is not caught. The overlay fires on load even when a later `get()` succeeds and `/api/identify` returns 200. The secret key is unrelated: the panel copy about the missing secret only appears after a successful client identify.

**Fixed.** The agent now starts inside the reveal click. See [agent script overlay](2026-11-24-agent-script-overlay.md). Do not switch the region to `us`.
