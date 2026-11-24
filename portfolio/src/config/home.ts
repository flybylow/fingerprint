export const hero = {
  greeting: "Hi, I'm Ward.",
  title: 'I design the hard parts, then',
  highlight: 'I build them.',
  text: 'About twenty years across factories, healthcare, and government. I founded Tabulas, which works on digital identity for products.',
  primary: { label: 'See selected work', href: '/#work' },
  secondary: { label: 'Signal Portrait', href: '~/' },
  facts: [
    { value: '20+', label: 'years designing and building' },
    { value: '3', label: 'fields: factories, care, government' },
    { value: '1', label: 'company founded, Tabulas' },
  ],
};

export const work = {
  eyebrow: 'Selected work',
  title: 'Case studies',
  text: 'Industrial dashboards, the workflow around a vision model, and a passport that stays with the product.',
  /** How many featured case studies the homepage shows. */
  limit: 5,
};

export const services = {
  eyebrow: 'What I do',
  title: 'From a dense system to a screen someone can use',
  items: [
    {
      icon: 'lightbulb',
      title: 'Product framing',
      text: 'Finding the decision the screen has to support, and leaving the rest one step away.',
    },
    {
      icon: 'workflow',
      title: 'Workflows',
      text: 'Paths for factories, labeling queues, and systems where a person still has to judge.',
    },
    {
      icon: 'layers',
      title: 'Interface systems',
      text: 'Type, color, and components that stay coherent once the product grows.',
    },
    {
      icon: 'pen-tool',
      title: 'Build',
      text: 'The interface does not stop at a file. I design it and I build it.',
    },
  ],
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
  text: 'I design and build products where the interface has to carry a complicated reality. Write to ward@tabulas.eu.',
};
