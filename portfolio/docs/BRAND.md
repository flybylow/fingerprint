# Portfolio — design system

The design system for this portfolio (the `/portfolio` site, all pages inside).
Same foundation as the Signal Portrait demo (`../docs/BRAND.md`): a signal in the
dark, orange on near-black. The portfolio keeps an editorial display face where the
demo stays all-Geist, but shares the demo's palette, mono labels, hairlines, and motion.

**Live reference:** `/portfolio/system/` (built from these tokens, so it never drifts).
**Single source of truth:** `src/styles/global.css`.

## Colors (dark-first)
| Token | Value | Use |
|---|---|---|
| `--canvas` | `#0A0A0B` | Page background (near-black) |
| `--surface` | `#141416` | Panels, cards, chips |
| `--sunken` | `#060608` | Recessed wells |
| `--ink` | `#F5F3F0` | Primary text (warm white, not pure) |
| `--muted` | `#9A968F` | Secondary text, labels |
| `--line` | `rgba(245,243,240,0.09)` | Hairline borders |
| `--line-strong` | `rgba(255,93,34,0.30)` | Accent hairline |
| `--accent` | `#FF5D22` | Brand orange: CTAs, highlights, hover |
| `--accent-strong` | `#FF7A3D` | Accent hover |
| `--ok` | `#39D98A` | Available / affirmative |
| `--warn` | `#FF3B3B` | Alert / bot state |

A light theme exists as the paper inverse (toggle in the header), but dark is the
default and the canonical match to the demo.

## Type
- **Hanken Grotesk** (`--font-sans`): headlines and body. Weight 500 for headings, tight tracking.
- **Instrument Serif** italic (`--font-serif`): muted emphasis (`.serif`). The second part of a headline uses `.serif-accent`, the same italic in orange.
- **Geist Mono** (`--font-mono`): data, IDs, eyebrow labels. Shared with the demo.
- Scale is tokenized: `--text-display`, `--text-headline`, `--text-section`, `--text-title`, `--text-lead`. Restrained, one big headline per view.

## Grid & spacing
- `.shell` centers content at `--measure` 80rem with a fluid `--gutter`.
- Work: 2-column grid. Supporting content: 3 or 4 columns. Generous negative space.
- Structure comes from hairlines and mono labels, not heavy boxes.
- Radii: `--radius-card` 14px, `--radius-panel` 8px.

## Components (`src/components`, `global.css` @layer components)
- **Buttons** `.btn` + `.btn-accent` (orange CTA), `.btn-primary` (solid), `.btn-ghost` (outline), `.btn-sm`.
- **Eyebrow** `.eyebrow`: mono, uppercase, 0.14em tracking, orange dot. Not automatic. A small mono number above a title counts as one too. Scope items have the icon and the title, no number. Leave the pages as they are. When a new title might want one, propose it. Add it only when it is wanted.
- **Chip** `.chip`: hairline pill for services/tags.
- **Link** `.link`: ink text, orange underline, orange on hover.
- **SectionHead**, **ProjectCard**, **MinorWork** rows, **AiWork** band: composed from the above.

## Motion (ease-out, calm, earned)
- `.rise`: staggered entrance on load, driven by `--rise-step` (80ms apart).
- `.reveal`: scroll-linked fade + lift.
- Low amplitude, 400 to 900ms, `--ease-out-expo`. Honors `prefers-reduced-motion`.

## Principle
One system, every page. A visitor should not be able to tell where the home page
ends and a case study begins.
