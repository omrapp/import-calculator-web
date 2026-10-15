import { useTranslation } from 'react-i18next';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { Currency } from '@/features/calc-engine';
import type { Tone } from '@/lib/tone';

import { DISPLAY_CURRENCIES, isDisplayCurrency } from './currency';

const SYMBOL: Record<Currency, string> = { ILS: '₪', USD: '$', EUR: '€' };

const TONE: Record<Currency, Tone> = { ILS: 'rates', USD: 'cif', EUR: 'duty' };

/** ₪ / $ / € switch for every amount on the Result. */
export function CurrencySwitch({
  value,
  onChange,
}: {
  value: Currency;
  onChange: (currency: Currency) => void;
}) {
  const { t } = useTranslation();
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-2xl border bg-card px-4 py-3 shadow-xs print:hidden sm:px-5"
      data-export-ignore
    >
      <span id="currency-switch-label" className="text-sm font-medium">
        {t('result.currency.label')}
      </span>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={next => {
          // Radix sends '' when the pressed item is clicked again; keep it on.
          if (isDisplayCurrency(next)) onChange(next);
        }}
        aria-labelledby="currency-switch-label"
        spacing={1}
        className="flex-wrap"
      >
        {DISPLAY_CURRENCIES.map(currency => (
          <ToggleGroupItem
            key={currency}
            value={currency}
            data-tone={TONE[currency]}
            className="rounded-full border border-tone/40 bg-tone-soft px-3.5 text-tone-ink hover:bg-tone-soft hover:text-tone-ink data-[state=on]:bg-tone-gloss data-[state=on]:text-black/85 data-[state=on]:shadow-sm"
          >
            <span aria-hidden className="font-bold">
              {SYMBOL[currency]}
            </span>
            {t(`result.currency.${currency}`)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
