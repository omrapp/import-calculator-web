import { Landmark } from 'lucide-react';
import { useController, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { InfoButton } from '../fields/InfoButton';
import { NumberField } from '../fields/NumberField';
import type { FormValues } from '../formValues';
import { Section } from './Section';

const DUTY_KINDS = [
  ['percent', 'home.compound_rule.none'],
  ['higher', 'home.compound_rule.higher'],
  ['lower', 'home.compound_rule.lower'],
] as const;

export function DutiesSection() {
  const { t } = useTranslation();
  const { field } = useController<FormValues, 'duty.kind'>({
    name: 'duty.kind',
  });
  const kind = useWatch<FormValues, 'duty.kind'>({ name: 'duty.kind' });

  return (
    <Section tone="duty" icon={<Landmark />} title={t('home.duties_taxes')}>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">
          {t('calculator.labels.duty_mode')}
        </span>
        <ToggleGroup
          type="single"
          variant="outline"
          aria-label={t('home.labels.compound_rule')}
          value={field.value}
          onValueChange={value => value && field.onChange(value)}
          className="flex-wrap"
        >
          {DUTY_KINDS.map(([value, key]) => (
            <ToggleGroupItem
              key={value}
              value={value}
              className="h-auto py-1.5"
            >
              {t(key)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {kind === 'percent' ? (
        <NumberField
          name="duty.percent"
          label={t('home.labels.customs_duty_rate')}
          labelAddon={
            <InfoButton
              topic="customs_duty"
              label={t('home.labels.customs_duty_rate')}
            />
          }
          unit="%"
          className="max-w-48"
        />
      ) : (
        <div className="grid gap-x-3 sm:grid-cols-2">
          <NumberField
            name="duty.optionI"
            required
            label={t('home.labels.duty_option_i')}
            labelAddon={
              <InfoButton
                topic="duty_option_i"
                label={t('home.labels.duty_option_i')}
              />
            }
            unit="₪"
          />
          <NumberField
            name="duty.optionII"
            required
            label={t('home.labels.duty_option_ii')}
            labelAddon={
              <InfoButton
                topic="duty_option_ii"
                label={t('home.labels.duty_option_ii')}
              />
            }
            unit="₪"
          />
        </div>
      )}

      <div className="grid gap-x-3 sm:grid-cols-3">
        <NumberField
          name="tamaPercent"
          label={t('home.labels.tama')}
          unit="%"
        />
        <NumberField
          name="purchaseTaxPercent"
          label={t('home.labels.purchase_tax')}
          unit="%"
        />
        <NumberField
          name="vatPercent"
          label={t('home.labels.vat')}
          unit="%"
          placeholder="18"
          hint={t('calculator.hints.vat_default')}
        />
      </div>
    </Section>
  );
}
