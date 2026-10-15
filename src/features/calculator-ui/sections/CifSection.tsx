import { Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { CalculationInput } from '@/features/calc-engine';

import { AmountField } from '../fields/AmountField';
import { NumberField } from '../fields/NumberField';
import { Section } from './Section';

export function CifSection({ mode }: { mode: CalculationInput['mode'] }) {
  const { t } = useTranslation();

  return (
    <Section tone="cif" icon={<Package />} title={t('home.cif_calculation')}>
      <AmountField
        path="cif.cost"
        unitKey="currency"
        label={t('home.labels.cost')}
        required
      />
      {mode === 'standard' && (
        <AmountField
          path="cif.freight"
          unitKey="currency"
          label={t('home.labels.freight')}
          hint={t('calculator.hints.freight_zero')}
          required
        />
      )}
      <AmountField
        path="cif.insurance"
        unitKey="currency"
        label={t('home.labels.insurance')}
        hint={t('calculator.hints.insurance_derived')}
        required
      />
      <NumberField
        name="cif.premiumPercent"
        label={t('home.labels.premium')}
        unit="%"
        hint={t('calculator.hints.premium_alternative')}
        showOptional={false}
        className="max-w-48"
      />
    </Section>
  );
}
