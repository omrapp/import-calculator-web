import {
  BookA,
  BookOpen,
  GraduationCap,
  type LucideIcon,
  Presentation,
  Search,
  SquareSigma,
} from 'lucide-react';
import * as m from 'motion/react-m';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useSearchParams } from 'react-router';

import { PageHeader } from '@/components/page';
import { JsonLd } from '@/components/seo/JsonLd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/features/i18n';
import { duration, ease, spring } from '@/lib/motion';

import { presentationSlides } from './data/presentation';
import { tradeTerms } from './data/terms';
import { searchSlides } from './search';
import { ImageGridTab } from './tabs/ImageGridTab';
import { ModulesTab } from './tabs/ModulesTab';
import { TermsTab } from './tabs/TermsTab';

const TABS = ['guides', 'presentation', 'terms'] as const;
type Tab = (typeof TABS)[number];

const ICONS: Record<Tab, LucideIcon> = {
  guides: GraduationCap,
  presentation: Presentation,
  terms: BookA,
};

const isTab = (value: string | null): value is Tab =>
  TABS.includes(value as Tab);

/** Fades a tab's content in each time the tab is shown. */
function Pane({ children }: { children: ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 6 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: duration.normal, ease: ease.outQuart },
      }}
    >
      {children}
    </m.div>
  );
}

export function GuidesView() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [params, setParams] = useSearchParams();
  const param = params.get('tab');
  const tab: Tab = isTab(param) ? param : 'guides';
  const [query, setQuery] = useState('');
  const tabList = useRef<HTMLDivElement>(null);

  // On narrow screens the tab row scrolls; keep the active tab in view.
  useEffect(() => {
    tabList.current
      ?.querySelector<HTMLElement>('[role="tab"][data-state="active"]')
      ?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  }, [tab]);

  const changeTab = (value: string) => {
    setQuery('');
    setParams({ tab: value }, { replace: true });
  };

  // Websites moved to its own page; keep old tab links working.
  if (param === 'websites') return <Navigate to="/websites" replace />;

  return (
    <section className="flex flex-col gap-6">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          inLanguage: language,
          mainEntity: tradeTerms.map(term => ({
            '@type': 'Question',
            name: `${term.term}: ${term.name[language]}`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: term.description[language],
            },
          })),
        }}
      />
      <PageHeader
        icon={<BookOpen />}
        photo="container-yard-aerial"
        title={t('nav.guides')}
        description={t('guides.lead')}
        actions={
          <Button asChild variant="outline">
            <Link to="/examples">
              <SquareSigma />
              {t('examples.see_examples')}
            </Link>
          </Button>
        }
      />
      <Tabs value={tab} onValueChange={changeTab} className="gap-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <TabsList
            ref={tabList}
            className="h-auto w-full justify-start overflow-x-auto rounded-xl p-1 [scrollbar-width:none] lg:w-fit"
          >
            {TABS.map(value => {
              const Icon = ICONS[value];
              return (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="isolate h-9 flex-none rounded-lg px-3 data-[state=active]:bg-transparent group-data-[variant=default]/tabs-list:data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent"
                >
                  {tab === value && (
                    <m.span
                      layoutId="guides-tab"
                      transition={spring.indicator}
                      className="absolute inset-0 -z-10 rounded-lg bg-card shadow-sm ring-1 ring-border/60"
                    />
                  )}
                  <Icon aria-hidden />
                  {t(`guides.tab_${value}`)}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="relative lg:w-72">
            <Search className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder={t('guides.search_placeholder')}
              aria-label={t('guides.search_label')}
              className="h-10 rounded-xl ps-9"
            />
          </div>
        </div>

        <TabsContent value="guides">
          <Pane>
            <ModulesTab query={query} />
          </Pane>
        </TabsContent>
        <TabsContent value="presentation">
          <Pane>
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
          </Pane>
        </TabsContent>
        <TabsContent value="terms">
          <Pane>
            <TermsTab query={query} />
          </Pane>
        </TabsContent>
      </Tabs>
    </section>
  );
}
