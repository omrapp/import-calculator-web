import { describe, expect, it } from 'vitest';

import { validate } from '@/features/calc-engine';

import {
  emptyFormValues,
  type FormValues,
  formPathFor,
  toCalculationInput,
  toFormValues,
} from './formValues';

function filled(): FormValues {
  const values = emptyFormValues();
  values.rates = { USD: '3.074', EUR: '3.4393' };
  values.cif.cost = { amount: '1000*10', currency: 'EUR' };
  values.cif.freight = { amount: '1200', currency: 'USD' };
  values.cif.premiumPercent = '0.35';
  values.duty = {
    kind: 'higher',
    percent: '',
    optionI: '900',
    optionII: '1100',
  };
  values.tamaPercent = '12';
  values.purchaseTaxPercent = '15';
  values.vatPercent = '17';
  values.expenses.localTransport = { amount: '500', unit: 'ILS' };
  values.expenses.customsBroker = { amount: '0.5', unit: 'percent' };
  values.expenses.custom = [
    { id: 'x', name: 'Storage', amount: '40', unit: 'USD' },
  ];
  return values;
}

describe('toCalculationInput', () => {
  it('converts every field, evaluating expressions', () => {
    const { input, invalidExpressions } = toCalculationInput(
      filled(),
      'standard',
    );
    expect(invalidExpressions).toEqual([]);
    expect(input).toMatchObject({
      mode: 'standard',
      rates: { USD: 3.074, EUR: 3.4393 },
      cif: {
        cost: { amount: 10000, currency: 'EUR' },
        freight: { amount: 1200, currency: 'USD' },
        insurance: null,
        premiumPercent: 0.35,
      },
      duty: { kind: 'compound', rule: 'higher', optionI: 900, optionII: 1100 },
      tamaPercent: 12,
      purchaseTaxPercent: 15,
      vatPercent: 17,
      expenses: {
        localTransport: { amount: 500, currency: 'ILS' },
        customsBroker: { percent: 0.5 },
        custom: [
          { id: 'x', name: 'Storage', amount: { amount: 40, currency: 'USD' } },
        ],
      },
    });
    expect(input.airShipment).toBeUndefined();
    expect(validate(input)).toEqual([]);
  });

  it('maps empty Insurance and VAT to null, empty rates to NaN', () => {
    const { input } = toCalculationInput(emptyFormValues(), 'standard');
    expect(input.cif.insurance).toBeNull();
    expect(input.vatPercent).toBeNull();
    expect(input.rates.USD).toBeNaN();
  });

  it('reports invalid expressions by form path', () => {
    const values = filled();
    values.cif.cost.amount = '12+';
    values.expenses.custom[0].amount = 'abc';
    expect(toCalculationInput(values, 'standard').invalidExpressions).toEqual([
      'cif.cost.amount',
      'expenses.custom.0.amount',
    ]);
  });

  it('builds air shipment input and ignores the Freight field', () => {
    const values = filled();
    values.airShipment.cartons = [
      { length: '50', width: '40', height: '30', weight: '12', quantity: '3' },
    ];
    values.airShipment.ratePerKg = '3.2';
    const { input } = toCalculationInput(values, 'air-shipment');
    expect(input.cif.freight.amount).toBe(0);
    expect(input.airShipment).toEqual({
      cartons: [{ length: 50, width: 40, height: 30, weight: 12, quantity: 3 }],
      divisor: 6000,
      ratePerKg: 3.2,
      fuelSurchargePerKg: 0,
      handlingFee: 0,
    });
  });
});

describe('toFormValues', () => {
  it('round-trips through toCalculationInput', () => {
    const { input } = toCalculationInput(filled(), 'standard');
    const again = toCalculationInput(toFormValues(input), 'standard').input;
    expect(again).toEqual(input);
  });

  it('round-trips an air shipment', () => {
    const values = filled();
    values.airShipment.cartons.push({
      length: '10',
      width: '10',
      height: '10',
      weight: '1',
      quantity: '2',
    });
    const { input } = toCalculationInput(values, 'air-shipment');
    expect(
      toCalculationInput(toFormValues(input), 'air-shipment').input,
    ).toEqual(input);
  });
});

describe('formPathFor', () => {
  it.each([
    ['rates.USD', 'rates.USD'],
    ['expenses.bank.percent', 'expenses.bank.amount'],
    ['expenses.bank.amount', 'expenses.bank.amount'],
    ['expenses.custom.2.amount.percent', 'expenses.custom.2.amount'],
    ['expenses.custom.0.amount.amount', 'expenses.custom.0.amount'],
    ['airShipment.cartons.1.quantity', 'airShipment.cartons.1.quantity'],
  ])('%s → %s', (engine, form) => {
    expect(formPathFor(engine)).toBe(form);
  });
});
