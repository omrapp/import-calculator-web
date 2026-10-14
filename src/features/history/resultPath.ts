import {
  type CalculationLink,
  encodeCalculation,
} from '@/features/calc-engine';

export const resultPath = (link: CalculationLink) =>
  `/result?c=${encodeCalculation(link)}`;
