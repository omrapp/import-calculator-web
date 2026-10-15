import type { Tone } from '@/lib/tone';

import type { CostPart } from './chartData';

export const PART_TONE: Record<CostPart, Tone> = {
  cif: 'cif',
  customsDuty: 'duty',
  purchaseTax: 'ptax',
  expenses: 'expenses',
  vat: 'vat',
};

const SECTION_TONE: Record<string, Tone> = {
  'result.steps.air_freight_calc': 'air',
  'result.steps.cif_calculation': 'cif',
  'result.steps.customs_duty_calculation': 'duty',
  'result.steps.purchase_tax_calculation': 'ptax',
  'result.steps.expenses': 'expenses',
  'result.steps.vat_calculation': 'vat',
  'result.steps.factors': 'factors',
};

/** Tone of a Breakdown section from its header key; brand teal if unknown. */
export const sectionTone = (key: string | undefined): Tone =>
  (key && SECTION_TONE[key]) || 'factors';
