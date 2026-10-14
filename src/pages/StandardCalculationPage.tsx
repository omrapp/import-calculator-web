import { useTranslation } from 'react-i18next';

import { CalculatorForm } from '@/features/calculator-ui';
import { useHistory } from '@/features/history';

export function StandardCalculationPage() {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <CalculatorForm
      mode="standard"
      title={t('nav.standard')}
      defaultTitle={t('calculation_meta.default_title', {
        n: history.length + 1,
      })}
    />
  );
}
