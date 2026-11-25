# PRD — Homepage "How I work" section

## Context
The homepage (`/portfolio`) currently ends with two overlapping blocks that dilute the
pitch: **AI & machine learning** (`AiWork`) and **What I do** (`Services`). Replace both
with one section that states, in Ward's own words, what he does across a 20-year career:
research, design, code, and AI, end to end. Career first. Tabulas stays light.

## Goal
One section, **How I work**, with four points. Each point shows a title and a one-line
italic lead by default; a **Read more** control expands a fuller description plus links to
the case studies that prove it.

## Scope
**In**
- New "How I work" section on the homepage, where the AI section sits now (under Selected work).
- Remove the "What I do" (Services) block.
- Remove the "AI & machine learning" (AiWork) block; its content folds into point 04.
- Expand/collapse per point (native, no framework).
- Case links, live pages only.

**Out (not this PRD)**
- Hero, stat row, Selected work, closing: unchanged.
- Publishing ArcelorMittal / Robovision (links get added once those are live).
- Smaller work / MinorWork (already not on the homepage).

## Placement
Immediately after the Selected work `<section id="work">`, replacing `<AiWork />`.
(If it reads short enough later, it can move above Selected work. Keep it below for now.)

## Copy (final, approved)

**Section header**
- Eyebrow: `How I work`
- Title: **Discovery through to shipped code**
- Intro: *Twenty years turning complex, data-heavy systems into clear, trustworthy interfaces. I run the research, design the thing, build it in React, and make the AI trustworthy.*

**01 — Design & research**
- Lead (always visible): *I create and organize co-creation workshops with all the stakeholders, to align visions and get feedback.*
- Body (expanded): I sit with the people who will use the thing, operators, engineers, and developers, in a room or fully remote. The workshop turns their reality into one roadmap everyone can build from. The design starts from evidence, not a guess.
- Links: **Unilin** → `/work/unilin/` · **Electrolux** → `/work/electrolux/`

**02 — Complex data, made usable**
- Lead: *I take heavy, messy enterprise data and make it something non-experts can act on.*
- Body: Most of my work is large industrial systems with a lot of data and a lot of stakeholders. The data is messy, the users aren't data people, and my job is to surface the one thing they need to act on. I turn it into simple flows and dashboards they actually like to use.
- Links: **Electrolux** → `/work/electrolux/`  (add **ArcelorMittal** → `/work/arcelormittal/` once published)

**03 — I code what I design**
- Lead: *I build the product myself, in React, TypeScript and Node.*
- Body: I coded from the start of my career, moved into UX and coaching dev teams, then went back to building two years ago when AI changed how products get made. So the interface ships as the real thing, down to the components and the performance, not a spec passed over a wall.
- Links: **Product Passport** → `/work/product-passport/` · **Signal Portrait** (live demo) → demo root

**04 — AI people trust**
- Lead: *I make AI output something people can actually trust and act on.*
- Body: I've designed several AI products where the result had to make sense to the person using it. At Robovision I rebuilt a labeling tool so non-experts could train models quickly. For Unilin I built a human in the loop system where machine vision catches what the eye misses and the operator stays in control. Lately, dashboards that show provenance, to counter hallucination.
- Links: **Unilin** → `/work/unilin/`  (add **Robovision** → `/work/robovision/` once published)

## Links policy
- Link **only to live, non-draft** case pages. Today those are: `electrolux`, `product-passport`, `ecs`, `unilin`.
- `arcelormittal` and `robovision` are `draft: true`. Do **not** link them until published; then add per the notes above.
- Internal `/work/...` links go through the **`url()` helper** so the `/portfolio` base is applied.
- The **Signal Portrait** demo lives outside the Astro base (the Next.js app root). Use `siteConfig.demo.href` **raw**, exactly like `SiteHeader` does, not `url()`. Mark it as an external/root link.

## Interaction & accessibility
- Use native **`<details>` / `<summary>`** per point (works with JS disabled, keyboard-operable, accessible by default).
  - `<summary>` line: mono number `01–04`, the title, the italic lead, and a **Read more** affordance with a chevron.
  - Expanded content: the body paragraph + a row of case links.
  - On `[open]`: swap "Read more" → "Read less" and rotate the chevron (CSS only).
  - Hide the default disclosure marker: `summary::-webkit-details-marker { display: none }` + `summary { list-style: none }`.
  - Keep `<summary>` focusable (default) with the project's `:focus-visible` ring.
- **Multiple open at once is fine** — do not force single-open.
- **Motion:** calm height/opacity ease (~200–300ms, ease-out); honor `prefers-reduced-motion`. The existing `.reveal` can fade each row in on scroll.

## Design system (reuse existing tokens / classes — see docs/BRAND.md & /portfolio/system/)
- Wrapper: `.shell`; header via the `SectionHead` component.
- Numbers: `font-mono`, `var(--accent)`, ~0.72rem, `.eyebrow`-style tracking.
- Structure: full-width **hairline rows** (`var(--line)`), with a 2px `var(--accent)` top accent per row to echo the current AiWork treatment. Recommended over a 2×2 grid because the expandable body needs width.
- Links: the `.link` class (orange underline/hover) or small mono chips; stay consistent with the chip/eyebrow styling.
- **Lead line italic:** the design system reserves Instrument Serif (`.serif`) for a single word in a headline, not for body. For these leads use **plain italic in `--font-sans`** (`class="italic"`) to avoid overusing the serif. (If Ward prefers the serif look here, switch to `.serif` — confirm.)

## Files
1. **New** `src/config/approach.ts` — export `approach = { eyebrow, title, intro, items: [{ n, title, lead, body, links: [{ label, href, external? }] }] }` with the copy above.
2. **New** `src/components/home/Approach.astro` — `SectionHead` + four `<details>` rows mapped from `approach.items`; scoped `<style>` for the number, hairlines, chevron, `[open]` states, and reduced-motion. Build `/work/` hrefs with `url()`; render the demo link raw from `siteConfig.demo.href`.
3. **Edit** `src/pages/index.astro` — replace the `AiWork` import + `<AiWork />` with `Approach` + `<Approach />`; remove the `Services` import + `<Services />`.
4. **Cleanup (recommended)** — remove the now-unused `ai` and `services` exports from `src/config/home.ts`, and delete `src/components/home/AiWork.astro` and `src/components/home/Services.astro`. (`MinorWork.astro` is already off the homepage; handle separately if you want it gone.)

## Acceptance criteria
- After Selected work, the homepage shows: **How I work** / **Discovery through to shipped code** / intro / four points.
- Each point shows its italic lead by default; **Read more** reveals body + links; **Read less** collapses.
- Works with JavaScript disabled (native `<details>`).
- Every case link resolves — no links to `draft` pages.
- Uses the existing tokens (near-black, orange accent, mono numbers, hairlines) and matches the rest of the page in dark mode.
- The old "What I do" and "AI & machine learning" blocks are gone.
- Keyboard: Tab to a summary, Enter/Space toggles, visible focus ring; `prefers-reduced-motion` respected.

## Notes / open
- **Lead italic:** plain sans italic by default (see Design system). Confirm if serif is wanted.
- **Tabulas** is intentionally not named in the four. The closing section already carries it lightly. Optional: one quiet line under the four if Ward wants a nod.
- Add **ArcelorMittal** (02) and **Robovision** (04) links once those cases are published.
