import { Calculator, Plane, Ship, SquareSigma } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { PageHeader } from '@/components/page';
import { Button } from '@/components/ui/button';
import { calculate } from '@/features/calc-engine';
import { formatMoney, formatNumber, useLanguage } from '@/features/i18n';

import { EXAMPLE_RATES, EXAMPLES, localizeExample } from './data';
import { ExampleCard, Tags } from './ExampleCard';
import { FlowDiagram, SceneArt } from './illustrations';

/** Worked examples: every scenario run through the real engine, step by step. */
export function ExamplesView() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const worked = EXAMPLES.map((example, i) => {
    const input = localizeExample(example, t);
    return {
      example,
      number: i + 1,
      input,
      result: calculate(input),
      title: t(`examples.items.${example.id}.title`),
    };
  });
  const byId = new Map(worked.map(item => [item.example.id, item]));

  return (
    <section className="mx-auto flex max-w-form flex-col gap-8">
      <PageHeader
        icon={<SquareSigma />}
        title={t('examples.title')}
        description={t('examples.lead')}
        meta={
          <p data-testid="example-rates">
            {t('examples.rates_note')}{' '}
            <bdi dir="ltr">
              $1 = ₪{formatNumber(EXAMPLE_RATES.USD, language, 2)} · €1 = ₪
              {formatNumber(EXAMPLE_RATES.EUR, language, 2)}
            </bdi>
          </p>
        }
      />

      <section
        aria-labelledby="examples-flow"
        className="flex flex-col gap-3 rounded-2xl border bg-card px-5 py-5 shadow-xs sm:px-6"
      >
        <h2 id="examples-flow" className="text-lg font-semibold">
          {t('examples.flow.title')}
        </h2>
        <p className="max-w-prose text-sm text-muted-foreground">
          {t('examples.flow.lead')}
        </p>
        <FlowDiagram />
        <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <li className="flex gap-2">
            <Ship aria-hidden className="mt-0.5 size-4 shrink-0" />
            {t('examples.flow.sea_note')}
          </li>
          <li className="flex gap-2">
            <Plane aria-hidden className="mt-0.5 size-4 shrink-0" />
            {t('examples.flow.air_note')}
          </li>
        </ul>
      </section>

      <nav aria-labelledby="examples-index" className="flex flex-col gap-3">
        <h2 id="examples-index" className="text-lg font-semibold">
          {t('examples.index_title')}
        </h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {worked.map(({ example, number, input, result, title }) => (
            <li key={example.id} data-tone={example.tone}>
              <a
                href={`#example-${example.id}`}
                className="flex h-full flex-col gap-2 rounded-xl border border-tone/40 bg-card p-3.5 shadow-xs transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <span className="flex items-center gap-3">
                  <SceneArt scene={example.scene} className="w-14 shrink-0" />
                  <span className="flex min-w-0 flex-col">
                    <span className="text-xs font-semibold text-tone-ink">
                      {t('examples.number', { n: number })}
                    </span>
                    <span className="font-medium">{title}</span>
                  </span>
                </span>
                <Tags input={input} />
                <span className="mt-auto flex items-baseline justify-between gap-2 border-t pt-2 text-sm">
                  <span className="text-muted-foreground">
                    {t('result.total_including_vat')}
                  </span>
                  <bdi dir="ltr" className="font-semibold tabular-nums">
                    {formatMoney(
                      result.totals.totalIncludingVat,
                      'ILS',
                      language,
                    )}
                  </bdi>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {worked.map(({ example, number, input, result }) => {
        const base = example.base && byId.get(example.base);
        return (
          <ExampleCard
            key={example.id}
            example={example}
            number={number}
            input={input}
            result={result}
            base={
              base
                ? {
                    number: base.number,
                    title: base.title,
                    result: base.result,
                  }
                : undefined
            }
          />
        );
      })}

      <section className="flex flex-col items-start gap-3 rounded-2xl border bg-card px-5 py-5 shadow-xs sm:px-6">
        <h2 className="text-lg font-semibold">{t('examples.cta.title')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('examples.cta.body')}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild>
            <Link to="/calculator">
              <Calculator />
              {t('nav.standard')}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/air-shipment">
              <Plane />
              {t('nav.air_shipment')}
            </Link>
          </Button>
        </div>
      </section>
    </section>
  );
}
