// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { siteConfig } from './src/config/site.ts';

const noindexPaths = ['/portfolio/cookies/', '/portfolio/privacy/', '/portfolio/terms/'];

export default defineConfig({
  site: siteConfig.siteUrl,
  base: '/portfolio',
  outDir: '../public/portfolio',
  trailingSlash: 'always',
  server: { port: 4321, host: '127.0.0.1', strictPort: true },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !noindexPaths.includes(new URL(page).pathname),
    }),
  ],
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
