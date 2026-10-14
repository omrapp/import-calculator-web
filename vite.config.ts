/// <reference types="vitest/config" />
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv, type Connect, type Plugin } from 'vite';

import { GET as getRatesResponse } from './api/rates.ts';
import { pageUrl, robotsTxt, sitemapXml } from './src/app/seo/site.ts';

/** Serves api/rates.ts on the dev and preview servers, as Vercel does in production. */
function ratesApi(): Plugin {
  const handler: Connect.NextHandleFunction = (_req, res) => {
    void getRatesResponse().then(async response => {
      res.statusCode = response.status;
      response.headers.forEach((value, key) => res.setHeader(key, value));
      res.end(await response.text());
    });
  };
  return {
    name: 'rates-api',
    configureServer: server => {
      server.middlewares.use('/api/rates', handler);
    },
    configurePreviewServer: server => {
      server.middlewares.use('/api/rates', handler);
    },
  };
}

/**
 * Emits robots.txt, and with VITE_SITE_URL set also sitemap.xml, og:url and
 * absolute preview-image URLs (social crawlers do not run JavaScript).
 */
function seo(): Plugin {
  let siteUrl: string | undefined;
  return {
    name: 'seo',
    configResolved: config => {
      siteUrl = loadEnv(
        config.mode,
        config.envDir || process.cwd(),
        'VITE_',
      ).VITE_SITE_URL;
    },
    transformIndexHtml: html =>
      siteUrl
        ? html
            .replaceAll(
              'content="/og-image.png"',
              `content="${pageUrl(siteUrl, '/og-image.png')}"`,
            )
            .replace(
              '<meta property="og:type"',
              `<meta property="og:url" content="${pageUrl(siteUrl, '/')}" />\n    <meta property="og:type"`,
            )
        : html,
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: robotsTxt(siteUrl),
      });
      if (siteUrl) {
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: sitemapXml(siteUrl),
        });
      }
    },
  };
}

// https://vite.dev/config/
const { version } = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as { version: string };

export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(version) },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    ratesApi(),
    seo(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Heavy jsdom suites (forms, dialogs) run in parallel; 5s is too tight.
    testTimeout: 15_000,
  },
});
