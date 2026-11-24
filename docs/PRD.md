# PRD — "Signal Portrait" — Fingerprint Design Engineer prototype

**Author:** Ward De Muynck (built with Claude as coder, bounded multi-agent run)
**Date:** 2026-11-24
**Status:** Draft for morning review
**Purpose:** A portfolio prototype submitted with Ward's application for the
**Design Engineer** role at Fingerprint (fingerprint.com, Growth team, remote EMEA).

---

## 1. Why this exists

The role is, verbatim, to *own the look and feel of fingerprint.com and turn
technical product concepts into visual explanations and interactive demos.*
The required (not nice-to-have) skills include **canvas animations and shaders**
and **prototyping motion in the browser**; preferred skills add three.js, WebGL,
motion.dev and Blender.

So the strongest possible application artifact is **the exact kind of thing the
job asks for**: a polished, interactive demo that explains Fingerprint's product
— built on Fingerprint's own Next.js SDK, pointed at the visitor themselves.

It also directly answers the brief Ward set: *"their site is a bit flat — I want
something polished, visual, minimal, that blows them away."* Fingerprint's own
site today leaves the Visitor ID / Suspect Score cards static and uses
placeholder data; this prototype makes that card **live and about you**.

## 2. The one-sentence concept

> You land on the page, Fingerprint identifies your device in ~40 ms, and your
> identity is rendered as a unique generative WebGL "portrait" seeded by your
> real visitor ID — with the trusted server-side signals revealed beside it.

## 3. Goals

1. Demonstrate shader / WebGL / canvas fluency (the required gap in Ward's CV).
2. Demonstrate correct, production-minded use of **Fingerprint's own SDK**,
   including the secure client→server→Server-API pattern (never trust the
   client visitor ID).
3. Demonstrate design-engineering craft: minimal, polished, motion-led, on-brand
   but elevated beyond the current site.
4. Be trivially runnable by a Fingerprint engineer: clone, add key, `npm run dev`.

## 4. Non-goals

- Not a full site rebuild. One screen, done exceptionally well.
- Not a backend product. The Server API call is for signal enrichment only.
- No auth, no database, no persistence.
- No visa/employment logic — that's a conversation, not a prototype.

## 5. Users

- **Primary:** Fingerprint hiring team (design + eng). They will read the code
  *and* judge the visuals. Both must be strong.
- **Secondary:** anyone Ward shares the deployed link with.

## 6. Scope — what gets built

### 6.1 Identification flow (correct & secure)
- `FingerprintProvider` in `app/layout.tsx` with public key + region from env.
- `useVisitorData({ immediate: false })` → `getData()` on load, returns
  `event_id` + `visitor_id`.
- Client POSTs **`event_id` only** to `/api/identify`.
- `/api/identify` (Next route handler, server) calls the **v4 Server API**
  (`https://eu.api.fpjs.io/v4/events/{event_id}`) with the **secret** key and
  returns the trusted, enriched event (identification, bot, incognito, vpn,
  ip_info, tampering, …).
- Graceful degradation: if no secret key is configured, the client visitor ID +
  visual still render, with a clear "add secret key for Smart Signals" state.

### 6.2 The Signal Portrait (hero visual)
- Full-bleed `three.js` canvas, custom **GLSL fragment shader**.
- Deterministically **seeded by a hash of the visitor ID** → every visitor gets
  a different, stable portrait (reload = same portrait).
- Domain-warped flow field evoking fingerprint ridges; iridescent palette built
  on the brand orange `#FF5D22`.
- Reacts to signals: suspect/bot state shifts the palette toward a warning hue.
- 60 fps target; `prefers-reduced-motion` respected (freezes to a static frame).

### 6.3 The reveal (motion + signals panel)
- `motion` (motion.dev) drives the entrance: portrait fades/scales in, headline
  and signals stagger in after identification resolves.
- Minimal signals panel: Visitor ID (monospace, truncated), confidence, and a
  compact grid of boolean Smart Signals (incognito / VPN / bot / tampering) as
  on-brand chips. Raw JSON available in a collapsible for the engineers.
- Copy: short, confident, technical. e.g. "This is your device. Computed in
  real time, on their free tier."

### 6.4 Responsive & accessible
- Mobile-first; portrait scales, panel reflows beneath.
- Keyboard focusable, sufficient contrast, reduced-motion path.

## 7. Tech stack (maps 1:1 to the job description)

| Job requirement | Choice in this build |
|---|---|
| React + modern framework | Next.js 16 (App Router), TypeScript |
| Canvas animations + shaders (required) | three.js + hand-written GLSL |
| Prototyping motion in the browser (required) | motion.dev |
| WebGL / three.js / motion.dev (preferred) | all three, first-class |
| Their SDK | `@fingerprint/react` v3 (the pasted Next quickstart) |
| Web performance / a11y | reduced-motion, lazy GL init, SSR-safe |

## 8. Acceptance checklist (PM pass at the end)

- [ ] `npm install && npm run build` passes clean (no type errors).
- [ ] With only a **public** key: visitor ID + portrait render.
- [ ] With public + **secret** key: Smart Signals panel populates from server.
- [ ] No secret key is ever shipped to the client (`.env.local` gitignored;
      secret read only in the route handler).
- [ ] Shader animates at 60 fps on a laptop; static frame under reduced-motion.
- [ ] Portrait is deterministic per visitor ID (reload = same).
- [ ] Layout holds from 360 px to desktop.
- [ ] README lets a stranger run it in under 3 minutes.
- [ ] Brand spec honored (orange system, type, motion feel).

## 9. Handoff / run

Three steps in Cursor: `npm install` → paste keys into `.env.local` →
`npm run dev`. See `README.md`.

## 10. Open questions for Ward (morning)

1. Region — set to `eu` (you're in Belgium). Confirm your workspace region.
2. Deploy to Vercel for a shareable link in the application? (needs your account)
3. Include the raw-JSON engineer view, or keep it purely visual?
4. One screen, or add a second "how it works" section for the submission?
