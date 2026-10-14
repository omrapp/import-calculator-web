import { Check, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';

const FEATURES = [
  'standard',
  'air',
  'rates',
  'history',
  'export',
  'guides',
  'languages',
] as const;

export function AboutView() {
  const { t } = useTranslation();

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-6">
      <h1 className="text-2xl font-semibold">{t('nav.about')}</h1>
      <p className="leading-relaxed">{t('settings.about.description')}</p>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{t('pages.about.features')}</h2>
        <ul className="flex flex-col gap-2">
          {FEATURES.map(feature => (
            <li key={feature} className="flex items-start gap-2">
              <Check className="mt-1 size-4 shrink-0 text-primary" />
              {t(`pages.about.feature_${feature}`)}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{t('pages.about.who')}</h2>
        <p className="leading-relaxed">{t('pages.about.who_body')}</p>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <Button asChild>
          <Link to="/contact">
            <Mail />
            {t('settings.about.contact')}
          </Link>
        </Button>
        <span className="text-sm text-muted-foreground">
          {t('pages.about.version', { version: __APP_VERSION__ })}
        </span>
      </div>
    </article>
  );
}
