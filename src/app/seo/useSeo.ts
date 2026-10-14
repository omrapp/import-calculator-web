import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { type UIMatch, useLocation, useMatches } from 'react-router';

import { alternates, pageUrl } from './site';

export type RouteHandle = {
  titleKey?: string;
  /** Meta description; falls back to `seo.description.default`. */
  descriptionKey?: string;
  /** Adds `robots: noindex` (pages whose content lives in the URL). */
  noindex?: boolean;
};

/** Deploy origin, e.g. https://example.com. Unset: no canonical or hreflang. */
const siteUrl = (): string | undefined =>
  import.meta.env.VITE_SITE_URL || undefined;

const MANAGED = 'data-seo';

function setMeta(attribute: 'name' | 'property', key: string, value: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`,
  );
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.append(tag);
  }
  tag.content = value;
}

/** Replaces the links this hook added last time with a fresh set. */
function setLinks(links: { rel: string; href: string; hreflang?: string }[]) {
  document.head
    .querySelectorAll(`link[${MANAGED}]`)
    .forEach(link => link.remove());
  for (const { rel, href, hreflang } of links) {
    const link = document.createElement('link');
    link.setAttribute(MANAGED, '');
    link.rel = rel;
    link.href = href;
    if (hreflang) link.hreflang = hreflang;
    document.head.append(link);
  }
}

/**
 * Head tags for the current route: `<Page> — Import Calculator` title,
 * description, Open Graph / Twitter copies, robots, canonical and hreflang.
 */
export function useSeo() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const matches = useMatches() as UIMatch<unknown, RouteHandle | undefined>[];
  const handle = matches.findLast(match => match.handle)?.handle ?? {};
  const { titleKey, descriptionKey, noindex = false } = handle;
  const language = i18n.language;

  useEffect(() => {
    const site = t('home.title');
    const title = titleKey ? `${t(titleKey)} — ${site}` : site;
    const description = t(descriptionKey ?? 'seo.description.default');

    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:locale', language);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');

    const origin = siteUrl();
    if (!origin || noindex) {
      setLinks([]);
      return;
    }
    const canonical = pageUrl(origin, pathname, language);
    setMeta('property', 'og:url', canonical);
    setLinks([
      { rel: 'canonical', href: canonical },
      ...alternates(origin, pathname).map(link => ({
        rel: 'alternate',
        ...link,
      })),
    ]);
  }, [t, titleKey, descriptionKey, noindex, pathname, language]);
}
