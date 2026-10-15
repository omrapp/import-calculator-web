import {
  ArrowLeft,
  Check,
  Copy,
  FileWarning,
  Plus,
  Share2,
  SquareSigma,
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
  type Currency,
  encodeCalculation,
} from '@/features/calc-engine';
import { calculatorPath, useOpenInCalculator } from '@/features/calculator-ui';
import { formatDate, formatNumber, useLanguage } from '@/features/i18n';

import { Breakdown } from './Breakdown';
import { CostCharts } from './CostCharts';
import {
  DisplayCurrencyContext,
  urlWithCurrency,
  useDisplayCurrencyParam,
} from './currency';
import { CurrencySwitch } from './CurrencySwitch';
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
  /** The currency the Result is shown in. */
  currency: Currency;
}) => ReactNode;

function Actions({
  shareTitle,
  currency,
  children,
}: {
  shareTitle: string;
  currency: Currency;
  children?: ReactNode;
}) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator.share === 'function';
  const shareUrl = () => urlWithCurrency(window.location.href, currency);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
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
              .share({ title: shareTitle, url: shareUrl() })
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
  const [currency, setCurrency] = useDisplayCurrencyParam();
  const [content, setContent] = useState<HTMLElement | null>(null);

  if (calculation.status === 'invalid') {
    return (
      <section className="mx-auto flex max-w-form flex-col gap-6">
        <PageHeader title={t('result.title')} />
        <EmptyState
          icon={<FileWarning />}
          action={
            <Button asChild>
              <Link to="/calculator">{t('pages.back_to_calculator')}</Link>
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
            prev => {
              const params = new URLSearchParams(prev);
              params.set('c', encodeCalculation({ ...link, meta }));
              return params;
            },
            { replace: true },
          )
        }
        className="rounded-2xl border bg-card px-5 py-4 shadow-xs sm:px-6"
      />
      <Actions
        shareTitle={link.meta?.title ?? t('result.title')}
        currency={currency}
      >
        {actions?.({ link, result, content, currency })}
      </Actions>
      <CurrencySwitch value={currency} onChange={setCurrency} />
      <DisplayCurrencyContext value={{ currency, rates: link.input.rates }}>
        <SummaryCards totals={result.totals} />
        <CostCharts result={result} />
        <Breakdown steps={result.steps} />
      </DisplayCurrencyContext>
      <Link
        to="/examples"
        data-export-ignore
        className="inline-flex w-fit items-center gap-1.5 rounded-sm text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring print:hidden"
      >
        <SquareSigma aria-hidden className="size-4" />
        {t('examples.see_examples')}
      </Link>
    </article>
  );
}
