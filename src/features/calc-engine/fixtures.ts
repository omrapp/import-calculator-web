import type { CalculationInput, Money } from './types';

export const ils = (amount: number): Money => ({ amount, currency: 'ILS' });
export const usd = (amount: number): Money => ({ amount, currency: 'USD' });
export const eur = (amount: number): Money => ({ amount, currency: 'EUR' });

/** Minimal valid Standard Calculation for tests. */
export function standardInput(
  patch: Partial<CalculationInput> = {},
): CalculationInput {
  return {
    mode: 'standard',
    rates: { USD: 3.5, EUR: 4 },
    cif: {
      cost: usd(1000),
      freight: usd(100),
      insurance: null,
      premiumPercent: 0,
    },
    duty: { kind: 'percent', percent: 10 },
    tamaPercent: 0,
    purchaseTaxPercent: 0,
    vatPercent: 18,
    expenses: {
      localTransport: ils(0),
      customsBroker: ils(0),
      bank: ils(0),
      other: ils(0),
      custom: [],
    },
    ...patch,
  };
}
