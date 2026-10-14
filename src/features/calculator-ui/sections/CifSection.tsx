import { Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { CalculationInput } from '@/features/calc-engine';

import { AmountField } from '../fields/AmountField';
import { NumberField } from '../fields/NumberField';
import { Section } from './Section';

export function CifSection({ mode }: { mode: CalculationInput['mode'] }) {
  const { t } = useTranslation();

  return (
    <Section icon={<Package />} title={t('home.cif_calculation')}>
      <AmountField
        path="cif.cost"
        unitKey="currency"
        label={t('home.labels.cost')}
      />
      {mode === 'standard' && (
        <AmountField
          path="cif.freight"
          unitKey="currency"
          label={t('home.labels.freight')}
        />
      )}
      <AmountField
        path="cif.insurance"
        unitKey="currency"
        label={t('home.labels.insurance')}
        hint={t('calculator.hints.insurance_derived')}
      />
      <NumberField
        name="cif.premiumPercent"
        label={t('home.labels.premium')}
        unit="%"
        className="max-w-48"
      />
    </Section>
  );
}
