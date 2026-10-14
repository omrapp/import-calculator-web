import { describe, expect, it } from 'vitest';

import { calculateAirFreight, cartonVolumetricWeight } from './air-shipment';

describe('air shipment', () => {
  it('computes volumetric weight per Carton line', () => {
    expect(
      cartonVolumetricWeight(
        { length: 60, width: 50, height: 45, weight: 9.5, quantity: 4 },
        6000,
      ),
    ).toBe(90);
  });

  it('charges the greater of actual and volumetric weight', () => {
    const result = calculateAirFreight({
      cartons: [
        { length: 60, width: 50, height: 45, weight: 9.5, quantity: 4 },
      ],
      divisor: 6000,
      ratePerKg: 2,
      fuelSurchargePerKg: 0.5,
      handlingFee: 10,
    });
    expect(result.chargeableWeight).toBe(90);
    expect(result.freightUsd).toBe(235);
  });

  it('shows per-Carton rows only for multiple Cartons', () => {
    const carton = {
      length: 10,
      width: 10,
      height: 10,
      weight: 1,
      quantity: 1,
    };
    const rows = (count: number) =>
      calculateAirFreight({
        cartons: Array(count).fill(carton),
        divisor: 6000,
        ratePerKg: 1,
        fuelSurchargePerKg: 0,
        handlingFee: 0,
      }).steps.filter(
        step =>
          step.kind === 'row' &&
          'key' in step.label &&
          step.label.key === 'result.steps.carton',
      ).length;
    expect(rows(1)).toBe(0);
    expect(rows(3)).toBe(3);
  });
});
