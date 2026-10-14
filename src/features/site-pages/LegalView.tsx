import { FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/page';

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
    <article className="mx-auto flex max-w-prose-tight flex-col gap-8">
      <PageHeader
        icon={<FileText />}
        title={t(titleKey)}
        meta={
          <span>
            {t('pages.effective_date', {
              date: formatDate(legal.effectiveDate, language),
            })}
          </span>
        }
      />
      {import.meta.env.DEV && (
        <p className="rounded-xl border border-dashed p-3 text-sm text-muted-foreground">
          {t('pages.draft_notice')}
        </p>
      )}
      {legal.sections[language].map(section => (
        <section key={section.heading} className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">{section.heading}</h2>
          {section.body.map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-foreground/85">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}
