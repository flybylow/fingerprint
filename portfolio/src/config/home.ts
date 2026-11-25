export const hero = {
  greeting: '',
  title: 'I design the hard parts,',
  highlight: 'then I build them.',
  text: 'I turn dense, data-heavy screens into a system people love to use.',
  primary: { label: 'See selected work', href: '/#work' },
  facts: [
    { value: '20+', label: 'Years' },
    { value: '5', label: 'Industries' },
    { value: '3', label: 'Continents' },
  ],
};

export const work = {
  eyebrow: 'Selected work',
  title: 'Case studies',
  text: 'Two deep dives on recent projects, the rest is on the work page.',
  /** How many featured case studies the homepage shows. */
  limit: 2,
};

export const testimonials = {
  eyebrow: 'Kind words',
  title: 'What teams say',
  items: [] as { quote: string; name: string; role: string }[],
};

export const closing = {
  eyebrow: "Let's work together",
  title: 'A system that needs to be clearer?',
  highlight: "Let's talk.",
  text: 'I design and build products where the interface has to carry a complicated reality. Write to me.',
};
