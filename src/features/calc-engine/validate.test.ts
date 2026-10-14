import { describe, expect, it } from 'vitest';

import { eur, ils, standardInput, usd } from './fixtures';
import { validate } from './validate';

describe('validate', () => {
  it('accepts a valid Standard Calculation', () => {
    expect(validate(standardInput())).toEqual([]);
  });

  it('requires a positive rate for each foreign currency in use', () => {
    expect(
      validate(standardInput({ rates: { USD: 0, EUR: Number.NaN } })),
    ).toEqual([{ field: 'rates.USD', code: 'positive' }]);
    expect(
      validate(
        standardInput({
          rates: { USD: 3.5, EUR: Number.NaN },
          cif: {
            cost: eur(10),
            freight: usd(1),
            insurance: null,
            premiumPercent: 0,
          },
        }),
      ),
    ).toEqual([{ field: 'rates.EUR', code: 'required' }]);
  });

  it('does not require rates when everything is in ₪', () => {
    expect(
      validate(
        standardInput({
          rates: { USD: 0, EUR: 0 },
          cif: {
            cost: ils(100),
            freight: ils(10),
            insurance: null,
            premiumPercent: 0,
          },
        }),
      ),
    ).toEqual([]);
  });

  it('rejects negative amounts', () => {
    expect(
      validate(
        standardInput({
          cif: {
            cost: usd(-1),
            freight: usd(0),
            insurance: null,
            premiumPercent: 0,
          },
          tamaPercent: -5,
        }),
      ),
    ).toEqual([
      { field: 'cif.cost.amount', code: 'non-negative' },
      { field: 'tamaPercent', code: 'non-negative' },
    ]);
  });

  it('requires both Duty Options under a Compound Duty Rule', () => {
    expect(
      validate(
        standardInput({
          duty: { kind: 'compound', rule: 'higher', optionI: 100, optionII: 0 },
        }),
      ),
    ).toEqual([{ field: 'duty.optionII', code: 'duty-options-required' }]);
  });

  it('requires Cartons and a positive divisor for an Air Shipment Calculation', () => {
    expect(validate(standardInput({ mode: 'air-shipment' }))).toEqual([
      { field: 'airShipment.cartons', code: 'required' },
    ]);
    expect(
      validate(
        standardInput({
          mode: 'air-shipment',
          airShipment: {
            cartons: [
              { length: 1, width: 1, height: 1, weight: 1, quantity: 0 },
            ],
            divisor: 0,
            ratePerKg: 1,
            fuelSurchargePerKg: 0,
            handlingFee: 0,
          },
        }),
      ),
    ).toEqual([
      { field: 'airShipment.cartons.0.quantity', code: 'positive' },
      { field: 'airShipment.divisor', code: 'positive' },
    ]);
  });
});
