import { ArrowLeftRight, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import type { ExchangeRatesState } from '@/features/fx-rates';
import { formatDate, useLanguage } from '@/features/i18n';

import { NumberField } from '../fields/NumberField';
import { Section } from './Section';

export function RatesSection({
  rates,
  manual,
  onManualChange,
  onUseBankRate,
  onRefresh,
}: {
  rates: ExchangeRatesState;
  manual: boolean;
  onManualChange: () => void;
  onUseBankRate: () => void;
  onRefresh: () => void;
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const hasBankRate = rates.status === 'live' || rates.status === 'cached';

  let status: string;
  if (manual) status = t('calculator.rates.status_manual');
  else if (rates.status === 'loading') status = t('calculator.rates.loading');
  else if (rates.status === 'unavailable')
    status = t('calculator.rates.status_unavailable');
  else
    status = t(`calculator.rates.status_${rates.status}`, {
      date: formatDate(rates.lastUpdate, language),
    });

  return (
    <Section
      tone="rates"
      icon={<ArrowLeftRight />}
      title={t('home.exchange_rates')}
      action={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          aria-label={t('calculator.rates.refresh')}
          title={t('calculator.rates.refresh')}
        >
          <RefreshCw />
        </Button>
      }
    >
      <div className="grid gap-x-3 sm:grid-cols-2">
        <NumberField
          name="rates.USD"
          required
          label={t('home.labels.usd')}
          unit="₪"
          onUserChange={onManualChange}
        />
        <NumberField
          name="rates.EUR"
          required
          label={t('home.labels.eur')}
          unit="₪"
          onUserChange={onManualChange}
        />
      </div>
      <div
        className="flex flex-wrap items-center gap-x-3 text-sm text-muted-foreground"
        role="status"
      >
        <span>{status}</span>
        {manual && hasBankRate && (
          <Button
            type="button"
            variant="link"
            className="h-auto p-0"
            onClick={onUseBankRate}
          >
            {t('calculator.rates.use_bank_rate')}
          </Button>
        )}
      </div>
    </Section>
  );
}
