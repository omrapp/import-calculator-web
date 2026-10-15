import { describe, expect, it } from 'vitest';

import {
  calculate,
  type CalculationInput,
  type CalculationTotals,
} from '@/features/calc-engine';
import golden from '@/features/calc-engine/__fixtures__/rn-golden.json';

import { toCostSegments, toWeightComparison } from './chartData';

const fixtures = golden as { name: string; input: CalculationInput }[];
const fixture = (name: string) => fixtures.find(f => f.name === name)!.input;

const totals = (patch: Partial<CalculationTotals>): CalculationTotals => ({
  cif: 1000,
  customsDuty: 100,
  tama: 0,
  purchaseTax: 0,
  expenses: 0,
  landedCost: 1100,
  vat: 198,
  totalIncludingVat: 1298,
  importFactor: null,
  shekelPerUnitFactor: null,
  ...patch,
});

describe('toCostSegments', () => {
  it.each(fixtures.map(f => [f.name, f.input] as const))(
    'matches the engine totals: %s',
    (_, input) => {
      const result = calculate(input);
      const segments = toCostSegments(result.totals);
      for (const segment of segments)
        expect(segment.amount).toBe(result.totals[segment.part]);
      const sum = segments.reduce((acc, s) => acc + s.amount, 0);
      expect(sum).toBeCloseTo(result.totals.totalIncludingVat, 2);
      expect(segments.at(-1)!.end).toBeCloseTo(
        result.totals.totalIncludingVat,
        2,
      );
      const landed = segments.find(s => s.part === 'vat')!.start;
      expect(landed).toBeCloseTo(result.totals.landedCost, 2);
    },
  );

  it('keeps cascade order and running totals', () => {
    const segments = toCostSegments(
      totals({ purchaseTax: 50, expenses: 25, totalIncludingVat: 1373 }),
    );
    expect(segments.map(s => s.part)).toEqual([
      'cif',
      'customsDuty',
      'purchaseTax',
      'expenses',
      'vat',
    ]);
    expect(segments.map(s => [s.start, s.end])).toEqual([
      [0, 1000],
      [1000, 1100],
      [1100, 1150],
      [1150, 1175],
      [1175, 1373],
    ]);
  });

  it('drops zero parts', () => {
    const parts = toCostSegments(totals({ customsDuty: 0 })).map(s => s.part);
    expect(parts).toEqual(['cif', 'vat']);
  });

  it('never charts Tama, which is not part of the cost', () => {
    const parts = toCostSegments(totals({ tama: 80 })).map(s => s.part);
    expect(parts).not.toContain('tama');
  });

  it('returns nothing for a zero total', () => {
    expect(
      toCostSegments(
        totals({ cif: 0, customsDuty: 0, vat: 0, totalIncludingVat: 0 }),
      ),
    ).toEqual([]);
  });

  it('shares add up to 1', () => {
    const shares = toCostSegments(totals({})).map(s => s.share);
    expect(shares.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
  });
});

describe('toWeightComparison', () => {
  it('is null in standard mode', () => {
    expect(
      toWeightComparison(calculate(fixture('usd cost, derived insurance'))),
    ).toBeNull();
  });

  it('picks actual weight when it wins', () => {
    const result = calculate(fixture('air: single carton, actual wins'));
    const weight = toWeightComparison(result)!;
    expect(weight.basis).toBe('actual');
    expect(weight.chargeable).toBe(result.totals.chargeableWeight);
    expect(weight.chargeable).toBe(weight.actual);
  });

  it('picks volumetric weight when it wins', () => {
    const result = calculate(fixture('air: multi carton, volumetric wins'));
    const weight = toWeightComparison(result)!;
    expect(weight.basis).toBe('volumetric');
    expect(weight.chargeable).toBeCloseTo(weight.volumetric, 2);
  });
});
