// Plain data and string builders, shared by the app (useSeo) and the Vite
// build (sitemap.xml, robots.txt), so no aliases or browser APIs here.

export const SITE_NAME = 'Import Calculator';

/** Same as SUPPORTED_LANGUAGES; locales.test checks they match. */
export const SEO_LANGUAGES = ['en', 'he', 'ar'] as const;

/** Query parameter a language link carries; read and stripped on load. */
export const LANGUAGE_PARAM = 'lang';

/** Routes worth a search result. History and Settings are per-browser. */
export const INDEXABLE_PATHS = [
  '/',
  '/air-shipment',
  '/guides',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
] as const;

/** Never indexed: a result page is one person's numbers in the URL. */
export const DISALLOWED_PATHS = ['/result'] as const;

const trimSlash = (url: string) => url.replace(/\/+$/, '');

export function pageUrl(siteUrl: string, path: string, language?: string) {
  const url = `${trimSlash(siteUrl)}${path}`;
  return language ? `${url}?${LANGUAGE_PARAM}=${language}` : url;
}

/** hreflang links for one page: one per language, plus x-default. */
export function alternates(siteUrl: string, path: string) {
  return [
    ...SEO_LANGUAGES.map(language => ({
      hreflang: language as string,
      href: pageUrl(siteUrl, path, language),
    })),
    { hreflang: 'x-default', href: pageUrl(siteUrl, path) },
  ];
}

export function sitemapXml(siteUrl: string) {
  const urls = INDEXABLE_PATHS.flatMap(path =>
    SEO_LANGUAGES.map(language => {
      const links = alternates(siteUrl, path)
        .map(
          ({ hreflang, href }) =>
            `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href.replaceAll('&', '&amp;')}"/>`,
        )
        .join('\n');
      return `  <url>\n    <loc>${pageUrl(siteUrl, path, language)}</loc>\n${links}\n  </url>`;
    }),
  );
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
}

export function robotsTxt(siteUrl?: string) {
  const lines = [
    'User-agent: *',
    ...DISALLOWED_PATHS.map(path => `Disallow: ${path}`),
    '',
  ];
  if (siteUrl) lines.push(`Sitemap: ${pageUrl(siteUrl, '/sitemap.xml')}`, '');
  return lines.join('\n');
}
