import type { FormulaToken, StepValue } from '@/features/calc-engine';
import { formatMoney, formatNumber, type Language } from '@/features/i18n';

type T = (key: string) => string;

export function formatStepValue(
  value: StepValue,
  language: Language,
  t: T,
): string {
  switch (value.unit) {
    case 'ILS':
    case 'USD':
    case 'EUR':
      return formatMoney(value.amount, value.unit, language);
    case 'kg':
      return `${formatNumber(value.amount, language)} ${t('common.kg')}`;
    case 'factor':
      return formatNumber(value.amount, language, 4, 0);
  }
}

/** Plain-text formula, e.g. `($1,000.00 + $100.00) × 3.5`. */
export function formatFormula(
  tokens: FormulaToken[],
  language: Language,
  t: T,
): string {
  const [first, ...rest] = tokens;
  if (first && 'op' in first && first.op === 'max') {
    return `max(${rest.map(token => formatFormula([token], language, t)).join(', ')})`;
  }
  return tokens
    .map(token => {
      if ('op' in token) return ` ${token.op} `;
      if ('percent' in token)
        return `${formatNumber(token.percent, language, 4, 0)}%`;
      if ('group' in token)
        return `(${formatFormula(token.group, language, t)})`;
      return formatStepValue(token, language, t);
    })
    .join('');
}
