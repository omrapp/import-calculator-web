import { useTranslation } from 'react-i18next';

import { calculate, type CalculationInput } from '@/features/calc-engine';
import { formatMoney, useLanguage } from '@/features/i18n';

import { Figure } from './diagrams';

/** The worked example, run through the real engine so the numbers never drift. */
const SAMPLE: CalculationInput = {
  mode: 'standard',
  rates: { USD: 3.7, EUR: 4 },
  cif: {
    cost: { amount: 10000, currency: 'USD' },
    freight: { amount: 1200, currency: 'USD' },
    insurance: null,
    premiumPercent: 0.35,
  },
  duty: { kind: 'percent', percent: 12 },
  tamaPercent: 0,
  purchaseTaxPercent: 15,
  vatPercent: null,
  expenses: {
    localTransport: { amount: 800, currency: 'ILS' },
    customsBroker: { amount: 1500, currency: 'ILS' },
    bank: { amount: 0, currency: 'ILS' },
    other: { amount: 0, currency: 'ILS' },
    custom: [],
  },
};

const PARTS = ['cif', 'customsDuty', 'purchaseTax', 'expenses', 'vat'] as const;

/**
 * Where an import's money goes: one bar per cost part (single series, one hue,
 * direct value labels), with the same figures in a table for screen readers.
 */
export function SampleCostChart() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { totals } = calculate(SAMPLE);
  const money = (amount: number) => formatMoney(amount, 'ILS', language);
  const max = Math.max(...PARTS.map(part => totals[part]));

  return (
    <Figure caption={t('guides.docs.chart.caption')}>
      <p className="font-semibold">{t('guides.docs.chart.title')}</p>
      <ul aria-hidden className="flex flex-col gap-2.5">
        {PARTS.map(part => {
          const share = totals[part] / totals.totalIncludingVat;
          return (
            <li
              key={part}
              className="group grid grid-cols-[7rem_1fr] items-center gap-3 sm:grid-cols-[9rem_1fr]"
              title={`${t(`guides.docs.chart.${part}`)}: ${money(totals[part])} (${Math.round(share * 100)}%)`}
            >
              <span className="truncate text-sm text-muted-foreground">
                {t(`guides.docs.chart.${part}`)}
              </span>
              <div className="flex items-center gap-2">
                <div
                  className="h-3 min-w-1 rounded-e bg-primary transition-opacity group-hover:opacity-80"
                  style={{ width: `${(totals[part] / max) * 75}%` }}
                />
                <bdi
                  dir="ltr"
                  className="text-xs font-medium whitespace-nowrap tabular-nums"
                >
                  {money(totals[part])}
                </bdi>
              </div>
            </li>
          );
        })}
      </ul>
      <table className="sr-only">
        <caption>{t('guides.docs.chart.title')}</caption>
        <tbody>
          {PARTS.map(part => (
            <tr key={part}>
              <th scope="row">{t(`guides.docs.chart.${part}`)}</th>
              <td>{money(totals[part])}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="flex flex-wrap justify-between gap-2 border-t pt-3 text-sm">
        <span className="font-semibold">{t('guides.docs.chart.total')}</span>
        <bdi dir="ltr" className="font-bold tabular-nums">
          {money(totals.totalIncludingVat)}
        </bdi>
      </p>
    </Figure>
  );
}
