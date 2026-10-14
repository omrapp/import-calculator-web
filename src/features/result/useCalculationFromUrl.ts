import { useSearchParams } from 'react-router';

import {
  calculate,
  type CalculationLink,
  type CalculationResult,
  decodeCalculation,
  validate,
} from '@/features/calc-engine';

export type CalculationFromUrl =
  | { status: 'ok'; link: CalculationLink; result: CalculationResult }
  | { status: 'invalid' };

/** Decodes `?c=` and recomputes the Result from its inputs. */
export function useCalculationFromUrl(): CalculationFromUrl {
  const [params] = useSearchParams();
  const link = decodeCalculation(params.get('c') ?? '');
  if (!link || validate(link.input).length > 0) return { status: 'invalid' };
  return { status: 'ok', link, result: calculate(link.input) };
}
