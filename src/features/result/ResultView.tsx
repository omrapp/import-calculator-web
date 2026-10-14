import {
  ArrowLeft,
  Check,
  Copy,
  FileWarning,
  Plus,
  Share2,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';

import { ExportBrandHeader } from '@/components/brand';
import {
  CalculationMetaEditor,
  EmptyState,
  ModeBadge,
  PageHeader,
} from '@/components/page';
import { Button } from '@/components/ui/button';
import {
  type CalculationLink,
  type CalculationResult,
  encodeCalculation,
} from '@/features/calc-engine';
import { calculatorPath, useOpenInCalculator } from '@/features/calculator-ui';
import { formatDate, formatNumber, useLanguage } from '@/features/i18n';

import { Breakdown } from './Breakdown';
import { SummaryCards } from './SummaryCards';
import { useCalculationFromUrl } from './useCalculationFromUrl';

function RatesNote({ link }: { link: CalculationLink }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { source, lastUpdate } = link.rates;
  const note =
    source === 'manual' || !lastUpdate
      ? t('result.rates_manual')
      : t(`calculator.rates.status_${source}`, {
          date: formatDate(lastUpdate, language),
        });
  return (
    <p data-testid="rates-note">
      {note} ·{' '}
      <bdi dir="ltr">
        {t('result.rates_used', {
          usd: formatNumber(link.input.rates.USD, language, 4, 0),
          eur: formatNumber(link.input.rates.EUR, language, 4, 0),
        })}
      </bdi>
    </p>
  );
}

/** Extra Result actions supplied by other modules (Save, Export). */
export type ResultActions = (args: {
  link: CalculationLink;
  result: CalculationResult;
  /** The rendered Result, for image export; null before mount. */
  content: HTMLElement | null;
}) => ReactNode;

function Actions({
  shareTitle,
  children,
}: {
  shareTitle: string;
  children?: ReactNode;
}) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator.share === 'function';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="grid grid-cols-2 gap-2 print:hidden sm:flex sm:flex-wrap"
      data-export-ignore
    >
      {children}
      <Button type="button" variant="outline" onClick={() => void copyLink()}>
        {copied ? <Check /> : <Copy />}
        {copied ? t('result.link_copied') : t('result.copy_link')}
      </Button>
      {canShare && (
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            void navigator
              .share({ title: shareTitle, url: window.location.href })
              .catch(() => undefined)
          }
        >
          <Share2 />
          {t('result.share')}
        </Button>
      )}
    </div>
  );
}

function BackBar({ link }: { link: CalculationLink }) {
  const { t } = useTranslation();
  const openInCalculator = useOpenInCalculator();

  return (
    <div
      className="flex items-center justify-between gap-2 print:hidden"
      data-export-ignore
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ms-2.5"
        onClick={() => openInCalculator(link)}
      >
        <ArrowLeft className="rtl:-scale-x-100" />
        {t('result.edit')}
      </Button>
      <Button asChild variant="ghost" size="sm" className="-me-2.5">
        <Link to={calculatorPath(link.input.mode)}>
          <Plus />
          {t('result.new_calculation')}
        </Link>
      </Button>
    </div>
  );
}

export function ResultView({ actions }: { actions?: ResultActions }) {
  const { t } = useTranslation();
  const calculation = useCalculationFromUrl();
  const [, setSearchParams] = useSearchParams();
  const [content, setContent] = useState<HTMLElement | null>(null);

  if (calculation.status === 'invalid') {
    return (
      <section className="mx-auto flex max-w-form flex-col gap-6">
        <PageHeader title={t('result.title')} />
        <EmptyState
          icon={<FileWarning />}
          action={
            <Button asChild>
              <Link to="/">{t('pages.back_to_calculator')}</Link>
            </Button>
          }
        >
          <p role="alert">{t('result.invalid_link')}</p>
        </EmptyState>
      </section>
    );
  }

  const { link, result } = calculation;
  return (
    <article
      ref={setContent}
      className="mx-auto flex max-w-form flex-col gap-6 bg-background"
    >
      <ExportBrandHeader />
      <BackBar link={link} />
      <PageHeader
        title={t('result.title')}
        meta={
          <>
            <ModeBadge mode={link.input.mode} />
            <RatesNote link={link} />
          </>
        }
      />
      <CalculationMetaEditor
        meta={link.meta}
        fallbackTitle={t('calculation_meta.untitled')}
        onSave={meta =>
          // The title travels in the link, so editing it updates the URL.
          setSearchParams(
            { c: encodeCalculation({ ...link, meta }) },
            { replace: true },
          )
        }
        className="rounded-2xl border bg-card px-5 py-4 shadow-xs sm:px-6"
      />
      <Actions shareTitle={link.meta?.title ?? t('result.title')}>
        {actions?.({ link, result, content })}
      </Actions>
      <SummaryCards totals={result.totals} />
      <Breakdown steps={result.steps} />
    </article>
  );
}
