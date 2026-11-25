import { siteConfig } from '@/config/site';

export interface ApproachLink {
  label: string;
  /** In-portfolio path, or a raw root href when `external` is set. */
  href: string;
  /** Skip `url()` so the link stays on the Next.js app root. */
  external?: boolean;
}

export const approach = {
  eyebrow: 'How I work',
  title: 'From discovery to shipped code',
  intro: 'I run the research, design a solution, and build it.',
  items: [
    {
      n: '01',
      title: 'Design & research',
      lead: 'I create and organize co-creation workshops with all the stakeholders, to align visions and get feedback.',
      body: 'I sit with the people who will use the thing, operators, engineers, and developers, in a room or fully remote. The workshop turns their reality into one roadmap everyone can build from. The design starts from evidence, not a guess.',
      links: [{ label: 'Electrolux', href: '/work/electrolux/' }],
    },
    {
      n: '02',
      title: 'Complex data, made usable',
      lead: 'I take heavy, messy enterprise data and make it something non-experts can act on.',
      body: "Most of my work is large industrial systems with a lot of data and a lot of stakeholders. The data is messy, the users aren't data people, and my job is to surface the one thing they need to act on. I turn it into simple flows and dashboards they actually like to use.",
      links: [{ label: 'Electrolux', href: '/work/electrolux/' }],
    },
    {
      n: '03',
      title: 'I code what I design',
      lead: 'I build the product myself, in React, TypeScript and Node.',
      body: 'I coded from the start of my career, moved into UX and coaching dev teams, then went back to building two years ago when AI changed how products get made. So the interface ships as the real thing, down to the components and the performance, not a spec passed over a wall.',
      links: [
        { label: 'Product Passport', href: '/work/product-passport/' },
        { label: 'Signal Portrait', href: siteConfig.demo.href, external: true },
      ],
    },
    {
      n: '04',
      title: 'AI people trust',
      lead: 'I make AI output something people can actually trust and act on.',
      body: "I've designed several AI products where the result had to make sense to the person using it. At Robovision I rebuilt a labeling tool so non-experts could train models quickly. For Unilin I built a human in the loop system where machine vision catches what the eye misses and the operator stays in control. Lately, dashboards that show provenance, to counter hallucination.",
      links: [],
    },
  ] as {
    n: string;
    title: string;
    lead: string;
    body: string;
    links: ApproachLink[];
  }[],
};
