import { describe, expect, it } from 'vitest';

import { eur, ils, standardInput } from './fixtures';
import {
  type CalculationLink,
  decodeCalculation,
  encodeCalculation,
} from './serialize';

const link: CalculationLink = {
  v: 1,
  input: standardInput({
    mode: 'air-shipment',
    cif: {
      cost: eur(7400),
      freight: ils(0),
      insurance: null,
      premiumPercent: 0.35,
    },
    airShipment: {
      cartons: [
        { length: 55, width: 42, height: 38, weight: 12.3, quantity: 5 },
        { length: 30, width: 30, height: 30, weight: 4, quantity: 2 },
      ],
      divisor: 6000,
      ratePerKg: 4.1,
      fuelSurchargePerKg: 0.6,
      handlingFee: 30,
    },
    duty: { kind: 'compound', rule: 'lower', optionI: 900, optionII: 1100 },
    vatPercent: null,
    expenses: {
      localTransport: ils(500),
      customsBroker: { percent: 0.5 },
      bank: ils(0),
      other: ils(0),
      custom: [{ id: 'a', name: 'אחסון בנמל — تخزين', amount: ils(430) }],
    },
  }),
  rates: { source: 'cached', lastUpdate: '2026-10-13T12:20:03Z' },
};

describe('calculation link codec', () => {
  it('round-trips a full Air Shipment link with Hebrew and Arabic text', () => {
    const encoded = encodeCalculation(link);
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(decodeCalculation(encoded)).toEqual(link);
  });

  it('rejects other versions', () => {
    expect(
      decodeCalculation(encodeCalculation({ ...link, v: 2 } as never)),
    ).toBeNull();
  });

  it('rejects garbage and truncated strings', () => {
    const encoded = encodeCalculation(link);
    expect(decodeCalculation('not-a-link')).toBeNull();
    expect(decodeCalculation('')).toBeNull();
    expect(decodeCalculation(encoded.slice(0, encoded.length / 2))).toBeNull();
  });

  it('rejects structurally wrong inputs', () => {
    const broken = {
      ...link,
      input: { ...link.input, duty: { kind: 'compound', rule: 'max' } },
    };
    expect(decodeCalculation(encodeCalculation(broken as never))).toBeNull();
  });
});
