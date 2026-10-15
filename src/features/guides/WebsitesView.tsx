import { Globe, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/page';
import { Input } from '@/components/ui/input';

import { WebsitesTab } from './tabs/WebsitesTab';

export function WebsitesView() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        icon={<Globe />}
        title={t('guides.title_websites')}
        description={t('guides.websites.lead')}
      />
      <div className="relative lg:w-72">
        <Search className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder={t('guides.search_placeholder')}
          aria-label={t('guides.websites.search_label')}
          className="h-10 rounded-xl ps-9"
        />
      </div>
      <WebsitesTab query={query} />
    </section>
  );
}
