export const resume = {
  eyebrow: 'Resume',
  title: 'Twenty years designing and building',
  highlight: 'products people rely on.',
  text: 'Factories, healthcare, and government, and Tabulas, the company I founded for digital product identity. The PDF of the full CV can sit here once it is added.',
  snapshot: [
    { label: 'Practice', value: 'Design and build' },
    { label: 'Focus', value: 'Dashboards, vision, identity' },
    { label: 'Fields', value: 'Factories, healthcare, government' },
    { label: 'Company', value: 'Founder, Tabulas' },
  ],
  experience: [
    {
      role: 'Founder',
      company: 'Tabulas',
      period: 'Current',
      text: 'Digital product passports. Identity that stays with the product, and the interface a person uses to read it.',
    },
    {
      role: 'Designer and builder',
      company: 'Independent practice',
      period: 'About twenty years',
      text: 'Interface and product work across factories, healthcare, and government, including OEE dashboards, enterprise platforms, labeling tools, and human-in-the-loop vision.',
    },
  ],
  capabilities: [
    {
      title: 'Industrial interfaces',
      text: 'Dashboards and workflows for people who are operating something, not browsing it.',
    },
    {
      title: 'Human in the loop',
      text: 'Screens where a model proposes and a person confirms, corrects, or teaches.',
    },
    {
      title: 'Build',
      text: 'From the visual system through to a working interface in the browser.',
    },
  ],
  education: [] as { title: string; place: string; period: string }[],
  tools: [] as { name: string; logo: { src: string; width: number; height: number; format: string }; dark: boolean }[],
};
