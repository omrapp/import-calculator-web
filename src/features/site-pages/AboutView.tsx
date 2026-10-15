import {
  BookOpen,
  Calculator,
  Download,
  History,
  Info,
  Languages,
  type LucideIcon,
  Mail,
  Plane,
  TrendingUp,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { RevealGroup, RevealItem } from '@/components/motion';
import { PageHeader } from '@/components/page';
import { Photo } from '@/components/photo';
import { Button } from '@/components/ui/button';

const FEATURES: [string, LucideIcon][] = [
  ['standard', Calculator],
  ['air', Plane],
  ['rates', TrendingUp],
  ['history', History],
  ['export', Download],
  ['guides', BookOpen],
  ['languages', Languages],
];

export function AboutView() {
  const { t } = useTranslation();

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-10">
      <PageHeader
        icon={<Info />}
        photo="container-terminal"
        title={t('nav.about')}
        description={t('settings.about.description')}
      />

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">{t('pages.about.features')}</h2>
        <RevealGroup className="grid gap-3 sm:grid-cols-2">
          {FEATURES.map(([feature, Icon]) => (
            <RevealItem
              key={feature}
              className="flex items-start gap-3 rounded-2xl border bg-card p-4 shadow-xs"
            >
              <span
                aria-hidden
                className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground ring-1 ring-highlight/20 ring-inset"
              >
                <Icon className="size-4.5" />
              </span>
              <p className="pt-1.5 text-sm leading-relaxed">
                {t(`pages.about.feature_${feature}`)}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="grid items-center gap-6 sm:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">{t('pages.about.who')}</h2>
          <p className="leading-relaxed text-muted-foreground">
            {t('pages.about.who_body')}
          </p>
        </div>
        <Photo
          name="port-at-night"
          sizes="(min-width: 640px) 400px, 100vw"
          className="aspect-[4/3] w-full rounded-2xl shadow-sm"
        />
      </section>

      <div className="flex flex-wrap items-center gap-4 border-t pt-6">
        <Button asChild>
          <Link to="/contact">
            <Mail />
            {t('settings.about.contact')}
          </Link>
        </Button>
        <span className="text-sm text-muted-foreground">
          <bdi>{t('pages.about.version', { version: __APP_VERSION__ })}</bdi>
        </span>
      </div>
    </article>
  );
}
