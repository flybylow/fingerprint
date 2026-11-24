export const minor = {
  eyebrow: 'Smaller work',
  title: 'Experiments, prototypes, and hackathons',
  text: 'Shorter pieces, built to try an idea or win a weekend. Not full case studies.',
  items: [
    {
      title: 'WardBot',
      text: 'An AI agent that answers questions about my work. An experiment, not a client job.',
      tag: 'ai agent',
    },
    {
      title: 'Vaccination robot',
      text: 'Patient experience for an automated vaccination robot: robotics meeting a calm, legible interface.',
      tag: 'robotics',
    },
    {
      title: 'Onchain pieces',
      text: 'A handful of blockchain explorations around asset tracking and verifiable records.',
      tag: 'onchain',
    },
    {
      title: 'MOMU museum voice',
      text: 'A voice interface that explains museum data in plain language. A hackathon concept.',
      tag: 'voice',
    },
    {
      title: 'IOTA hackathons',
      text: 'Two hackathon wins building fast prototypes on IOTA under time pressure.',
      tag: '2x win',
    },
  ] as { title: string; text: string; tag?: string; href?: string }[],
};
