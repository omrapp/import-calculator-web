import { Hash, ListTree, Map as MapIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@/features/i18n';
import { cn } from '@/lib/utils';

import { learningModules } from '../data/learning-modules';
import { ImportFlowDiagram } from '../docs/diagrams';
import { CATEGORY_STYLE } from '../docs/categoryStyle';
import { ModuleExtras } from '../docs/moduleExtras';
import { RichText } from '../RichText';
import { searchModules } from '../search';
import { EmptyState } from './EmptyState';

const OVERVIEW_ID = 'overview';
const sectionId = (id: string) => `module-${id}`;

/** Highlights the section currently in the reading band of the viewport. */
function useActiveSection(ids: string[]): string | undefined {
  const [active, setActive] = useState<string | undefined>(ids[0]);
  const key = ids.join(',');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-15% 0px -70% 0px' },
    );
    for (const id of key.split(',')) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [key]);

  return active;
}

/** On first load, jump to a #module-N deep link once the sections exist. */
function useHashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView?.();
  }, []);
}

function Toc({
  items,
  active,
}: {
  items: { id: string; label: string }[];
  active: string | undefined;
}) {
  return (
    <ol className="flex flex-col border-s">
      {items.map(item => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            aria-current={active === item.id ? 'location' : undefined}
            className={cn(
              '-ms-px block border-s-2 border-transparent py-1.5 ps-3 text-sm text-muted-foreground transition-colors hover:text-foreground',
              active === item.id &&
                'border-primary font-medium text-foreground',
            )}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  );
}

/** The Guides tab as a documentation page: index, overview diagram, one anchored section per module. */
export function ModulesTab({ query }: { query: string }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const modules = searchModules(learningModules, query, language);
  const searching = query.trim() !== '';
  const items = [
    ...(searching
      ? []
      : [{ id: OVERVIEW_ID, label: t('guides.docs.overview_title') }]),
    ...modules.map(module => ({
      id: sectionId(module.id),
      label: module.title[language],
    })),
  ];
  const active = useActiveSection(items.map(item => item.id));
  useHashScroll();

  if (modules.length === 0) return <EmptyState />;

  return (
    <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <nav aria-label={t('guides.docs.on_this_page')} className="lg:order-none">
        {/* Mobile: collapsible index. Desktop: sticky sidebar. */}
        <details className="rounded-2xl border bg-card p-4 shadow-xs lg:hidden">
          <summary className="flex cursor-pointer items-center gap-2 font-semibold">
            <ListTree aria-hidden className="size-4" />
            {t('guides.docs.on_this_page')}
          </summary>
          <div className="mt-3">
            <Toc items={items} active={active} />
          </div>
        </details>
        <div className="sticky top-24 hidden max-h-[calc(100dvh-8rem)] flex-col gap-3 overflow-y-auto lg:flex">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <ListTree aria-hidden className="size-4" />
            {t('guides.docs.on_this_page')}
          </p>
          <Toc items={items} active={active} />
        </div>
      </nav>

      <div className="flex min-w-0 flex-col gap-12">
        {!searching && (
          <section
            id={OVERVIEW_ID}
            aria-labelledby={`${OVERVIEW_ID}-title`}
            className="flex scroll-mt-24 flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"
              >
                <MapIcon className="size-5" />
              </span>
              <h2 id={`${OVERVIEW_ID}-title`} className="text-title">
                {t('guides.docs.overview_title')}
              </h2>
            </div>
            <p className="max-w-prose leading-relaxed text-muted-foreground">
              {t('guides.docs.overview_lead')}
            </p>
            <ImportFlowDiagram />
          </section>
        )}

        {modules.map(module => {
          const id = sectionId(module.id);
          const style =
            CATEGORY_STYLE[module.category] ?? CATEGORY_STYLE.regulations;
          const Icon = style.icon;
          return (
            <section
              key={module.id}
              id={id}
              aria-labelledby={`${id}-title`}
              className="flex scroll-mt-24 flex-col gap-4 border-t pt-8 first:border-t-0 first:pt-0"
            >
              <div className="flex flex-col gap-2">
                <span
                  className={cn(
                    'inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                    style.badge,
                  )}
                >
                  <Icon aria-hidden className="size-3.5" />
                  {t(`guides.docs.category.${module.category}`)}
                </span>
                <h2
                  id={`${id}-title`}
                  className="group flex items-center gap-2 text-xl font-semibold"
                >
                  {module.title[language]}
                  <a
                    href={`#${id}`}
                    aria-label={t('guides.docs.link_to_section')}
                    className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    <Hash className="size-4" />
                  </a>
                </h2>
              </div>
              <ModuleExtras id={module.id} slot="before" />
              <div className="max-w-prose">
                <RichText text={module.content[language]} />
              </div>
              <ModuleExtras id={module.id} slot="after" />
            </section>
          );
        })}
      </div>
    </div>
  );
}
