// @vitest-environment node
/// <reference types="node" />
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

import i18next from 'i18next';
import { describe, expect, it } from 'vitest';

import { calculate, type CalculationInput } from '@/features/calc-engine';
import golden from '@/features/calc-engine/__fixtures__/rn-golden.json';
import type { Language } from '@/features/i18n';
import ar from '@/locales/ar.json';
import en from '@/locales/en.json';
import he from '@/locales/he.json';

import type { FontSources } from './fonts';
import { buildPdfModel } from './model';
import { renderPdf } from './renderPdf';

const files = (pkg: string, name: string) => ({
  regular: path.resolve(
    `node_modules/@fontsource/${pkg}/files/${name}-400-normal.woff`,
  ),
  bold: path.resolve(
    `node_modules/@fontsource/${pkg}/files/${name}-700-normal.woff`,
  ),
});
const fonts: FontSources = {
  latin: files('noto-sans', 'noto-sans-latin'),
  hebrew: files('noto-sans-hebrew', 'noto-sans-hebrew-hebrew'),
  arabic: files('ibm-plex-sans-arabic', 'ibm-plex-sans-arabic-arabic'),
};

const fixtures = golden as { name: string; input: CalculationInput }[];
const input = fixtures.find(f => f.name === 'everything combined')!.input;

describe('renderPdf', () => {
  it.each<Language>(['en', 'he', 'ar'])(
    'renders a %s PDF with embedded fonts',
    async language => {
      const i18n = i18next.createInstance();
      await i18n.init({
        lng: language,
        resources: { [language]: { translation: { en, he, ar }[language] } },
        interpolation: { escapeValue: false },
      });
      const model = buildPdfModel(
        {
          v: 1,
          input,
          rates: { source: 'live', lastUpdate: '2026-10-13T12:20:03Z' },
        },
        calculate(input),
        language,
        i18n.t.bind(i18n),
      );
      expect(model.dir).toBe(language === 'en' ? 'ltr' : 'rtl');

      const blob = await renderPdf(model, fonts);
      const bytes = Buffer.from(await blob.arrayBuffer());
      expect(bytes.subarray(0, 4).toString()).toBe('%PDF');
      expect(bytes.length).toBeGreaterThan(10_000);
      // Each script's font is embedded as a subset.
      const text = bytes.toString('latin1');
      expect(text).toContain('NotoSans');
      if (language !== 'en') {
        expect(text).toContain(
          language === 'he' ? 'NotoSansHebrew' : 'IBMPlexSansArabic',
        );
      }

      if (process.env.PDF_OUT) {
        await writeFile(
          path.join(process.env.PDF_OUT, `result-${language}.pdf`),
          bytes,
        );
      }
    },
    20_000,
  );
});
