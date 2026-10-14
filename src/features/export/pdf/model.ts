import type {
  CalculationLink,
  CalculationResult,
} from '@/features/calc-engine';
import {
  directionOf,
  formatDate,
  formatMoney,
  formatNumber,
  type Language,
} from '@/features/i18n';
import {
  formatFormula,
  formatStepValue,
  toBreakdownSections,
  stepLabelText,
} from '@/features/result';

type T = (key: string, params?: Record<string, unknown>) => string;

/** Everything the PDF prints, already translated and formatted. */
export type PdfModel = {
  language: Language;
  dir: 'ltr' | 'rtl';
  /** Site name beside the logo in the header. */
  brand: string;
  title: string;
  subtitle: string;
  ratesNote: string;
  createdOn: string;
  summary: { label: string; value: string; primary?: boolean }[];
  sections: {
    title: string;
    rows: {
      label: string;
      value: string;
      formula?: string;
      emphasis?: 'subtotal' | 'total';
    }[];
  }[];
  footer: string;
};

export function buildPdfModel(
  link: CalculationLink,
  result: CalculationResult,
  language: Language,
  t: T,
  now = new Date(),
): PdfModel {
  const { totals } = result;
  const money = (amount: number) => formatMoney(amount, 'ILS', language);
  const { source, lastUpdate } = link.rates;
  const rateSource =
    source === 'manual' || !lastUpdate
      ? t('result.rates_manual')
      : t(`calculator.rates.status_${source}`, {
          date: formatDate(lastUpdate, language),
        });
  const ratesUsed = t('result.rates_used', {
    usd: formatNumber(link.input.rates.USD, language, 4, 0),
    eur: formatNumber(link.input.rates.EUR, language, 4, 0),
  });

  const summary: PdfModel['summary'] = [
    {
      label: t('result.total_including_vat'),
      value: money(totals.totalIncludingVat),
      primary: true,
    },
    { label: t('result.landed_cost'), value: money(totals.landedCost) },
  ];
  if (totals.importFactor !== null)
    summary.push({
      label: t('result.steps.import_factor'),
      value: formatNumber(totals.importFactor, language, 4),
    });
  if (totals.shekelPerUnitFactor !== null)
    summary.push({
      label: t('result.steps.shekel_per_unit_factor'),
      value: formatNumber(totals.shekelPerUnitFactor, language, 4),
    });
  if (totals.chargeableWeight !== undefined)
    summary.push({
      label: t('home.labels.chargeable_weight'),
      value: `${formatNumber(totals.chargeableWeight, language)} ${t('common.kg')}`,
    });
  if (totals.airFreightUsd !== undefined)
    summary.push({
      label: t('result.steps.total_air_freight'),
      value: formatMoney(totals.airFreightUsd, 'USD', language),
    });

  return {
    language,
    dir: directionOf(language),
    brand: t('home.title'),
    title: t('result.title'),
    subtitle: t(
      link.input.mode === 'standard' ? 'nav.standard' : 'nav.air_shipment',
    ),
    ratesNote: `${rateSource} · ${ratesUsed}`,
    createdOn: formatDate(now.toISOString(), language),
    summary,
    sections: toBreakdownSections(result.steps, t).map(section => ({
      title: section.title,
      rows: section.steps.map(step => ({
        label: stepLabelText(step.label, t),
        value: formatStepValue(step.value, language, t),
        formula: step.formula && formatFormula(step.formula, language, t),
        emphasis: step.kind === 'row' ? undefined : step.kind,
      })),
    })),
    footer: t('export.disclaimer'),
  };
}
