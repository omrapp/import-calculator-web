import type {
  CalculationResult,
  CalculationTotals,
} from '@/features/calc-engine';

/** The parts that add up to the Total Including VAT, in cascade order. */
export const COST_PARTS = [
  'cif',
  'customsDuty',
  'purchaseTax',
  'expenses',
  'vat',
] as const;

export type CostPart = (typeof COST_PARTS)[number];

export type CostSegment = {
  part: CostPart;
  amount: number;
  /** Fraction (0–1) of the Total Including VAT. */
  share: number;
  /** Running total before this part is added. */
  start: number;
  /** Running total after this part is added. */
  end: number;
};

/**
 * Splits the engine's totals into chart segments. Reads the totals as-is and
 * never recomputes them; zero parts are dropped so no empty segment renders.
 */
export function toCostSegments(totals: CalculationTotals): CostSegment[] {
  if (!(totals.totalIncludingVat > 0)) return [];
  const segments: CostSegment[] = [];
  let running = 0;
  for (const part of COST_PARTS) {
    const amount = totals[part];
    if (!(amount > 0)) continue;
    segments.push({
      part,
      amount,
      share: amount / totals.totalIncludingVat,
      start: running,
      end: running + amount,
    });
    running += amount;
  }
  return segments;
}

export type WeightComparison = {
  actual: number;
  volumetric: number;
  chargeable: number;
  basis: 'actual' | 'volumetric';
};

const stepAmount = (result: CalculationResult, key: string) => {
  const step = result.steps.find(
    s => 'value' in s && 'key' in s.label && s.label.key === key,
  );
  return step && 'value' in step ? step.value.amount : undefined;
};

/** Actual vs Volumetric Weight for an Air Shipment; null in standard mode. */
export function toWeightComparison(
  result: CalculationResult,
): WeightComparison | null {
  const chargeable = result.totals.chargeableWeight;
  const actual = stepAmount(result, 'result.steps.actual_weight');
  const volumetric = stepAmount(result, 'result.steps.volumetric_weight');
  if (
    chargeable === undefined ||
    actual === undefined ||
    volumetric === undefined
  )
    return null;
  return {
    actual,
    volumetric,
    chargeable,
    basis: volumetric >= actual ? 'volumetric' : 'actual',
  };
}
