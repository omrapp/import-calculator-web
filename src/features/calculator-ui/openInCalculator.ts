import { useNavigate } from 'react-router';

import type { CalculationLink } from '@/features/calc-engine';

import { saveDraft } from './draft';
import { toFormValues } from './formValues';

export const calculatorPath = (mode: CalculationLink['input']['mode']) =>
  mode === 'standard' ? '/' : '/air-shipment';

/** Opens a Calculation's inputs in its calculator form for editing. */
export function useOpenInCalculator() {
  const navigate = useNavigate();
  return (link: CalculationLink) => {
    const { mode } = link.input;
    saveDraft(mode, {
      values: toFormValues(link.input),
      // Bank rates are refetched; manual ones are kept.
      manualRates: link.rates.source === 'manual',
    });
    void navigate(calculatorPath(mode));
  };
}
