import { describe, expect, it } from 'vitest';

import { calculate, validate } from '@/features/calc-engine';

import {
  EXAMPLE_RATES,
  EXAMPLES,
  exampleById,
  exampleTags,
  localizeExample,
} from './data';

const totals = (id: Parameters<typeof exampleById>[0]) =>
  calculate(exampleById(id).input).totals;

describe('EXAMPLES', () => {
  it('are valid and use the fixed teaching rates', () => {
    for (const { input } of EXAMPLES) {
      expect(validate(input)).toEqual([]);
      expect(input.rates).toEqual(EXAMPLE_RATES);
    }
  });

  it('cover every scenario at least once', () => {
    const seen = new Set(
      EXAMPLES.flatMap(({ input }) =>
        exampleTags(input).map(tag =>
          'value' in tag
            ? `${tag.kind}:${tag.value}`
            : `vat:${tag.percent > 0}`,
        ),
      ),
    );
    for (const tag of [
      'shipping:sea',
      'shipping:air',
      'duty:percent',
      'duty:none',
      'duty:compound',
      'purchase_tax:yes',
      'purchase_tax:no',
      'vat:true',
      'vat:false',
      'currency:USD',
      'currency:EUR',
      'expenses:fixed',
      'expenses:percent',
    ]) {
      expect(seen, tag).toContain(tag);
    }
  });

  // The explanation text quotes these numbers; keep them in step.
  it('gives the numbers the text explains', () => {
    expect(totals('sea_standard')).toMatchObject({
      cif: 41_810,
      customsDuty: 5_017.2,
      totalIncludingVat: 58_088.1,
    });
    expect(totals('duty_free').customsDuty).toBe(0);
    expect(totals('compound_duty').customsDuty).toBe(7_000);
    expect(exampleById('compound_duty').params?.optionI.amount).toBe(5_017.2);
    expect(totals('purchase_tax')).toMatchObject({
      tama: 4_682.72,
      purchaseTax: 7_726.49,
    });
    expect(totals('vat_free')).toMatchObject({
      vat: 0,
      landedCost: totals('sea_standard').landedCost,
    });
    expect(totals('air_volumetric')).toMatchObject({
      chargeableWeight: 210,
      airFreightUsd: 1_146,
    });
    expect(totals('air_actual').chargeableWeight).toBe(500);
  });

  it('each variant changes one thing from its base', () => {
    for (const example of EXAMPLES.filter(e => e.base)) {
      expect(EXAMPLES.map(e => e.id)).toContain(example.base);
      expect(example.input).not.toEqual(exampleById(example.base!).input);
    }
  });
});

describe('localizeExample', () => {
  it('translates Custom Expense names', () => {
    const input = localizeExample(exampleById('percent_expenses'), key =>
      key.toUpperCase(),
    );
    expect(input.expenses.custom[0].name).toBe(
      'EXAMPLES.ITEMS.PERCENT_EXPENSES.CUSTOM_NAME',
    );
  });
});
