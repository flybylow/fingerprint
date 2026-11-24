export const hero = {
  greeting: "Hi, I'm Ward.",
  title: 'I design the hard parts, then',
  highlight: 'I build them.',
  text: 'I turn dense, data-heavy systems into screens people can actually use.',
  primary: { label: 'See selected work', href: '/#work' },
  secondary: { label: 'Signal Portrait', href: '~/' },
  facts: [
    { value: '20+', label: 'years in product design' },
    { value: '5', label: 'industries, from steel to healthcare' },
    { value: 'Now', label: 'founder, building my own product' },
  ],
};

export const work = {
  eyebrow: 'Selected work',
  title: 'Case studies',
  text: 'Industrial dashboards, the workflow around a vision model, and a passport that stays with the product.',
  /** How many featured case studies the homepage shows. */
  limit: 5,
};

export const ai = {
  eyebrow: 'AI & machine learning',
  title: 'Interfaces for systems that learn',
  text: 'A lot of my work sits in front of a model. I design the screens where people train it, correct it, and decide when to trust it, and lately I build those products end to end myself.',
  items: [
    { title: 'Robovision', text: 'The workflow around a computer-vision model: labeling, review, and the moment a person overrules the machine.' },
    { title: 'WardBot', text: 'An AI agent that answers questions about my work, wired up and shipped end to end.' },
    { title: 'Signal Portrait', text: 'This demo: device intelligence turned into something you can watch react in real time.' },
  ],
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
      text: 'The interface does not stop in the design file. I take it to production in React, down to performance and the edge cases.',
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
