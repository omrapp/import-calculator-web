import type { Language } from './languages';

type Currency = 'ILS' | 'USD' | 'EUR';

// Latin digits in every language so figures match invoices and customs forms.
const locale = (language: Language) => `${language}-u-nu-latn`;

export function formatNumber(
  value: number,
  language: Language,
  fractionDigits = 2,
  minFractionDigits = fractionDigits,
): string {
  return new Intl.NumberFormat(locale(language), {
    minimumFractionDigits: minFractionDigits,
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

export function formatDate(iso: string, language: Language): string {
  return new Intl.DateTimeFormat(locale(language), {
    dateStyle: 'medium',
  }).format(new Date(iso));
}
