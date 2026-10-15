import { createContext, useContext } from 'react';
import { useSearchParams } from 'react-router';

import type {
  CalculationInput,
  Currency,
  StepValue,
} from '@/features/calc-engine';

/** Currencies the Result can be shown in; ₪ is what the engine computes. */
export const DISPLAY_CURRENCIES = ['ILS', 'USD', 'EUR'] as const;

export type Rates = CalculationInput['rates'];

/** `?cur=` on /result, so a shared link opens in the same currency. */
export const CURRENCY_PARAM = 'cur';

const STORAGE_KEY = 'result-currency';

export const isDisplayCurrency = (value: unknown): value is Currency =>
  DISPLAY_CURRENCIES.includes(value as Currency);

const shekelsPer = (currency: Currency, rates: Rates) =>
  currency === 'ILS' ? 1 : rates[currency];

/** Converts through ₪ with the Calculation's own rates. */
export function convertMoney(
  amount: number,
  from: Currency,
  to: Currency,
  rates: Rates,
): number {
  if (from === to) return amount;
  return (amount * shekelsPer(from, rates)) / shekelsPer(to, rates);
}

/** Money values switch to `to`; kg and factors stay as they are. */
export function convertStepValue(
  value: StepValue,
  to: Currency,
  rates: Rates,
): StepValue {
  if (value.unit === 'kg' || value.unit === 'factor') return value;
  return {
    amount: convertMoney(value.amount, value.unit, to, rates),
    unit: to,
  };
}

/**
 * A step value as the Result shows it: the ₪ view keeps the engine's own
 * units ($ inputs stay $), other views put every amount in that currency.
 */
export const displayStepValue = (
  value: StepValue,
  currency: Currency,
  rates: Rates,
): StepValue =>
  currency === 'ILS' ? value : convertStepValue(value, currency, rates);

export function readSavedCurrency(): Currency {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isDisplayCurrency(saved) ? saved : 'ILS';
  } catch {
    return 'ILS';
  }
}

function saveCurrency(currency: Currency): void {
  try {
    localStorage.setItem(STORAGE_KEY, currency);
  } catch {
    // Storage unavailable (private mode, blocked); the choice lasts this visit only.
  }
}

/** The Result's display currency: the link's `?cur=`, else the saved choice. */
export function useDisplayCurrencyParam() {
  const [params, setParams] = useSearchParams();
  const fromLink = params.get(CURRENCY_PARAM);
  const currency = isDisplayCurrency(fromLink) ? fromLink : readSavedCurrency();

  const setCurrency = (next: Currency) => {
    saveCurrency(next);
    setParams(
      prev => {
        const updated = new URLSearchParams(prev);
        updated.set(CURRENCY_PARAM, next);
        return updated;
      },
      { replace: true },
    );
  };

  return [currency, setCurrency] as const;
}

/** This page's URL with the shown currency, for Copy link and Share. */
export function urlWithCurrency(href: string, currency: Currency): string {
  const url = new URL(href);
  url.searchParams.set(CURRENCY_PARAM, currency);
  return url.toString();
}

export type DisplayCurrency = { currency: Currency; rates: Rates };

export const DisplayCurrencyContext = createContext<DisplayCurrency>({
  currency: 'ILS',
  rates: { USD: 1, EUR: 1 },
});

/** Converts an amount (₪ by default) into the Result's display currency. */
export function useDisplayMoney() {
  const { currency, rates } = useContext(DisplayCurrencyContext);
  return {
    currency,
    rates,
    convert: (amount: number, from: Currency = 'ILS') =>
      convertMoney(amount, from, currency, rates),
  };
}
