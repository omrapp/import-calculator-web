import { useTranslation } from 'react-i18next';

import { CalculatorForm } from '@/features/calculator-ui';
import { useHistory } from '@/features/history';

export function AirShipmentCalculationPage() {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <CalculatorForm
      mode="air-shipment"
      title={t('nav.air_shipment')}
      defaultTitle={t('calculation_meta.default_title', {
        n: history.length + 1,
      })}
    />
  );
}
