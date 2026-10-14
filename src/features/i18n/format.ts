import type { Language } from './languages';

type Currency = 'ILS' | 'USD' | 'EUR';

// Latin digits in every language so figures match invoices and customs forms.
const locale = (language: Language) => `${language}-u-nu-latn`;

export function formatNumber(
  value: number,
  language: Language,
  fractionDigits = 2,
): string {
  return new Intl.NumberFormat(locale(language), {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatMoney(
  amount: number,
  currency: Currency,
  language: Language,
): string {
  return new Intl.NumberFormat(locale(language), {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
