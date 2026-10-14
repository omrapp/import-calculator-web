import type { ExpenseUnit } from '../formValues';

const SYMBOLS: Record<ExpenseUnit, string> = {
  ILS: '₪',
  USD: '$',
  EUR: '€',
  percent: '%',
};

export const CURRENCIES = ['ILS', 'USD', 'EUR'] as const;
export const EXPENSE_UNITS = ['ILS', 'USD', 'EUR', 'percent'] as const;
export const unitSymbol = (unit: ExpenseUnit) => SYMBOLS[unit];
