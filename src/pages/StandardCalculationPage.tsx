import { useTranslation } from 'react-i18next';

import { CalculatorForm } from '@/features/calculator-ui';

export function StandardCalculationPage() {
  const { t } = useTranslation();
  return <CalculatorForm mode="standard" title={t('nav.standard')} />;
}
