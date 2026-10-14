import { describe, expect, it } from 'vitest';

import { SUPPORTED_LANGUAGES } from '@/features/i18n';
import { LANGUAGE_PARAM as DETECT_PARAM } from '@/features/i18n/detect';

import {
  alternates,
  LANGUAGE_PARAM,
  robotsTxt,
  SEO_LANGUAGES,
  sitemapXml,
} from './site';

describe('seo site data', () => {
  it('matches the app languages and language parameter', () => {
    expect([...SEO_LANGUAGES]).toEqual([...SUPPORTED_LANGUAGES]);
    expect(LANGUAGE_PARAM).toBe(DETECT_PARAM);
  });

  it('builds hreflang alternates with x-default', () => {
    expect(alternates('https://example.com/', '/guides')).toEqual([
      { hreflang: 'en', href: 'https://example.com/guides?lang=en' },
      { hreflang: 'he', href: 'https://example.com/guides?lang=he' },
      { hreflang: 'ar', href: 'https://example.com/guides?lang=ar' },
      { hreflang: 'x-default', href: 'https://example.com/guides' },
    ]);
  });

  it('lists every indexable page per language, never /result', () => {
    const xml = sitemapXml('https://example.com');
    expect(xml).toContain('<loc>https://example.com/?lang=he</loc>');
    expect(xml).toContain(
      '<loc>https://example.com/air-shipment?lang=ar</loc>',
    );
    expect(xml).toContain(
      'hreflang="x-default" href="https://example.com/terms"',
    );
    expect(xml.match(/<url>/g)).toHaveLength(7 * 3);
    expect(xml).not.toContain('/result');
    expect(xml).not.toContain('/history');
  });

  it('disallows /result and points at the sitemap when the URL is known', () => {
    expect(robotsTxt()).toBe('User-agent: *\nDisallow: /result\n');
    expect(robotsTxt('https://example.com')).toContain(
      'Sitemap: https://example.com/sitemap.xml',
    );
  });
});
