import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Reveal } from '@/components/motion';

import type { CalculationResult } from '@/features/calc-engine';
import { formatMoney, formatNumber, useLanguage } from '@/features/i18n';
import { cn } from '@/lib/utils';

import {
  type CostPart,
  type CostSegment,
  toCostSegments,
  toWeightComparison,
  type WeightComparison,
} from './chartData';

/** Fixed hue per part, so a part keeps its color when others are zero. */
const PART_COLOR: Record<CostPart, string> = {
  cif: 'bg-chart-1',
  customsDuty: 'bg-chart-2',
  purchaseTax: 'bg-chart-3',
  expenses: 'bg-chart-4',
  vat: 'bg-chart-5',
};

const percentOf = (value: number, total: number) =>
  total > 0 ? `${(value / total) * 100}%` : '0%';

function useFormatters() {
  const { language } = useLanguage();
  return {
    money: (amount: number) => formatMoney(amount, 'ILS', language),
    percent: (share: number) => `${formatNumber(share * 100, language, 1, 0)}%`,
    kg: (amount: number) => formatNumber(amount, language),
  };
}

function ChartCard({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <Reveal className="flex break-inside-avoid flex-col gap-4 rounded-xl border bg-card p-4 shadow-xs sm:p-5">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        {note && <p className="text-xs text-muted-foreground">{note}</p>}
      </div>
      {children}
    </Reveal>
  );
}

/** Share of the Total Including VAT per part: one 100% bar plus a legend. */
function CompositionChart({ segments }: { segments: CostSegment[] }) {
  const { t } = useTranslation();
  const { money, percent } = useFormatters();

  return (
    <ChartCard
      title={t('result.charts.composition')}
      note={t('result.charts.composition_note')}
    >
      <div
        aria-hidden
        className="flex h-4 gap-0.5 overflow-hidden rounded-full"
        data-testid="composition-bar"
      >
        {segments.map(segment => (
          <div
            key={segment.part}
            className={cn('min-w-0.5', PART_COLOR[segment.part])}
            style={{ flexBasis: `${segment.share * 100}%` }}
            title={`${t(`result.charts.parts.${segment.part}`)}: ${money(segment.amount)} (${percent(segment.share)})`}
          />
        ))}
      </div>
      <ul className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        {segments.map(segment => (
          <li
            key={segment.part}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                aria-hidden
                className={cn(
                  'size-2.5 shrink-0 rounded-sm',
                  PART_COLOR[segment.part],
                )}
              />
              <span className="truncate">
                {t(`result.charts.parts.${segment.part}`)}
              </span>
            </span>
            <span className="flex shrink-0 items-baseline gap-2 tabular-nums">
              <bdi dir="ltr" className="font-medium">
                {money(segment.amount)}
              </bdi>
              <bdi
                dir="ltr"
                className="w-12 text-end text-xs text-muted-foreground"
              >
                {percent(segment.share)}
              </bdi>
            </span>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}

type BuildUpRow = {
  key: string;
  label: string;
  amount: number;
  start: number;
  end: number;
  color: string;
  kind: 'part' | 'subtotal' | 'total';
};

/**
 * How the total builds up, step by step: each part starts where the running
 * total left off (a waterfall), with Landed Cost and the grand total as full bars.
 */
function BuildUpChart({
  segments,
  landedCost,
  total,
}: {
  segments: CostSegment[];
  landedCost: number;
  total: number;
}) {
  const { t } = useTranslation();
  const { money } = useFormatters();

  const rows: BuildUpRow[] = [];
  for (const segment of segments) {
    if (segment.part === 'vat')
      rows.push({
        key: 'landedCost',
        label: t('result.landed_cost'),
        amount: landedCost,
        start: 0,
        end: landedCost,
        color: 'bg-muted-foreground/40',
        kind: 'subtotal',
      });
    rows.push({
      key: segment.part,
      label: t(`result.charts.parts.${segment.part}`),
      amount: segment.amount,
      start: segment.start,
      end: segment.end,
      color: PART_COLOR[segment.part],
      kind: 'part',
    });
  }
  rows.push({
    key: 'total',
    label: t('result.total_including_vat'),
    amount: total,
    start: 0,
    end: total,
    color: 'bg-brand',
    kind: 'total',
  });

  return (
    <ChartCard
      title={t('result.charts.build_up')}
      note={t('result.charts.build_up_note')}
    >
      <ol className="flex flex-col gap-2.5 text-sm" data-testid="build-up">
        {rows.map(row => (
          <li
            key={row.key}
            className={cn(
              'grid grid-cols-[minmax(0,7rem)_1fr] items-center gap-x-3 gap-y-1 sm:grid-cols-[minmax(0,10rem)_1fr_auto]',
              row.kind !== 'part' && 'font-semibold',
              row.kind === 'total' && 'border-t pt-2.5',
            )}
            title={`${row.label}: ${money(row.amount)}`}
          >
            <span className="truncate">
              {row.kind === 'part' && row.start > 0 && (
                <span aria-hidden className="text-muted-foreground">
                  +{' '}
                </span>
              )}
              {row.label}
            </span>
            <div aria-hidden className="relative h-3 rounded-sm bg-muted/60">
              <div
                className={cn(
                  'absolute inset-y-0 min-w-0.5 rounded-sm',
                  row.color,
                )}
                style={{
                  insetInlineStart: percentOf(row.start, total),
                  width: percentOf(row.amount, total),
                }}
              />
            </div>
            <bdi
              dir="ltr"
              className="col-start-2 text-end text-xs tabular-nums sm:col-start-auto sm:text-sm"
            >
              {money(row.amount)}
            </bdi>
          </li>
        ))}
      </ol>
    </ChartCard>
  );
}

/** Air Shipment: Actual vs Volumetric Weight; the higher one is billed. */
function WeightChart({ weight }: { weight: WeightComparison }) {
  const { t } = useTranslation();
  const { kg } = useFormatters();
  const max = Math.max(weight.actual, weight.volumetric);
  const bars = [
    {
      key: 'actual' as const,
      label: t('result.steps.actual_weight'),
      amount: weight.actual,
    },
    {
      key: 'volumetric' as const,
      label: t('result.steps.volumetric_weight'),
      amount: weight.volumetric,
    },
  ];

  return (
    <ChartCard
      title={t('result.charts.weight')}
      note={t('result.charts.weight_note')}
    >
      <ul className="flex flex-col gap-3 text-sm" data-testid="weight-chart">
        {bars.map(bar => {
          const billed = bar.key === weight.basis;
          return (
            <li key={bar.key} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="flex items-center gap-2">
                  {bar.label}
                  {billed && (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                      {t('result.charts.billed')}
                    </span>
                  )}
                </span>
                <bdi dir="ltr" className="font-medium tabular-nums">
                  {kg(bar.amount)} {t('common.kg')}
                </bdi>
              </div>
              <div aria-hidden className="h-3 rounded-sm bg-muted/60">
                <div
                  className={cn(
                    'h-full min-w-0.5 rounded-sm',
                    billed ? 'bg-primary' : 'bg-muted-foreground/40',
                  )}
                  style={{ width: percentOf(bar.amount, max) }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </ChartCard>
  );
}

/** Charts of the Result; every value comes from the engine's output as-is. */
export function CostCharts({ result }: { result: CalculationResult }) {
  const { t } = useTranslation();
  const segments = toCostSegments(result.totals);
  const weight = toWeightComparison(result);
  if (segments.length === 0 && !weight) return null;

  return (
    <section
      aria-label={t('result.charts.title')}
      className="flex flex-col gap-4"
    >
      <h2 className="mt-2 text-xl font-semibold">{t('result.charts.title')}</h2>
      {segments.length > 0 && (
        <>
          <CompositionChart segments={segments} />
          <BuildUpChart
            segments={segments}
            landedCost={result.totals.landedCost}
            total={result.totals.totalIncludingVat}
          />
        </>
      )}
      {weight && <WeightChart weight={weight} />}
    </section>
  );
}
