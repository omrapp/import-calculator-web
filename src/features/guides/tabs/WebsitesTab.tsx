import { ExternalLink, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/features/i18n';

import { tradingWebsites } from '../data/websites';
import { searchWebsites } from '../search';
import { EmptyState } from './EmptyState';

export function WebsitesTab({ query }: { query: string }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const websites = searchWebsites(tradingWebsites, query, language);
  if (websites.length === 0) return <EmptyState />;

  return (
    <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {websites.map(site => (
        <li
          key={site.id}
          className="flex flex-col items-start gap-3 rounded-2xl border bg-card p-5 shadow-xs transition-shadow duration-150 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground ring-1 ring-highlight/20 ring-inset"
            >
              <Globe className="size-5" />
            </span>
            <div className="flex min-w-0 flex-col">
              <h2 className="leading-tight font-semibold">
                {site.title[language]}
              </h2>
              <bdi dir="ltr" className="truncate text-xs text-muted-foreground">
                {new URL(site.url).hostname.replace(/^www\./, '')}
              </bdi>
            </div>
          </div>
          <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
            {site.description[language]}
          </p>
          <Button asChild variant="outline" size="sm">
            <a href={site.url} target="_blank" rel="noopener noreferrer">
              {t('guides.visit_website')}
              <ExternalLink />
            </a>
          </Button>
        </li>
      ))}
    </ul>
  );
}
