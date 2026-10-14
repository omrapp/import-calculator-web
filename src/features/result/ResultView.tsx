import { Check, Copy, Pencil, Plus, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import type { CalculationLink } from '@/features/calc-engine';
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
    <p className="text-sm text-muted-foreground" data-testid="rates-note">
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

function Actions({ link }: { link: CalculationLink }) {
  const { t } = useTranslation();
  const openInCalculator = useOpenInCalculator();
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
    <div className="flex flex-wrap gap-2">
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
              .share({ title: t('result.title'), url: window.location.href })
              .catch(() => undefined)
          }
        >
          <Share2 />
          {t('result.share')}
        </Button>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={() => openInCalculator(link)}
      >
        <Pencil />
        {t('result.edit')}
      </Button>
      <Button asChild variant="ghost">
        <Link to={calculatorPath(link.input.mode)}>
          <Plus />
          {t('result.new_calculation')}
        </Link>
      </Button>
    </div>
  );
}

export function ResultView() {
  const { t } = useTranslation();
  const calculation = useCalculationFromUrl();

  useEffect(() => {
    document.title = t('result.page_title');
  }, [t]);

  if (calculation.status === 'invalid') {
    return (
      <section className="mx-auto flex max-w-3xl flex-col items-start gap-4">
        <h1 className="text-2xl font-semibold">{t('result.title')}</h1>
        <p role="alert">{t('result.invalid_link')}</p>
        <Button asChild>
          <Link to="/">{t('pages.back_to_calculator')}</Link>
        </Button>
      </section>
    );
  }

  const { link, result } = calculation;
  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{t('result.title')}</h1>
        <p className="text-sm font-medium">
          {t(
            link.input.mode === 'standard'
              ? 'nav.standard'
              : 'nav.air_shipment',
          )}
        </p>
        <RatesNote link={link} />
      </header>
      <Actions link={link} />
      <SummaryCards totals={result.totals} />
      <Breakdown steps={result.steps} />
    </article>
  );
}
