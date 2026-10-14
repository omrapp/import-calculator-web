import { ExternalLink } from 'lucide-react';
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
          className="flex flex-col items-start gap-2 rounded-lg border p-4"
        >
          <h2 className="font-semibold">{site.title[language]}</h2>
          <p className="flex-1 text-sm text-muted-foreground">
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
