import {
  ArrowLeftRight,
  ChartPie,
  ExternalLink,
  Lightbulb,
  ListOrdered,
  Pencil,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  type CalculationInput,
  type CalculationResult,
  type ExpenseAmount,
  type Money,
  DEFAULT_VAT_PERCENT,
  encodeCalculation,
} from '@/features/calc-engine';
import { useOpenInCalculator } from '@/features/calculator-ui';
import {
  galleryItems,
  Lightbox,
  Picture,
  presentationSlides,
} from '@/features/guides';
import { formatMoney, formatNumber, useLanguage } from '@/features/i18n';
import { Breakdown, CostCharts, SummaryCards } from '@/features/result';
import { cn } from '@/lib/utils';

import {
  type Example,
  type ExampleTag,
  exampleLink,
  exampleTags,
} from './data';
import { CartonFigure, SceneArt } from './illustrations';

type T = (key: string, params?: Record<string, unknown>) => string;

function tagText(tag: ExampleTag, t: T): string {
  switch (tag.kind) {
    case 'shipping':
      return t(`examples.tags.${tag.value}`);
    case 'duty':
      return t(`examples.tags.duty_${tag.value}`, { percent: tag.percent });
    case 'purchase_tax':
      return t(`examples.tags.purchase_tax_${tag.value}`);
    case 'vat':
      return tag.percent > 0
        ? t('examples.tags.vat', { percent: tag.percent })
        : t('examples.tags.vat_none');
    case 'currency':
      return t(`examples.tags.currency_${tag.value}`);
    case 'expenses':
      return t(`examples.tags.expenses_${tag.value}`);
  }
}

export function Tags({ input }: { input: CalculationInput }) {
  const { t } = useTranslation();
  return (
    <ul className="flex flex-wrap gap-1.5">
      {exampleTags(input).map(tag => (
        <li
          key={tag.kind}
          className="rounded-full border border-tone/40 bg-card/70 px-2.5 py-0.5 text-xs font-medium text-tone-ink"
        >
          {tagText(tag, t)}
        </li>
      ))}
    </ul>
  );
}

function useInputRows(input: CalculationInput) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const money = ({ amount, currency }: Money) =>
    formatMoney(amount, currency, language);
  const pct = (value: number) => `${formatNumber(value, language, 2, 0)}%`;
  const expense = (amount: ExpenseAmount) =>
    'percent' in amount
      ? t('examples.inputs.percent_of_total', { percent: pct(amount.percent) })
      : money(amount);
  const isZero = (amount: ExpenseAmount) =>
    'percent' in amount ? amount.percent === 0 : amount.amount === 0;

  const { cif, duty, expenses, airShipment } = input;
  const rows: { label: string; value: string }[] = [
    { label: t('home.labels.cost'), value: money(cif.cost) },
    {
      label: t('home.labels.freight'),
      value: airShipment
        ? t('examples.inputs.from_cartons')
        : money(cif.freight),
    },
    {
      label: t('home.labels.insurance'),
      value: cif.insurance
        ? money(cif.insurance)
        : t('examples.inputs.premium', { percent: pct(cif.premiumPercent) }),
    },
  ];
  if (airShipment) {
    const usd = (amount: number) => money({ amount, currency: 'USD' });
    rows.push(
      {
        label: t('home.labels.volumetric_divisor'),
        value: formatNumber(airShipment.divisor, language, 0),
      },
      {
        label: t('home.labels.rate_per_kg'),
        value: usd(airShipment.ratePerKg),
      },
      {
        label: t('home.labels.fuel_surcharge'),
        value: usd(airShipment.fuelSurchargePerKg),
      },
      {
        label: t('home.labels.handling_fee'),
        value: usd(airShipment.handlingFee),
      },
    );
  }
  if (duty.kind === 'percent') {
    rows.push({
      label: t('home.labels.customs_duty_rate'),
      value: pct(duty.percent),
    });
  } else {
    rows.push(
      {
        label: t('home.labels.duty_option_i'),
        value: formatMoney(duty.optionI, 'ILS', language),
      },
      {
        label: t('home.labels.duty_option_ii'),
        value: formatMoney(duty.optionII, 'ILS', language),
      },
      {
        label: t('home.labels.compound_rule'),
        value: t(`home.compound_rule.${duty.rule}`),
      },
    );
  }
  if (input.tamaPercent > 0) {
    rows.push({ label: t('home.labels.tama'), value: pct(input.tamaPercent) });
  }
  rows.push(
    {
      label: t('home.labels.purchase_tax'),
      value: pct(input.purchaseTaxPercent),
    },
    {
      label: t('home.labels.vat'),
      value: pct(input.vatPercent ?? DEFAULT_VAT_PERCENT),
    },
  );
  const named: [string, ExpenseAmount][] = [
    [t('home.labels.local_transport'), expenses.localTransport],
    [t('home.labels.customs_broker'), expenses.customsBroker],
    [t('home.labels.bank'), expenses.bank],
    [t('home.labels.other'), expenses.other],
    ...expenses.custom.map(
      item => [item.name, item.amount] as [string, ExpenseAmount],
    ),
  ];
  for (const [label, amount] of named) {
    if (!isZero(amount)) rows.push({ label, value: expense(amount) });
  }
  return rows;
}

function InputsList({ input }: { input: CalculationInput }) {
  const { t } = useTranslation();
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold">{t('examples.inputs.title')}</h3>
      <dl className="divide-y rounded-xl border bg-card text-sm">
        {useInputRows(input).map(({ label, value }) => (
          <div
            key={label}
            className="flex items-baseline justify-between gap-4 px-3.5 py-2"
          >
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-end font-medium tabular-nums">
              <bdi>{value}</bdi>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const slideTitle = (image: string) =>
  presentationSlides.find(slide => slide.image === image)?.title ??
  galleryItems.find(item => item.image === image)?.title;

function GuideFigure({ image }: { image: string }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [open, setOpen] = useState<number | null>(null);
  const title = slideTitle(image)?.[language] ?? '';

  return (
    <figure className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen(0)}
        aria-label={t('examples.open_picture', { title })}
        className="overflow-hidden rounded-xl border bg-card shadow-xs transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Picture
          image={image}
          alt={title}
          sizes="(min-width: 768px) 320px, 100vw"
        />
      </button>
      <figcaption className="text-xs text-muted-foreground">
        {t('examples.from_guides', { title })}
      </figcaption>
      <Lightbox
        items={[{ id: image, image, title }]}
        index={open}
        onIndexChange={setOpen}
        onClose={() => setOpen(null)}
      />
    </figure>
  );
}

function CompareNote({
  example,
  result,
  base,
}: {
  example: Example;
  result: CalculationResult;
  base: { number: number; title: string; result: CalculationResult };
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const from = base.result.totals.totalIncludingVat;
  const to = result.totals.totalIncludingVat;
  const delta = to - from;
  const ils = (amount: number) => formatMoney(amount, 'ILS', language);

  return (
    <aside
      data-testid="compare-note"
      className="flex gap-3 rounded-xl border border-tone/40 bg-tone-soft/60 p-4 text-sm"
    >
      <ArrowLeftRight
        aria-hidden
        className="mt-0.5 size-4 shrink-0 text-tone-ink"
      />
      <div className="flex flex-col gap-1.5">
        <p className="font-semibold text-tone-ink">
          {t('examples.compare.title', {
            n: base.number,
            title: base.title,
          })}
        </p>
        <p>{t(`examples.items.${example.id}.change`)}</p>
        <p className="text-muted-foreground">
          {t('examples.compare.total')}{' '}
          <bdi dir="ltr" className="font-medium text-foreground tabular-nums">
            {ils(from)} → {ils(to)}
          </bdi>{' '}
          <bdi
            dir="ltr"
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums',
              delta > 0
                ? 'bg-destructive/10 text-destructive'
                : 'bg-success/15 text-success',
            )}
          >
            {delta > 0 ? '+' : '−'}
            {ils(Math.abs(delta))}
          </bdi>
        </p>
      </div>
    </aside>
  );
}

export function ExampleCard({
  example,
  number,
  input,
  result,
  base,
}: {
  example: Example;
  number: number;
  /** The example's inputs in the reader's language. */
  input: CalculationInput;
  result: CalculationResult;
  base?: { number: number; title: string; result: CalculationResult };
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const openInCalculator = useOpenInCalculator();
  const title = t(`examples.items.${example.id}.title`);
  const link = exampleLink(input, title);

  const params = Object.fromEntries(
    Object.entries(example.params ?? {}).map(([key, { amount, unit }]) => [
      key,
      unit === 'count'
        ? formatNumber(amount, language, 0)
        : formatMoney(amount, unit, language),
    ]),
  );

  return (
    <article
      id={`example-${example.id}`}
      aria-labelledby={`example-${example.id}-title`}
      data-tone={example.tone}
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-tone/40 bg-card shadow-xs"
    >
      <header className="flex items-start justify-between gap-4 border-b border-tone/30 bg-tone-soft px-5 py-4 sm:px-6">
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-xs font-semibold tracking-wide text-tone-ink uppercase">
            {t('examples.number', { n: number })}
          </p>
          <h2
            id={`example-${example.id}-title`}
            className="text-xl font-semibold"
          >
            {title}
          </h2>
          <Tags input={input} />
        </div>
        <SceneArt
          scene={example.scene}
          className="hidden w-32 shrink-0 sm:block"
        />
      </header>

      <div className="flex flex-col gap-5 px-5 py-5 sm:px-6">
        <p className="max-w-prose">
          {t(`examples.items.${example.id}.story`, params)}
        </p>

        {base && <CompareNote example={example} result={result} base={base} />}

        <div
          className={cn(
            'grid gap-5',
            example.image && 'md:grid-cols-[minmax(0,1fr)_18rem]',
          )}
        >
          <InputsList input={input} />
          {example.image && <GuideFigure image={example.image} />}
        </div>

        {input.airShipment && (
          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">
              {t('examples.carton.title')}
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {input.airShipment.cartons.map((carton, i) => (
                <CartonFigure
                  key={i}
                  carton={carton}
                  divisor={input.airShipment!.divisor}
                  label={t('result.steps.carton', { number: i + 1 })}
                />
              ))}
            </div>
          </section>
        )}

        <Tabs defaultValue="steps" className="gap-4">
          <TabsList className="w-full sm:w-fit">
            <TabsTrigger value="steps">
              <ListOrdered aria-hidden />
              {t('examples.tabs.steps')}
            </TabsTrigger>
            <TabsTrigger value="charts">
              <ChartPie aria-hidden />
              {t('examples.tabs.charts')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="steps">
            <Breakdown steps={result.steps} title={null} />
          </TabsContent>
          <TabsContent value="charts" className="flex flex-col gap-4">
            <SummaryCards totals={result.totals} />
            <CostCharts result={result} />
          </TabsContent>
        </Tabs>

        <aside className="flex gap-3 rounded-xl border bg-muted/40 p-4 text-sm">
          <Lightbulb
            aria-hidden
            className="mt-0.5 size-4 shrink-0 text-tone-ink"
          />
          <p>
            <span className="font-semibold">{t('examples.lesson')} </span>
            {t(`examples.items.${example.id}.lesson`, params)}
          </p>
        </aside>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild>
            <Link to={`/result?c=${encodeCalculation(link)}`}>
              <ExternalLink />
              {t('examples.actions.open_result')}
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => openInCalculator(link)}
          >
            <Pencil />
            {t('examples.actions.try_calculator')}
          </Button>
        </div>
      </div>
    </article>
  );
}
