import type { CalculationInput } from '@/features/calc-engine';

import { emptyFormValues, type FormValues } from './formValues';

export type Draft = { values: FormValues; manualRates: boolean };

const keyFor = (mode: CalculationInput['mode']) => `draft:${mode}`;

export function loadDraft(mode: CalculationInput['mode']): Draft | null {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(keyFor(mode)) ?? 'null',
    ) as Partial<Draft> | null;
    const values = parsed?.values;
    const empty = emptyFormValues();
    // Drafts from before titles existed have no `meta`.
    const expected = Object.keys(empty).filter(key => key !== 'meta');
    if (
      !values ||
      typeof values !== 'object' ||
      !expected.every(key => key in values)
    ) {
      return null;
    }
    return {
      values: { ...values, meta: values.meta ?? empty.meta },
      manualRates: parsed.manualRates === true,
    };
  } catch {
    return null;
  }
}

/** Bank rates are not drafted; they reload fresh each visit. */
export function saveDraft(mode: CalculationInput['mode'], draft: Draft): void {
  const values = draft.manualRates
    ? draft.values
    : { ...draft.values, rates: { USD: '', EUR: '' } };
  try {
    localStorage.setItem(
      keyFor(mode),
      JSON.stringify({ values, manualRates: draft.manualRates }),
    );
  } catch {
    // Storage unavailable; the draft just won't survive a refresh.
  }
}

export function clearDraft(mode: CalculationInput['mode']): void {
  try {
    localStorage.removeItem(keyFor(mode));
  } catch {
    // Nothing to clear.
  }
}
