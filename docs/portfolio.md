# Portfolio next to Signal Portrait

The case-study site and the demo stay in this repo. They are two apps, two layouts, one origin.

- Signal Portrait is the Next.js app at `/`.
- The portfolio is the Astro app in `portfolio/`, built from the Alba theme, at `/portfolio`.
- **More about me →** on the demo opens `/portfolio/`.
- **Signal Portrait** in the portfolio nav opens `/`.

`npm run dev` starts both. In development, `proxy.ts` forwards `/portfolio` to the Astro server on port 4321. `npm run build` builds Astro into `public/portfolio`, then builds Next, and the same proxy serves those files as directory indexes.

The palette is the dark Fingerprint set: `#0d0a09`, `#1a1210`, `#FF5D22`. Light mode stays available from the theme toggle. Geist Mono is the label face. Instrument Serif stays the italic accent. The Alba `LICENSE` is kept in `portfolio/`.

Copy on the site is only what is already known: about twenty years across factories, healthcare, and government, founder of Tabulas, and the five case studies named in the brief. It does not include a city, a CV PDF, employment dates, or quotes. Those can be added in `portfolio/src/config` and `portfolio/src/content/work` when the source files are here.
