import { useTranslation } from 'react-i18next';

import { AnimatedNumber, RevealGroup, RevealItem } from '@/components/motion';

import type { CalculationTotals } from '@/features/calc-engine';
import { formatMoney, formatNumber, useLanguage } from '@/features/i18n';

export function SummaryCards({ totals }: { totals: CalculationTotals }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const money = (amount: number) => formatMoney(amount, 'ILS', language);

  const cards: { label: string; value: string }[] = [
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
    <section aria-label={t('result.summary')} className="flex flex-col gap-3">
      <dl>
        <div className="relative isolate overflow-hidden rounded-2xl bg-brand p-5 text-white shadow-lg ring-1 ring-highlight/40 sm:p-6">
          <div
            aria-hidden
            className="absolute inset-y-0 start-0 w-1 bg-linear-to-b from-highlight to-highlight/30"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(70%_120%_at_100%_0%,color-mix(in_oklab,var(--highlight)_35%,transparent),transparent_70%)] rtl:bg-[radial-gradient(70%_120%_at_0%_0%,color-mix(in_oklab,var(--highlight)_35%,transparent),transparent_70%)]"
          />
          <dt className="text-sm font-medium text-white/80">
            {t('result.total_including_vat')}
          </dt>
          <dd className="mt-1 text-figure tabular-nums">
            <bdi dir="ltr">
              <AnimatedNumber
                value={totals.totalIncludingVat}
                format={money}
                countUp
              />
            </bdi>
          </dd>
        </div>
      </dl>
      <RevealGroup>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {cards.map(card => (
            <RevealItem
              key={card.label}
              className="rounded-xl border bg-card p-4 shadow-xs"
            >
              <dt className="text-xs text-muted-foreground">{card.label}</dt>
              <dd className="mt-1 text-lg font-semibold tracking-tight tabular-nums">
                <bdi dir="ltr">{card.value}</bdi>
              </dd>
            </RevealItem>
          ))}
        </dl>
      </RevealGroup>
    </section>
  );
}
