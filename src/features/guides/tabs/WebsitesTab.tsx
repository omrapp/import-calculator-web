import {
  BarChart3,
  CreditCard,
  ExternalLink,
  Landmark,
  type LucideIcon,
  Ship,
  Store,
  Ticket,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/features/i18n';
import { cn } from '@/lib/utils';

import {
  type TradingWebsite,
  tradingWebsites,
  WEBSITE_CATEGORIES,
  type WebsiteCategory,
} from '../data/websites';
import { searchWebsites } from '../search';
import { EmptyState } from './EmptyState';

/** Icon and colour per category; the hero art is generated from these. */
const CATEGORY_STYLE: Record<
  WebsiteCategory,
  { icon: LucideIcon; hero: string; tint: string }
> = {
  government: {
    icon: Landmark,
    hero: 'from-sky-500/25 via-sky-500/10 to-transparent',
    tint: 'text-sky-700 dark:text-sky-300',
  },
  sourcing: {
    icon: Store,
    hero: 'from-amber-500/25 via-amber-500/10 to-transparent',
    tint: 'text-amber-700 dark:text-amber-300',
  },
  trade_fairs: {
    icon: Ticket,
    hero: 'from-fuchsia-500/25 via-fuchsia-500/10 to-transparent',
    tint: 'text-fuchsia-700 dark:text-fuchsia-300',
  },
  shipping: {
    icon: Ship,
    hero: 'from-teal-500/25 via-teal-500/10 to-transparent',
    tint: 'text-teal-700 dark:text-teal-300',
  },
  research: {
    icon: BarChart3,
    hero: 'from-indigo-500/25 via-indigo-500/10 to-transparent',
    tint: 'text-indigo-700 dark:text-indigo-300',
  },
  payments: {
    icon: CreditCard,
    hero: 'from-emerald-500/25 via-emerald-500/10 to-transparent',
    tint: 'text-emerald-700 dark:text-emerald-300',
  },
  tools: {
    icon: Wrench,
    hero: 'from-rose-500/25 via-rose-500/10 to-transparent',
    tint: 'text-rose-700 dark:text-rose-300',
  },
};

const hostname = (url: string) => new URL(url).hostname.replace(/^www\./, '');

/** Up to two letters from the site's (Latin) name or domain. */
function monogram(site: TradingWebsite): string {
  const words = site.title.en.match(/[A-Za-z0-9]+/g) ?? [hostname(site.url)];
  return words
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();
}

function WebsiteCard({ site }: { site: TradingWebsite }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const style = CATEGORY_STYLE[site.category];
  const Icon = style.icon;

  return (
    <li className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-xs transition-shadow duration-150 hover:shadow-md">
      {/* Generated hero: category gradient, dot grid, icon watermark, monogram.
          The monogram sits outside the clipped art layer so it can overlap
          the card body without being cut in half. */}
      <div aria-hidden className="relative h-24">
        <div
          className={cn(
            'absolute inset-0 isolate overflow-hidden bg-linear-to-br',
            style.hero,
          )}
        >
          <div className="absolute inset-0 -z-10 bg-dot-grid opacity-60 mask-b-from-10% mask-b-to-100%" />
          <Icon
            className={cn(
              'absolute -end-3 -bottom-5 size-28 opacity-15 transition-transform duration-300 group-hover:scale-105',
              style.tint,
            )}
            strokeWidth={1.25}
          />
        </div>
        <span
          className={cn(
            'absolute start-5 bottom-0 z-10 grid size-12 translate-y-1/2 place-items-center rounded-xl border bg-card text-base font-bold shadow-sm',
            style.tint,
          )}
        >
          {monogram(site)}
        </span>
      </div>

      <div className="flex flex-1 flex-col items-start gap-3 px-5 pt-9 pb-5">
        <div className="flex min-w-0 flex-col">
          <h3 className="leading-tight font-semibold">
            {site.title[language]}
          </h3>
          <bdi dir="ltr" className="truncate text-xs text-muted-foreground">
            {hostname(site.url)}
          </bdi>
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
      </div>
    </li>
  );
}

export function WebsitesTab({ query }: { query: string }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [active, setActive] = useState<WebsiteCategory | 'all'>('all');
  const websites = searchWebsites(tradingWebsites, query, language);
  if (websites.length === 0) return <EmptyState />;

  const groups = WEBSITE_CATEGORIES.map(category => ({
    category,
    sites: websites.filter(site => site.category === category),
  })).filter(group => group.sites.length > 0);
  const shown =
    active === 'all' ? groups : groups.filter(g => g.category === active);

  return (
    <div className="flex flex-col gap-8">
      <nav
        aria-label={t('guides.websites.categories')}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {[{ category: 'all' as const, sites: websites }, ...groups].map(
          ({ category, sites }) => {
            const Icon =
              category === 'all' ? null : CATEGORY_STYLE[category].icon;
            const selected = active === category;
            return (
              <Button
                key={category}
                type="button"
                size="sm"
                variant={selected ? 'default' : 'outline'}
                aria-pressed={selected}
                onClick={() => setActive(category)}
                className="shrink-0 rounded-full"
              >
                {Icon && <Icon />}
                {t(`guides.websites.category.${category}`)}
                <span
                  className={cn(
                    'tabular-nums',
                    selected ? 'opacity-80' : 'text-muted-foreground',
                  )}
                >
                  {sites.length}
                </span>
              </Button>
            );
          },
        )}
      </nav>

      {shown.map(({ category, sites }) => {
        const { icon: Icon, tint } = CATEGORY_STYLE[category];
        return (
          <section
            key={category}
            aria-labelledby={`websites-${category}`}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className={cn(
                  'grid size-9 place-items-center rounded-lg bg-accent ring-1 ring-highlight/20 ring-inset [&_svg]:size-4.5',
                  tint,
                )}
              >
                <Icon />
              </span>
              <div className="flex flex-col">
                <h2
                  id={`websites-${category}`}
                  className="text-lg leading-tight font-semibold"
                >
                  {t(`guides.websites.category.${category}`)}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t(`guides.websites.category_lead.${category}`)}
                </p>
              </div>
            </div>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sites.map(site => (
                <WebsiteCard key={site.id} site={site} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
