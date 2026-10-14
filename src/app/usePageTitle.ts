import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { type UIMatch, useMatches } from 'react-router';

export type RouteHandle = { titleKey?: string };

/** `<Page> — Import Calculator` from the deepest route's `handle.titleKey`. */
export function usePageTitle() {
  const { t } = useTranslation();
  const matches = useMatches() as UIMatch<unknown, RouteHandle | undefined>[];
  const titleKey = matches.findLast(match => match.handle?.titleKey)?.handle
    ?.titleKey;

  useEffect(() => {
    const site = t('home.title');
    document.title = titleKey ? `${t(titleKey)} — ${site}` : site;
  }, [t, titleKey]);
}
