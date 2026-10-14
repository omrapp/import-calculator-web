import { describe, expect, it } from 'vitest';

import { calculate, estimateCif, InvalidCalculationError } from './calculate';
import { ils, standardInput, usd } from './fixtures';
import type { Step } from './types';

const sectionHeaders = (steps: Step[]) =>
  steps.flatMap(step =>
    step.kind === 'header' && 'key' in step.label ? [step.label.key] : [],
  );

describe('calculate', () => {
  it('computes CIF, duty, VAT and factors for a simple Standard Calculation', () => {
    const { totals } = calculate(standardInput());
    // (1000 + 100) USD × 3.5 = 3850; duty 10% = 385; VAT 18% of 4235 = 762.3
    expect(totals).toMatchObject({
      cif: 3850,
      customsDuty: 385,
      landedCost: 4235,
      vat: 762.3,
      totalIncludingVat: 4997.3,
      importFactor: 1.21,
      shekelPerUnitFactor: 4.235,
    });
  });

  it('never adds Tama to Landed Cost', () => {
    const withTama = calculate(standardInput({ tamaPercent: 20 })).totals;
    expect(withTama.tama).toBe(847);
    expect(withTama.landedCost).toBe(4235);
  });

  it('applies a percent Expense to the running total, in order', () => {
    const { totals } = calculate(
      standardInput({
        expenses: {
          localTransport: ils(765),
          customsBroker: { percent: 10 },
          bank: ils(0),
          other: ils(0),
          custom: [],
        },
      }),
    );
    // running total 4235 + 765 = 5000; 10% = 500
    expect(totals.expenses).toBe(1265);
    expect(totals.landedCost).toBe(5500);
  });

  it('labels Custom Expenses with their own name', () => {
    const { steps } = calculate(
      standardInput({
        expenses: {
          localTransport: ils(0),
          customsBroker: ils(0),
          bank: ils(0),
          other: ils(0),
          custom: [{ id: '1', name: 'Port storage', amount: ils(50) }],
        },
      }),
    );
    expect(steps).toContainEqual(
      expect.objectContaining({ label: { text: 'Port storage' } }),
    );
  });

  it('returns null factors when Cost is 0', () => {
    const { totals } = calculate(
      standardInput({
        cif: {
          cost: usd(0),
          freight: usd(100),
          insurance: null,
          premiumPercent: 0,
        },
      }),
    );
    expect(totals.importFactor).toBeNull();
    expect(totals.shekelPerUnitFactor).toBeNull();
  });

  it('orders sections like the RN app and omits empty ones', () => {
    expect(sectionHeaders(calculate(standardInput()).steps)).toEqual([
      'result.steps.cif_calculation',
      'result.steps.customs_duty_calculation',
      'result.steps.vat_calculation',
      'result.steps.factors',
    ]);

    const full = calculate(
      standardInput({
        mode: 'air-shipment',
        airShipment: {
          cartons: [
            { length: 10, width: 10, height: 10, weight: 1, quantity: 1 },
          ],
          divisor: 6000,
          ratePerKg: 1,
          fuelSurchargePerKg: 0,
          handlingFee: 0,
        },
        purchaseTaxPercent: 10,
        expenses: {
          localTransport: ils(10),
          customsBroker: ils(0),
          bank: ils(0),
          other: ils(0),
          custom: [],
        },
      }),
    );
    expect(sectionHeaders(full.steps)).toEqual([
      'result.steps.air_freight_calc',
      'result.steps.cif_calculation',
      'result.steps.customs_duty_calculation',
      'result.steps.purchase_tax_calculation',
      'result.steps.expenses',
      'result.steps.vat_calculation',
      'result.steps.factors',
    ]);
  });

  it('throws InvalidCalculationError for invalid input', () => {
    expect(() =>
      calculate(standardInput({ rates: { USD: 0, EUR: 4 } })),
    ).toThrow(InvalidCalculationError);
  });
});

describe('deviations from the RN app', () => {
  it('1: VAT 0 means 0%, null means 18%', () => {
    expect(calculate(standardInput({ vatPercent: 0 })).totals.vat).toBe(0);
    expect(calculate(standardInput({ vatPercent: null })).totals.vat).toBe(
      762.3,
    );
  });

  it('2: compound rule with a missing Duty Option is rejected, not 0 duty', () => {
    const input = standardInput({
      duty: { kind: 'compound', rule: 'higher', optionI: 500, optionII: 0 },
    });
    expect(() => calculate(input)).toThrow(InvalidCalculationError);
  });

  it('3: air Freight entering CIF is the rounded total shown in the steps', () => {
    const { totals } = calculate(
      standardInput({
        mode: 'air-shipment',
        rates: { USD: 3.5, EUR: 4 },
        cif: {
          cost: usd(0),
          freight: usd(0),
          insurance: null,
          premiumPercent: 0,
        },
        airShipment: {
          // volumetric 7×7×7/6000 = 0.05716… → 0.06 kg
          cartons: [{ length: 7, width: 7, height: 7, weight: 0, quantity: 1 }],
          divisor: 6000,
          ratePerKg: 1.333,
          fuelSurchargePerKg: 0,
          handlingFee: 0,
        },
      }),
    );
    expect(totals.chargeableWeight).toBe(0.06);
    expect(totals.airFreightUsd).toBe(0.08);
    // RN fed the unrounded 0.0762… USD into CIF: 0.0762 × 3.5 → ₪0.27
    expect(totals.cif).toBe(0.28);
  });

  it('4: no silent fallback for a missing exchange rate', () => {
    expect(() =>
      calculate(standardInput({ rates: { USD: Number.NaN, EUR: 4 } })),
    ).toThrow(InvalidCalculationError);
  });
});

describe('estimateCif', () => {
  it('previews CIF even when non-CIF fields are invalid', () => {
    const input = standardInput({
      duty: { kind: 'compound', rule: 'lower', optionI: 0, optionII: 0 },
    });
    expect(estimateCif(input)).toBe(3850);
  });

  it('returns 0 when CIF inputs are invalid', () => {
    expect(estimateCif(standardInput({ rates: { USD: 0, EUR: 0 } }))).toBe(0);
  });
});
