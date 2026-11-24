# Brand & visual direction — Signal Portrait

Grounded in fingerprint.com, then elevated. The goal is "unmistakably Fingerprint,
but the version of Fingerprint that hired a design engineer."

## Source brand (from fingerprint.com)
- Signature accent: **`#FF5D22`** (vivid orange). Used sparingly today.
- Bold sans headlines, accent-colored keywords.
- Technical / security tone, occasional warmth ("good guys", "delight").
- Tagline: *Identify Every Visitor.*
- Weaknesses: static Visitor-ID / Suspect-Score cards, placeholder "0.0%" charts,
  reused generic icons, little motion.

## Our palette (dark-first, the demo is a "signal in the dark")
| Token | Value | Use |
|---|---|---|
| `--bg` | `#0A0A0B` | page background (near-black, warm) |
| `--bg-raise` | `#141416` | panels, chips |
| `--fg` | `#F5F3F0` | primary text (warm white, not pure) |
| `--fg-dim` | `#9A968F` | secondary text, labels |
| `--accent` | `#FF5D22` | the brand orange — data highlights, CTA, portrait core |
| `--accent-2` | `#FFB38A` | warm highlight for gradients/iridescence |
| `--warn` | `#FF3B3B` | bot/suspect state shift |
| `--ok` | `#39D98A` | "clean"/human affirmative chips |
| `--line` | `rgba(245,243,240,0.08)` | hairline borders |

Iridescence in the shader rides between `--accent` → `--accent-2` → a cool violet
so the orange reads as brand but the portrait doesn't look monochrome.

## Type
- Headlines: Geist (shipped with the scaffold), tight tracking, heavy weight.
- Data / IDs: Geist Mono — reinforces the "developer product" feel.
- Scale is restrained: one big headline, one subhead, small-caps labels on data.

## Motion principles (motion.dev)
1. **Earned reveal** — nothing moves until identification resolves; then the
   portrait settles and the data staggers in (60–80 ms apart). Motion *is* the
   explanation ("it just computed this").
2. **Calm, not bouncy** — ease-out, 400–700 ms, low amplitude. Premium, not toy.
3. **The shader breathes** — slow, continuous flow; never loops obviously.
4. **Respect reduced-motion** — static, composed frame; still beautiful.

## Layout
- Desktop: portrait dominant (left / full-bleed), signals panel as a narrow
  overlay card on the right. Generous negative space.
- Mobile: portrait top, panel stacked beneath. One column.
- Hairlines and mono labels over heavy boxes. Minimal.

## The one visual idea
A fingerprint is a flow field. We render the visitor's ID *as* a flow field —
so the abstract identifier becomes something organic and singular. The product's
whole pitch ("everyone is unique and identifiable") made literal, about the
viewer, in motion.
