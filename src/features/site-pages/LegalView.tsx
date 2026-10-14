import { useTranslation } from 'react-i18next';

import { formatDate, useLanguage } from '@/features/i18n';

import type { LegalDocument } from './content/types';

export function LegalView({
  titleKey,
  document: legal,
}: {
  titleKey: string;
  document: LegalDocument;
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{t(titleKey)}</h1>
        <p className="text-sm text-muted-foreground">
          {t('pages.effective_date', {
            date: formatDate(legal.effectiveDate, language),
          })}
        </p>
        {import.meta.env.DEV && (
          <p className="rounded-md border border-dashed p-2 text-sm">
            {t('pages.draft_notice')}
          </p>
        )}
      </header>
      {legal.sections[language].map(section => (
        <section key={section.heading} className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">{section.heading}</h2>
          {section.body.map((paragraph, i) => (
            <p key={i} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}
