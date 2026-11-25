# PRD — Experiments & prototypes (work page)

## Context
The `/work` page ends with a tabbed **Experiments and prototypes** board
(CSS radio tabs; component `src/components/home/MinorWork.astro`, data
`src/config/minor.ts`). Each tab shows a title, a preview image, and a line or two.

Right now it's thin and uneven:
- **Blockchain win** — Berlin photo, links, text. Good.
- **MoMuse** — image, link, text. Good.
- **WardBot** — image + text, but **no link**.
- **Vaccination robot** — **one line only**. No text, no image, no link.

## Goal
Make each experiment a **tiny case study / preview**: a one-line hook, two or three
sentences on the core of what I did, a preview image, and a link to the live demo.
Short. Not full `/work/` case pages.

## No schema or component change needed
`minor.ts` items already support: `line`, `text`, `image`/`imageAlt`/`imagePosition`
(or `images[]`), `href`/`linkLabel`/`external` (or `links[]`), `tag`. The panel renders
title → image(s) → line → text → links. So this is a **content fill in `minor.ts`**, plus
sourcing one missing image (vaccination robot). Keep `text` to 2–3 sentences; it fits
`.minor-copy` (max-width 38rem) without any layout work.

## Content to paste (per item)

### 01 · WardBot
- line: `An experiment, not a client job.`
- text: `An AI agent that answers questions about my work, built on a knowledge graph of my projects. Every fact carries its provenance, provided, extracted, inferred, or hand-edited, so you can see where an answer comes from. I designed and built it end to end.`
- image: `/experiments/wardbot.png` (exists)
- link: `https://wardbot.vercel.app/?layer=wardbot` (WardBot)

### 02 · Vaccination robot
- line: `Designing trust into an automated vaccination robot.`
- text: `ROB-ID, an automated vaccination robot built with Voxdale. The real risk was robophobia, people hesitant to let a machine give the shot. I led the UX and ran the user research, then proposed an AR virtual nurse that guides each person step by step, with clearer information up front. In testing, trust and comfort went up.`
- image: **none yet** (see Gaps)
- link: none known (client project)
- tag: `robotics`

### 03 · Blockchain win
- line: `An on-chain passport, shown in Berlin.`
- text: `With Stefanos and Omar, we built digital product passports verified on-chain. An escrow system that rewards material recycling through underlying smart contracts. Top 3 out of 60+ teams, presented to web3 experts at the MasterZ showcase in Berlin.`
- images: `/experiments/iota-textile-tracer.jpg`, `/experiments/iota-tshirt-passport.jpg` (exist)
- links: Berlin showcase, `https://iota2-seven.vercel.app/` (T-shirt tracer). Textile Tracer (`iota2shirt`) and Coffee on-chain are not linked.

### 04 · MoMuse
- line: `A digital museum assistant for the Antwerp Fashion Museum.`
- text: `It explains a garment in plain language, and tells a different story depending on who asks. It won the MoMu Fashion Hackathon. Built with a 3D viewer, hotspots, and a product-passport control.`
- image: `/experiments/momuse.jpg` (exists)
- link: `https://momuse.vercel.app/` (exists). Optional add: `https://11labs-rust.vercel.app/`.

## Gaps to close
- **Vaccination robot image** — none in `public/experiments/`. Options: (a) a still from Voxdale / ROB-ID, (b) a simple on-brand placeholder, (c) ship it image-less for now (the panel renders fine without a shot). No known public demo, so likely no external link. *Ward: do you have a Voxdale image or a demo link?*
- **WardBot link** — `https://wardbot.vercel.app/?layer=wardbot`. The portfolio view is not linked.
- Onchain/IOTA and MoMuse already have images + links; only the richer `text` changes.

## Acceptance criteria
- Each of the four shows: title, a preview image (vaccination robot excepted until sourced), one hook `line`, a 2–3 sentence "what I did," and a live link where one exists.
- Copy reads as the core of what I did, in my voice (plain, no dashes).
- No schema or component changes; verified in dark mode, on-system.
- These stay in the experiments board. They do not become `/work/` case pages.

## Notes
- Vaccination-robot copy is grounded in Notion (ROB-ID, Voxdale, robophobia, AR virtual nurse, user research, outcomes in testing).
- Order: strongest first works. If you want the most substantial experiment leading, move **Vaccination robot** to 01 (real client, robotics). Current order is fine too.
