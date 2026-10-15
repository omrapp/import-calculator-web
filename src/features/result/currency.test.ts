import { afterEach, describe, expect, it } from 'vitest';

import {
  convertMoney,
  convertStepValue,
  readSavedCurrency,
  urlWithCurrency,
} from './currency';

const rates = { USD: 3.5, EUR: 4 };

afterEach(() => localStorage.clear());

describe('convertMoney', () => {
  it('keeps the amount in the same currency', () => {
    expect(convertMoney(123.45, 'USD', 'USD', rates)).toBe(123.45);
  });

  it('converts ₪ with the Calculation rates', () => {
    expect(convertMoney(350, 'ILS', 'USD', rates)).toBe(100);
    expect(convertMoney(400, 'ILS', 'EUR', rates)).toBe(100);
  });

  it('converts to ₪ and across foreign currencies', () => {
    expect(convertMoney(100, 'USD', 'ILS', rates)).toBe(350);
    expect(convertMoney(100, 'EUR', 'USD', rates)).toBeCloseTo(114.2857, 4);
  });
});

describe('convertStepValue', () => {
  it('converts money and leaves kg and factors alone', () => {
    expect(
      convertStepValue({ amount: 350, unit: 'ILS' }, 'USD', rates),
    ).toEqual({ amount: 100, unit: 'USD' });
    expect(convertStepValue({ amount: 12, unit: 'kg' }, 'EUR', rates)).toEqual({
      amount: 12,
      unit: 'kg',
    });
    expect(
      convertStepValue({ amount: 3.5, unit: 'factor' }, 'EUR', rates),
    ).toEqual({ amount: 3.5, unit: 'factor' });
  });
});

describe('readSavedCurrency', () => {
  it('defaults to ₪ and ignores unknown values', () => {
    expect(readSavedCurrency()).toBe('ILS');
    localStorage.setItem('result-currency', 'GBP');
    expect(readSavedCurrency()).toBe('ILS');
    localStorage.setItem('result-currency', 'EUR');
    expect(readSavedCurrency()).toBe('EUR');
  });
});

describe('urlWithCurrency', () => {
  it('sets cur and keeps the other params', () => {
    expect(urlWithCurrency('https://x.test/result?c=abc&cur=USD', 'EUR')).toBe(
      'https://x.test/result?c=abc&cur=EUR',
    );
  });
});
