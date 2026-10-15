import {
  ChartBarStacked,
  ChartColumn,
  ChartLine,
  ChartNoAxesGantt,
  ChartPie,
} from 'lucide-react';
import { type ReactNode, useId } from 'react';
import { useTranslation } from 'react-i18next';

import { Reveal } from '@/components/motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import type { CalculationResult } from '@/features/calc-engine';
import {
  formatCompactMoney,
  formatMoney,
  formatNumber,
  useLanguage,
} from '@/features/i18n';
import type { Tone } from '@/lib/tone';
import { cn } from '@/lib/utils';

import {
  type CostSegment,
  toCostSegments,
  toWeightComparison,
  type WeightComparison,
} from './chartData';
import { PART_TONE } from './tones';

const percentOf = (value: number, total: number) =>
  total > 0 ? `${(value / total) * 100}%` : '0%';

function useFormatters() {
  const { language } = useLanguage();
  return {
    money: (amount: number) => formatMoney(amount, 'ILS', language),
    compact: (amount: number) => formatCompactMoney(amount, 'ILS', language),
    percent: (share: number) => `${formatNumber(share * 100, language, 1, 0)}%`,
    kg: (amount: number) => formatNumber(amount, language),
  };
}

function ChartCard({
  title,
  note,
  tone,
  children,
}: {
  title: string;
  note?: string;
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <Reveal
      data-tone={tone}
      className="relative flex break-inside-avoid flex-col gap-4 overflow-hidden rounded-2xl border bg-card p-4 shadow-sm sm:p-5"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[oklch(0.74_0.13_232)] via-[oklch(0.74_0.15_295)] to-[oklch(0.74_0.16_350)]"
      />
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold">{title}</h3>
        {note && <p className="text-xs text-muted-foreground">{note}</p>}
      </div>
      {children}
    </Reveal>
  );
}

/** Every part with its amount and share; the text equivalent of all views. */
function PartsLegend({ segments }: { segments: CostSegment[] }) {
  const { t } = useTranslation();
  const { money, percent } = useFormatters();

  return (
    <ul
      className="grid gap-2 text-sm sm:grid-cols-2"
      aria-label={t('result.charts.legend')}
    >
      {segments.map(segment => (
        <li
          key={segment.part}
          data-tone={PART_TONE[segment.part]}
          className="flex items-center justify-between gap-3 rounded-lg border border-tone/30 bg-tone-soft px-3 py-2"
        >
          <span className="flex min-w-0 items-center gap-2">
            <span
              aria-hidden
              className="size-3 shrink-0 rounded-full bg-tone-gloss ring-1 ring-white/60"
            />
            <span className="truncate font-medium text-tone-ink">
              {t(`result.charts.parts.${segment.part}`)}
            </span>
          </span>
          <span className="flex shrink-0 items-baseline gap-2 tabular-nums">
            <bdi dir="ltr" className="font-semibold">
              {money(segment.amount)}
            </bdi>
            <bdi
              dir="ltr"
              className="w-12 text-end text-xs font-medium text-tone-ink"
            >
              {percent(segment.share)}
            </bdi>
          </span>
        </li>
      ))}
    </ul>
  );
}

const DONUT_R = 80;
const DONUT_C = 2 * Math.PI * DONUT_R;

/** Pie (donut) of each part's share, the total in the middle. */
function DonutChart({
  segments,
  total,
}: {
  segments: CostSegment[];
  total: number;
}) {
  const { t } = useTranslation();
  const { money, percent } = useFormatters();
  const gap = segments.length > 1 ? 2 : 0;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-60">
      <svg
        viewBox="0 0 200 200"
        aria-hidden
        className="size-full drop-shadow-sm"
        data-testid="donut"
      >
        <circle
          cx="100"
          cy="100"
          r={DONUT_R}
          fill="none"
          strokeWidth="28"
          className="stroke-muted"
        />
        {segments.map(segment => {
          const length = segment.share * DONUT_C;
          const offset = (segment.start / total) * DONUT_C;
          return (
            <circle
              key={segment.part}
              data-tone={PART_TONE[segment.part]}
              cx="100"
              cy="100"
              r={DONUT_R}
              fill="none"
              strokeWidth="28"
              strokeDasharray={`${Math.max(length - gap, 0.5)} ${DONUT_C}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 100 100)"
              className="stroke-tone transition-opacity hover:opacity-80"
            >
              <title>
                {`${t(`result.charts.parts.${segment.part}`)}: ${money(segment.amount)} (${percent(segment.share)})`}
              </title>
            </circle>
          );
        })}
        <circle
          cx="100"
          cy="100"
          r={DONUT_R - 13}
          fill="none"
          strokeWidth="1"
          className="stroke-white/50"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="max-w-28 text-xs leading-tight text-muted-foreground">
          {t('result.total_including_vat')}
        </span>
        <bdi dir="ltr" className="text-base font-bold tabular-nums">
          {money(total)}
        </bdi>
      </div>
    </div>
  );
}

/** One column per part, side by side; taller column, bigger cost. */
function ColumnsChart({ segments }: { segments: CostSegment[] }) {
  const { t } = useTranslation();
  const { compact, money } = useFormatters();
  const max = Math.max(...segments.map(s => s.amount));
  const columns = {
    gridTemplateColumns: `repeat(${segments.length}, minmax(0, 1fr))`,
  };

  return (
    <div className="flex flex-col gap-2" data-testid="columns">
      <div
        aria-hidden
        className="grid h-52 items-end gap-2 border-b sm:gap-4"
        style={columns}
      >
        {segments.map(segment => (
          <div
            key={segment.part}
            data-tone={PART_TONE[segment.part]}
            className="flex h-full flex-col items-center justify-end gap-1"
            title={`${t(`result.charts.parts.${segment.part}`)}: ${money(segment.amount)}`}
          >
            <bdi
              dir="ltr"
              className="text-[11px] font-semibold text-tone-ink tabular-nums sm:text-xs"
            >
              {compact(segment.amount)}
            </bdi>
            <div
              className="w-full max-w-14 min-h-1 rounded-t-lg bg-tone-gloss shadow-xs ring-1 ring-white/40 ring-inset"
              style={{ height: percentOf(segment.amount, max) }}
            />
          </div>
        ))}
      </div>
      <div aria-hidden className="grid gap-2 sm:gap-4" style={columns}>
        {segments.map(segment => (
          <span
            key={segment.part}
            className="text-center text-[11px] leading-tight text-muted-foreground sm:text-xs"
          >
            {t(`result.charts.parts.${segment.part}`)}
          </span>
        ))}
      </div>
    </div>
  );
}

const LINE_H = 100;

/** The running total climbing as each part is added, from zero to the total. */
function LineChart({
  segments,
  total,
}: {
  segments: CostSegment[];
  total: number;
}) {
  const { t } = useTranslation();
  const { compact } = useFormatters();
  const gradient = useId();

  const points: { key: string; label: string; value: number; tone: Tone }[] = [
    {
      key: 'start',
      label: t('result.charts.start'),
      value: 0,
      tone: 'factors',
    },
    ...segments.map(segment => ({
      key: segment.part,
      label: `+ ${t(`result.charts.parts.${segment.part}`)}`,
      value: segment.end,
      tone: PART_TONE[segment.part],
    })),
  ];
  const x = (i: number) => ((i + 0.5) / points.length) * 100;
  const y = (value: number) => 92 - (value / total) * 80;
  const line = points.map((p, i) => `${x(i)},${y(p.value)}`).join(' ');
  const area = `${x(0)},${LINE_H} ${line} ${x(points.length - 1)},${LINE_H}`;
  const columns = {
    gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))`,
  };

  return (
    <div className="flex flex-col gap-2" data-testid="line">
      <div aria-hidden className="relative h-48" data-tone="factors">
        <svg
          viewBox={`0 0 100 ${LINE_H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 size-full rtl:-scale-x-100"
        >
          <defs>
            <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--tone)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="var(--tone)" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[12, 52, 92].map(level => (
            <line
              key={level}
              x1="0"
              x2="100"
              y1={level}
              y2={level}
              strokeDasharray="2 2"
              vectorEffect="non-scaling-stroke"
              className="stroke-border"
            />
          ))}
          <polygon points={area} fill={`url(#${gradient})`} />
          <polyline
            points={line}
            fill="none"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="stroke-tone"
          />
        </svg>
        {points.map((point, i) => (
          <span
            key={point.key}
            data-tone={point.tone}
            className="absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-tone-gloss shadow-sm ring-2 ring-card rtl:translate-x-1/2"
            style={{
              insetInlineStart: `${x(i)}%`,
              top: `${y(point.value)}%`,
            }}
          />
        ))}
      </div>
      <div aria-hidden className="grid gap-1" style={columns}>
        {points.map(point => (
          <span
            key={point.key}
            data-tone={point.tone}
            className="flex flex-col items-center gap-0.5 text-center text-[11px] leading-tight sm:text-xs"
          >
            <bdi dir="ltr" className="font-semibold text-tone-ink tabular-nums">
              {compact(point.value)}
            </bdi>
            <span className="text-muted-foreground">{point.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

type BuildUpRow = {
  key: string;
  label: string;
  amount: number;
  start: number;
  tone: Tone;
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
        tone: 'factors',
        kind: 'subtotal',
      });
    rows.push({
      key: segment.part,
      label: t(`result.charts.parts.${segment.part}`),
      amount: segment.amount,
      start: segment.start,
      tone: PART_TONE[segment.part],
      kind: 'part',
    });
  }
  rows.push({
    key: 'total',
    label: t('result.total_including_vat'),
    amount: total,
    start: 0,
    tone: 'factors',
    kind: 'total',
  });

  return (
    <ol className="flex flex-col gap-2.5 text-sm" data-testid="build-up">
      {rows.map(row => (
        <li
          key={row.key}
          data-tone={row.tone}
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
          <div aria-hidden className="relative h-3.5 rounded-full bg-muted/70">
            <div
              className={cn(
                'absolute inset-y-0 min-w-1 rounded-full ring-1 ring-white/40 ring-inset',
                row.kind === 'subtotal' ? 'bg-tone/50' : 'bg-tone-gloss',
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
  );
}

/** Every part as a slice of one 100% bar. */
function ShareBar({ segments }: { segments: CostSegment[] }) {
  const { t } = useTranslation();
  const { money, percent } = useFormatters();

  return (
    <div
      aria-hidden
      className="flex h-10 gap-0.5 overflow-hidden rounded-full shadow-inner"
      data-testid="share-bar"
    >
      {segments.map(segment => (
        <div
          key={segment.part}
          data-tone={PART_TONE[segment.part]}
          className="flex min-w-1 items-center justify-center overflow-hidden bg-tone-gloss text-xs font-semibold text-black/75 tabular-nums"
          style={{ flexBasis: `${segment.share * 100}%` }}
          title={`${t(`result.charts.parts.${segment.part}`)}: ${money(segment.amount)} (${percent(segment.share)})`}
        >
          {segment.share >= 0.1 && (
            <bdi dir="ltr">{percent(segment.share)}</bdi>
          )}
        </div>
      ))}
    </div>
  );
}

const VIEWS = [
  { value: 'donut', icon: ChartPie, note: 'composition_note' },
  { value: 'bars', icon: ChartColumn, note: 'bars_note' },
  { value: 'line', icon: ChartLine, note: 'line_note' },
  { value: 'build_up', icon: ChartNoAxesGantt, note: 'build_up_note' },
  { value: 'share', icon: ChartBarStacked, note: 'composition_note' },
] as const;

/** One card, five views of the same parts; the legend stays under every view. */
function CostViews({
  segments,
  landedCost,
  total,
}: {
  segments: CostSegment[];
  landedCost: number;
  total: number;
}) {
  const { t } = useTranslation();
  const panels: Record<(typeof VIEWS)[number]['value'], ReactNode> = {
    donut: <DonutChart segments={segments} total={total} />,
    bars: <ColumnsChart segments={segments} />,
    line: <LineChart segments={segments} total={total} />,
    build_up: (
      <BuildUpChart segments={segments} landedCost={landedCost} total={total} />
    ),
    share: <ShareBar segments={segments} />,
  };

  return (
    <ChartCard title={t('result.charts.composition')}>
      <Tabs defaultValue="donut" className="gap-4">
        <TabsList
          aria-label={t('result.charts.chart_views')}
          className="w-full print:hidden"
          data-export-ignore
        >
          {VIEWS.map(({ value, icon: Icon }) => (
            <TabsTrigger key={value} value={value}>
              <Icon aria-hidden />
              <span className="sr-only sm:not-sr-only">
                {t(`result.charts.tabs.${value}`)}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {VIEWS.map(({ value, note }) => (
          <TabsContent
            key={value}
            value={value}
            className="flex flex-col gap-4"
          >
            <p className="text-xs text-muted-foreground">
              {t(`result.charts.${note}`)}
            </p>
            {panels[value]}
          </TabsContent>
        ))}
      </Tabs>
      <PartsLegend segments={segments} />
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
      tone="air"
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
                    <span className="rounded-full bg-tone-soft px-2 py-0.5 text-xs font-semibold text-tone-ink ring-1 ring-tone/40">
                      {t('result.charts.billed')}
                    </span>
                  )}
                </span>
                <bdi dir="ltr" className="font-medium tabular-nums">
                  {kg(bar.amount)} {t('common.kg')}
                </bdi>
              </div>
              <div aria-hidden className="h-3.5 rounded-full bg-muted/70">
                <div
                  className={cn(
                    'h-full min-w-1 rounded-full',
                    billed
                      ? 'bg-tone-gloss ring-1 ring-white/40 ring-inset'
                      : 'bg-tone/35',
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
        <CostViews
          segments={segments}
          landedCost={result.totals.landedCost}
          total={result.totals.totalIncludingVat}
        />
      )}
      {weight && <WeightChart weight={weight} />}
    </section>
  );
}
