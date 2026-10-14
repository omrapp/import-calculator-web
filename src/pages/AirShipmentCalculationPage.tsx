import { useTranslation } from 'react-i18next';

import { CalculatorForm } from '@/features/calculator-ui';

export function AirShipmentCalculationPage() {
  const { t } = useTranslation();
  return <CalculatorForm mode="air-shipment" title={t('nav.air_shipment')} />;
}
