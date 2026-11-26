# PRD — Ward De Muynck Portfolio (Fingerprint-styled, Astro)

**Owner:** Ward De Muynck
**Date:** 2026-11-24
**Status:** Ready to build
**Audience:** The developer installing and building the site

---

## 1. Goal

Build a personal **portfolio + case-study site** in the visual style of
**Fingerprint** (fingerprint.com), to accompany Ward's application for Fingerprint's
Design Engineer role and serve as a lasting portfolio. It links from the already-built
**Signal Portrait** demo (a separate Next.js app) so a visitor can go from the demo
to "more about me / case studies."

This is a **new, separate project.** Do not modify the existing Signal Portrait
(Next.js) codebase at `~/dev/fingerprint`.

## 2. Base theme

- **Theme:** Alba, by Andrei Alba / Xoco Themes — repo `https://github.com/xocothemes/maria`
- **License:** **MIT** (free commercial use, modify freely; keep the copyright +
  permission notice in the source). Bundled fonts are SIL Open Font License, icons ISC/MIT.
- **Stack:** Astro, static output, **no framework islands** (zero client JS by default),
  **MDX case studies** via Astro content collections, Astro image pipeline,
  **design tokens in a single stylesheet**, self-hosted **Hanken Grotesk** + **Instrument Serif**,
  Lucide icons.
- **Pages it ships:** homepage (availability badge, headline, key facts, selected case
  studies, services, testimonials), paginated **work index**, **case-study detail pages**
  (summary, client, year, role, duration, team, services, full-width cover, "next case study"),
  **About** (portrait, editorial sections, principles), **Resume** (experience, capabilities,
  education, tools, optional PDF), legal pages, 404, and a "Let's talk" email panel.
- Default aesthetic is **light, editorial, purple accent (#8D46E7)** — we reskin this.

## 3. Install (dev steps)

```bash
# In a NEW folder, separate from the Next.js demo
git clone https://github.com/xocothemes/maria fingerprint-portfolio
cd fingerprint-portfolio
npm install        # or pnpm install
npm run dev        # confirm it runs at localhost:4321
```

- Node 18+ (20+ recommended).
- Keep the `LICENSE` file (MIT requires the notice stays).
- Connect this folder to the Claude chat (Claude desktop app → Add folder) so content
  edits can be made directly.

## 4. Reskin to the Fingerprint brand

Alba keeps its palette in **one tokens stylesheet** — that's the main lever. Swap the
palette there and default the site to **dark**.

**Color tokens (replace Alba's defaults):**
```
--bg          #0d0a09   warm near-black (base)
--bg-raise    #1a1210   panels / cards
--orange      #FF5D22   brand / primary  (replaces purple #8D46E7)
--orange-lit  #FF7A3D   hover / glow / active
--fg          #F5F1EC   primary text        --fg-dim #9A948C secondary
--line-orange rgba(255,93,34,0.28)   hairline borders
--line        rgba(245,240,235,0.08) neutral hairlines
--ok  #4ADE80   (clean / "Not Detected")   --warn #FF5D5D (flagged / "Detected")
radius: card 14 · chip 8 · pill 999 · border 1px
```

**Mode:** default to **dark**; keep the light/dark toggle Alba provides.

**Type:** keep **Hanken Grotesk** (display) and **Instrument Serif** (italic accent — already
on-brand). **Add a monospace** (Geist Mono or JetBrains Mono) for IDs, labels, metadata —
this is what gives Alba the Fingerprint *technical* feel.

**Fingerprint technical motifs (what shifts it from editorial → developer-tool):**
- Monospace small-caps labels; hairline divider rows (`LABEL ———— value`).
- Solid-orange highlight on key values (dark text on orange).
- Status pills: green = clean, red = flagged, on tinted dark fills.
- Optional: faint ASCII/symbol or scanline background texture; selection corner-brackets
  on featured case studies.
- Keep it restrained — B2B, not a circus.

## 5. Content

- **Case studies (3–5):** rework from `how-i-work-WDM.pdf` in the Drive folder into Alba's
  MDX format. Candidates: Electrolux (OEE factory dashboards), ArcelorMittal (enterprise
  platform), Robovision (ML labeling UX), Unilin (human-in-the-loop vision), Tabulas
  (digital product passports). Each: summary, client, year, role, duration, team, services, cover, body.
- **About:** designer who also builds; ~20 years across factories, healthcare and government;
  founder of Tabulas (digital identity).
- **Resume page:** map to `cv-WardDeMuynck.pdf`; offer it as the PDF download.
- **Contact / links:** ward@tabulas.eu · LinkedIn (warddem) · X (WardDeM) · GitHub (flybylow)
  · Signal Portrait demo.

## 6. Integration with the Signal Portrait demo

- Add a brand-styled button in the Next.js demo (e.g. **"More about me →"** / **"Case studies"**)
  that **navigates** to the portfolio (not an overlay/iframe).
- **Hosting (preferred):** one domain via **Vercel multi-zones** — Next.js Signal Portrait at
  root `/`, the Astro portfolio deployed separately and mounted at `/portfolio` through a
  Next.js rewrite. Feels like one site; two independent codebases.
- **Simplest fallback:** deploy the portfolio to its own Vercel URL; the button links out.
- The two apps stay separate. Keep the brand tokens in sync manually (a shared tokens file
  copied into each) — do not try to share Astro and React components; the frameworks don't mix.

## 7. Guardrails

- **Never modify** the Next.js Signal Portrait project.
- Keep the **MIT notice**; use only free/permissive assets.
- Preserve Alba's **static, zero-JS-by-default** performance — don't add heavy client JS.
- Reskin via **tokens first**; avoid rewriting component internals unless needed.

## 8. Acceptance criteria

- [ ] Portfolio runs locally and deploys to Vercel.
- [ ] Dark-first Fingerprint palette applied via the tokens stylesheet (purple fully replaced).
- [ ] Monospace added for data/labels; Instrument Serif accent retained.
- [ ] At least 3 case studies populated in MDX, plus About and Resume.
- [ ] A button on the Signal Portrait demo opens the portfolio (`/portfolio` or external URL).
- [ ] MIT LICENSE retained.

## 9. Open decisions for Ward

1. Which 3–5 case studies to include.
2. One domain with `/portfolio` (multi-zones) vs a separate URL.
3. New GitHub repo name (e.g. `fingerprint-portfolio`).
4. How far to push the technical reskin vs keep Alba's editorial calm.
