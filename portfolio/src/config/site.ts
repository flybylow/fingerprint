export interface NavLink {
  label: string;
  href: string;
}

const origin =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  'http://localhost:3000';

export const siteConfig = {
  name: 'Ward De Muynck',
  title: 'Ward De Muynck — design engineer',
  description:
    'Selected work by Ward De Muynck: industrial dashboards, machine-learning interfaces, and product systems, designed and built end to end.',
  siteUrl: origin,
  language: 'en',
  locale: 'en_US',
  dateLocale: 'en-US',
  socialImage: '/portfolio/og-image.png',

  author: {
    name: 'Ward De Muynck',
    role: 'Design engineer',
    location: '',
    email: 'ward@tabulas.eu',
  },

  /** The pill above the homepage headline. Set `enabled: false` to remove it. */
  availability: {
    enabled: false,
    label: 'Design Engineer',
  },

  /** The button at the end of the header and in the mobile menu. Downloads the CV. */
  action: { label: 'Resume', href: '/Ward-De-Muynck-CV.pdf', download: 'Ward-De-Muynck-CV.pdf' },

  /** A PDF in `public/`, offered on the resume page. Leave empty to hide the button. */
  resumePdf: '/Ward-De-Muynck-CV.pdf',

  /** The banner and preferences dialog. Set `enabled: false` to remove both. */
  cookieConsent: {
    enabled: false,
  },

  /** The Signal Portrait demo, on the Next.js app, outside this Astro base. */
  demo: { label: 'Signal Portrait', href: '/' },

  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/warddem' },
    { label: 'X', href: 'https://x.com/WardDeM' },
    { label: 'GitHub', href: 'https://github.com/flybylow' },
  ] satisfies NavLink[],
};

export const navigation: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work/' },
  { label: 'About', href: '/about/' },
  { label: 'Resume', href: '/resume/' },
];

export const legalLinks: NavLink[] = [
  { label: 'Privacy', href: '/privacy/' },
  { label: 'Terms', href: '/terms/' },
  { label: 'Cookies', href: '/cookies/' },
];
