import { round2 } from './rounding';
import type { AirShipmentInput, Carton, Step } from './types';

export type AirFreight = {
  chargeableWeight: number;
  /** Total air Freight in USD, rounded; becomes the Calculation's Freight. */
  freightUsd: number;
  steps: Step[];
};

const kg = (amount: number) => ({ amount, unit: 'kg' as const });
const usd = (amount: number) => ({ amount, unit: 'USD' as const });

export function cartonVolumetricWeight(carton: Carton, divisor: number) {
  return round2(
    ((carton.length * carton.width * carton.height) / divisor) *
      carton.quantity,
  );
}

export function calculateAirFreight(air: AirShipmentInput): AirFreight {
  const steps: Step[] = [
    { kind: 'header', label: { key: 'result.steps.air_freight_calc' } },
  ];

  let volumetric = 0;
  let actual = 0;
  air.cartons.forEach((carton, index) => {
    const cartonVolumetric = cartonVolumetricWeight(carton, air.divisor);
    volumetric += cartonVolumetric;
    actual += round2(carton.weight * carton.quantity);

    if (air.cartons.length > 1) {
      steps.push({
        kind: 'row',
        label: { key: 'result.steps.carton', params: { number: index + 1 } },
        value: kg(cartonVolumetric),
        formula: [
          {
            group: [
              { amount: carton.length, unit: 'factor' },
              { op: '×' },
              { amount: carton.width, unit: 'factor' },
              { op: '×' },
              { amount: carton.height, unit: 'factor' },
            ],
          },
          { op: '÷' },
          { amount: air.divisor, unit: 'factor' },
          { op: '×' },
          { amount: carton.quantity, unit: 'factor' },
        ],
      });
    }
  });

  const chargeableWeight = round2(Math.max(actual, volumetric));
  const freightCost = round2(chargeableWeight * air.ratePerKg);
  const fuelCost = round2(chargeableWeight * air.fuelSurchargePerKg);
  const freightUsd = round2(freightCost + fuelCost + air.handlingFee);

  steps.push(
    {
      kind: 'row',
      label: { key: 'result.steps.volumetric_weight' },
      value: kg(volumetric),
    },
    {
      kind: 'row',
      label: { key: 'result.steps.actual_weight' },
      value: kg(actual),
    },
    {
      kind: 'subtotal',
      label: {
        key: 'result.steps.chargeable_weight',
        params: { basis: volumetric >= actual ? 'volumetric' : 'actual' },
      },
      value: kg(chargeableWeight),
      formula: [{ op: 'max' }, kg(actual), kg(volumetric)],
    },
    {
      kind: 'row',
      label: { key: 'result.steps.freight_rate_cost' },
      value: usd(freightCost),
      formula: [kg(chargeableWeight), { op: '×' }, usd(air.ratePerKg)],
    },
    {
      kind: 'row',
      label: { key: 'result.steps.fuel_surcharge' },
      value: usd(fuelCost),
      formula: [kg(chargeableWeight), { op: '×' }, usd(air.fuelSurchargePerKg)],
    },
    {
      kind: 'row',
      label: { key: 'result.steps.handling_fee' },
      value: usd(air.handlingFee),
    },
    {
      kind: 'subtotal',
      label: { key: 'result.steps.total_air_freight' },
      value: usd(freightUsd),
      formula: [
        usd(freightCost),
        { op: '+' },
        usd(fuelCost),
        { op: '+' },
        usd(air.handlingFee),
      ],
    },
    { kind: 'divider' },
  );

  return { chargeableWeight, freightUsd, steps };
}
