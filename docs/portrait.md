# How the portrait is computed

The drawing is not a photograph of a fingerprint, and this app does not recompute Fingerprint's device signals. The agent returns a visitor ID. `seedFromId` in `lib/signals.ts` hashes that string, and the shader in `app/components/SignalPortrait.tsx` draws from the hash. The same ID always produces the same portrait.

Until identification returns, the seed is the fixed string `awaiting-signal`, so every visitor sees the same field.

## Seed

FNV-1a hashes the ID, then a short xorshift turns that hash into floats in `[0, 1)`. The shader uses the first three as `uSeed`.

## Form

Before the click the field is a generic bullseye: many thin gray lines on a fixed center, bent just enough that they are not perfect circles, and dimmer toward the middle so the type stays readable. The pointer pulls those lines toward the cursor, strongest nearby and easing out across the field, and the pull fades once the portrait takes over. The lines travel outward at `0.4` spacings per second, the same rate as the homepage pad's beat (55 Hz against 55.4 Hz). `uIntro` stays near `0.3`, and `personal` (`smoothstep(0.36, 1.0, uIntro)`) is 0, so the visitor seed does not move the drawing yet.

Once identification resolves, `uIntro` eases to 1 and the same rings become the portrait:

- `uSeed.x` and `uSeed.y` slide the center off the middle.
- The fine homepage lines (`12` across the field) loosen into `9` ridges, then `uSeed.x` sets how hard the noise bends them (`8 + uSeed.x * 4`).
- A noise field, offset by all three seed numbers, warps the circles into ridges.

The pointer dent and the slow drift are motion, not identity. The dent is strongest on the opening rings and fades as the portrait arrives. The drift is the same for everyone. A bot adds a horizontal glitch on top of this. It does not change the seed.

## Color

Color comes in on the same `uIntro` curve as the warp, so the personal portrait arrives as a change of shape and color together, not a tint of the opening circles.

There is one warm cosine palette (orange, brown, muted purple). The seed only slides where on that palette the ridges start, through `uSeed.y`, and only by a small amount. Every portrait is then mixed 40% toward Fingerprint orange `#ff5d22`.

Flagged Smart Signals raise `suspect` and push the ridges toward red. A bot verdict adds the red cast and the glitch. Two visitors stay in the same color family. What separates them is the whorl: center, spacing, and how the ridges bend.

## Particles and the card

The card's edge stays the brand orange. Its fill is a light translucent tint of `#141416`, so the portrait stays visible through the panel. Grains appear at full strength the moment the flight starts, in a light peach taken from the ridge palette, then mix to solid `#FF5D22` as they travel into the card. A bot swaps that destination for `#FF3B3B`.
