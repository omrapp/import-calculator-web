/// <reference types="vitest/config" />
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Connect, type Plugin } from 'vite';

import { GET as getRatesResponse } from './api/rates.ts';

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
