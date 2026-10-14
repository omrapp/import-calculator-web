import { describe, expect, it } from 'vitest';

import golden from './__fixtures__/rn-golden.json';
import { calculate } from './calculate';
import type { CalculationInput, CalculationTotals } from './types';

const fixtures = golden as {
  name: string;
  input: CalculationInput;
  expected: CalculationTotals;
}[];

describe('parity with RN ResultViewModel', () => {
  it.each(fixtures.map(f => [f.name, f] as const))('%s', (_, fixture) => {
    expect(calculate(fixture.input).totals).toEqual(fixture.expected);
  });
});
