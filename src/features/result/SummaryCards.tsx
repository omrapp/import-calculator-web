import { useTranslation } from 'react-i18next';

import type { CalculationTotals } from '@/features/calc-engine';
import { formatMoney, formatNumber, useLanguage } from '@/features/i18n';
import { cn } from '@/lib/utils';

export function SummaryCards({ totals }: { totals: CalculationTotals }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const money = (amount: number) => formatMoney(amount, 'ILS', language);

  const cards: { label: string; value: string; primary?: boolean }[] = [
    {
      label: t('result.total_including_vat'),
      value: money(totals.totalIncludingVat),
      primary: true,
    },
    { label: t('result.landed_cost'), value: money(totals.landedCost) },
    ...(totals.importFactor !== null
      ? [
          {
            label: t('result.steps.import_factor'),
            value: formatNumber(totals.importFactor, language, 4),
          },
        ]
      : []),
    ...(totals.shekelPerUnitFactor !== null
      ? [
          {
            label: t('result.steps.shekel_per_unit_factor'),
            value: formatNumber(totals.shekelPerUnitFactor, language, 4),
          },
        ]
      : []),
    ...(totals.chargeableWeight !== undefined
      ? [
          {
            label: t('home.labels.chargeable_weight'),
            value: `${formatNumber(totals.chargeableWeight, language)} ${t('common.kg')}`,
          },
        ]
      : []),
    ...(totals.airFreightUsd !== undefined
      ? [
          {
            label: t('result.steps.total_air_freight'),
            value: formatMoney(totals.airFreightUsd, 'USD', language),
          },
        ]
      : []),
  ];

  return (
    <section aria-label={t('result.summary')}>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cards.map(card => (
          <div
            key={card.label}
            className={cn(
              'rounded-lg border p-3',
              card.primary &&
                'col-span-2 border-primary bg-primary text-primary-foreground sm:col-span-1',
            )}
          >
            <dt
              className={cn(
                'text-xs',
                card.primary ? 'opacity-80' : 'text-muted-foreground',
              )}
            >
              {card.label}
            </dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums">
              <bdi dir="ltr">{card.value}</bdi>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
