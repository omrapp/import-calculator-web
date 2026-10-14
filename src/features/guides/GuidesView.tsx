import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';

import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/features/i18n';

import { galleryItems } from './data/gallery';
import { presentationSlides } from './data/presentation';
import { searchGallery, searchSlides } from './search';
import { ImageGridTab } from './tabs/ImageGridTab';
import { ModulesTab } from './tabs/ModulesTab';
import { TermsTab } from './tabs/TermsTab';
import { WebsitesTab } from './tabs/WebsitesTab';

const TABS = [
  'guides',
  'presentation',
  'terms',
  'gallery',
  'websites',
] as const;
type Tab = (typeof TABS)[number];

const isTab = (value: string | null): value is Tab =>
  TABS.includes(value as Tab);

export function GuidesView() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [params, setParams] = useSearchParams();
  const param = params.get('tab');
  const tab: Tab = isTab(param) ? param : 'guides';
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.title = t('guides.page_title');
  }, [t]);

  const changeTab = (value: string) => {
    setQuery('');
    setParams({ tab: value }, { replace: true });
  };

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{t('nav.guides')}</h1>
      <Tabs value={tab} onValueChange={changeTab} className="gap-4">
        <TabsList className="h-auto w-full flex-wrap justify-start">
          {TABS.map(value => (
            <TabsTrigger key={value} value={value} className="flex-none">
              {t(`guides.tab_${value}`)}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="relative">
          <Search className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder={t('guides.search_placeholder')}
            aria-label={t('guides.search_label')}
            className="ps-9"
          />
        </div>

        <TabsContent value="guides">
          <ModulesTab query={query} />
        </TabsContent>
        <TabsContent value="presentation">
          <ImageGridTab
            numbered
            items={searchSlides(presentationSlides, query, language).map(
              slide => ({
                id: slide.id,
                image: slide.image,
                title: slide.title[language],
              }),
            )}
          />
        </TabsContent>
        <TabsContent value="terms">
          <TermsTab query={query} />
        </TabsContent>
        <TabsContent value="gallery">
          <ImageGridTab
            downloadable
            items={searchGallery(galleryItems, query, language).map(item => ({
              id: item.id,
              image: item.image,
              title: item.title[language],
              description: item.description[language],
            }))}
          />
        </TabsContent>
        <TabsContent value="websites">
          <WebsitesTab query={query} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
