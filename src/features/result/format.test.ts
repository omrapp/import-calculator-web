import { describe, expect, it } from 'vitest';

import type { FormulaToken } from '@/features/calc-engine';
import { SUPPORTED_LANGUAGES } from '@/features/i18n';

import { formatFormula, formatStepValue } from './format';

const t = (key: string) => (key === 'common.kg' ? 'kg' : key);

describe('formatFormula', () => {
  it('renders money, rates, operators and groups', () => {
    const tokens: FormulaToken[] = [
      {
        group: [
          { amount: 3074, unit: 'ILS' },
          { op: '+' },
          { amount: 368.88, unit: 'ILS' },
        ],
      },
      { op: '×' },
      { amount: 1.1, unit: 'factor' },
      { op: '×' },
      { percent: 0.35 },
    ];
    expect(formatFormula(tokens, 'en', t)).toBe(
      '(₪3,074.00 + ₪368.88) × 1.1 × 0.35%',
    );
  });

  it('renders currency conversion with an exchange rate', () => {
    expect(
      formatFormula(
        [
          { amount: 1000, unit: 'USD' },
          { op: '×' },
          { amount: 3.4393, unit: 'factor' },
        ],
        'en',
        t,
      ),
    ).toBe('$1,000.00 × 3.4393');
    expect(formatFormula([{ amount: 50, unit: 'EUR' }], 'en', t)).toBe(
      '€50.00',
    );
  });

  it('renders max() for Chargeable Weight', () => {
    expect(
      formatFormula(
        [
          { op: 'max' },
          { amount: 54, unit: 'kg' },
          { amount: 31.2, unit: 'kg' },
        ],
        'en',
        t,
      ),
    ).toBe('max(54.00 kg, 31.20 kg)');
  });

  it.each(SUPPORTED_LANGUAGES)('uses Latin digits in %s', language => {
    const text = formatFormula(
      [
        { amount: 1234.5, unit: 'ILS' },
        { op: '÷' },
        { amount: 1000, unit: 'USD' },
      ],
      language,
      t,
    );
    expect(text).toMatch(/1,234\.50/);
    expect(text).not.toMatch(/[٠-٩]/);
  });
});

describe('formatStepValue', () => {
  it('formats factors to at most 4 dp and weights with kg', () => {
    expect(formatStepValue({ amount: 1.2592, unit: 'factor' }, 'en', t)).toBe(
      '1.2592',
    );
    expect(formatStepValue({ amount: 2, unit: 'factor' }, 'en', t)).toBe('2');
    expect(formatStepValue({ amount: 104.29, unit: 'kg' }, 'en', t)).toBe(
      '104.29 kg',
    );
  });
});
