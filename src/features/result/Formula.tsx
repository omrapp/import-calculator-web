import { useTranslation } from 'react-i18next';

import type { FormulaToken } from '@/features/calc-engine';
import { useLanguage } from '@/features/i18n';

import { formatFormula } from './format';

/** Formulas read left-to-right in every language, like the math they are. */
export function Formula({ tokens }: { tokens: FormulaToken[] }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  return (
    <bdi dir="ltr" className="tabular-nums">
      {formatFormula(tokens, language, t)}
    </bdi>
  );
}
