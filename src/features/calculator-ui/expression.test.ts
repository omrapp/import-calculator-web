import { describe, expect, it } from 'vitest';

import { evaluateExpression, sanitizeNumericInput } from './expression';

describe('evaluateExpression', () => {
  it.each([
    ['1200*3+45', 3645],
    ['(10+5)/3', 5],
    ['2÷4×3', 1.5],
    ['10 − 2.5', 7.5],
    ['-3+5', 2],
    ['-(2+3)*2', -10],
    ['1,250.5', 1250.5],
    ['١٢٣', 123],
    ['٠٫٥', 0.5],
    ['  42  ', 42],
    ['3.074', 3.074],
  ])('%s → %d', (expression, expected) => {
    expect(evaluateExpression(expression)).toBeCloseTo(expected, 10);
  });

  it('returns null for empty input', () => {
    expect(evaluateExpression('')).toBeNull();
    expect(evaluateExpression('   ')).toBeNull();
  });

  it.each([
    '1+',
    'abc',
    '2**3',
    'alert(1)',
    '(1+2',
    '1+2)',
    '1/0',
    '1..2',
    '()',
  ])('rejects %s', expression => {
    expect(evaluateExpression(expression)).toBeNaN();
  });
});

describe('sanitizeNumericInput', () => {
  it.each([
    ['1200*3+45', '1200*3+45'],
    ['12abc3', '123'],
    ['alert(1)', '(1)'],
    ['$1,250.5', '1,250.5'],
    ['2×3÷4−1', '2×3÷4−1'],
    ['١٢٣٫٥', '١٢٣٫٥'],
    ['1e5', '15'],
    ['3x4', '34'],
    ['(10 + 5) / 3', '(10 + 5) / 3'],
  ])('%s → %s', (raw, expected) => {
    expect(sanitizeNumericInput(raw)).toBe(expected);
  });
});
