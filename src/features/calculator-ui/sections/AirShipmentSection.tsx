import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { calculateAirFreight } from '@/features/calc-engine';
import { formatMoney, formatNumber, useLanguage } from '@/features/i18n';

import { evaluateExpression } from '../expression';
import { NumberField } from '../fields/NumberField';
import { emptyCarton, type FormValues } from '../formValues';
import { Section } from './Section';

const CARTON_FIELDS = [
  ['length', 'home.labels.length', 'cm'],
  ['width', 'home.labels.width', 'cm'],
  ['height', 'home.labels.height', 'cm'],
  ['weight', 'home.labels.weight', null],
  ['quantity', 'home.labels.quantity', null],
] as const;

/** Live Chargeable Weight and air Freight; null while inputs are incomplete. */
function useAirFreightPreview() {
  const air = useWatch<FormValues, 'airShipment'>({ name: 'airShipment' });
  const n = (text: string) => evaluateExpression(text) ?? 0;
  const cartons = air.cartons.map(c => ({
    length: n(c.length),
    width: n(c.width),
    height: n(c.height),
    weight: n(c.weight),
    quantity: n(c.quantity),
  }));
  const divisor = n(air.divisor);
  const numbers = [
    divisor,
    ...cartons.flatMap(c => Object.values(c)),
    n(air.ratePerKg),
    n(air.fuelSurchargePerKg),
    n(air.handlingFee),
  ];
  if (divisor <= 0 || numbers.some(v => !Number.isFinite(v) || v < 0))
    return null;
  return calculateAirFreight({
    cartons,
    divisor,
    ratePerKg: n(air.ratePerKg),
    fuelSurchargePerKg: n(air.fuelSurchargePerKg),
    handlingFee: n(air.handlingFee),
  });
}

export function AirShipmentSection() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { fields, append, remove } = useFieldArray<
    FormValues,
    'airShipment.cartons'
  >({
    name: 'airShipment.cartons',
  });
  const preview = useAirFreightPreview();

  return (
    <Section title={t('home.labels.air_freight_details')}>
      {fields.map((carton, index) => (
        <fieldset key={carton.id} className="rounded-md border p-3">
          <div className="mb-2 flex items-center justify-between">
            <legend className="text-sm font-medium">
              {t('result.steps.carton', { number: index + 1 })}
            </legend>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={fields.length === 1}
              onClick={() => remove(index)}
              aria-label={`${t('calculator.actions.remove')} ${t('result.steps.carton', { number: index + 1 })}`}
            >
              <Trash2 />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-x-3 sm:grid-cols-5">
            {CARTON_FIELDS.map(([key, labelKey, unit]) => (
              <NumberField
                key={key}
                name={`airShipment.cartons.${index}.${key}`}
                label={t(labelKey)}
                unit={unit ? t('common.cm') : undefined}
              />
            ))}
          </div>
        </fieldset>
      ))}
      <Button
        type="button"
        variant="outline"
        className="self-start"
        onClick={() => append(emptyCarton())}
      >
        <Plus />
        {t('calculator.actions.add_carton')}
      </Button>

      <div className="grid grid-cols-2 gap-x-3 sm:grid-cols-4">
        <NumberField
          name="airShipment.divisor"
          label={t('home.labels.volumetric_divisor')}
        />
        <NumberField
          name="airShipment.ratePerKg"
          label={t('home.labels.rate_per_kg')}
        />
        <NumberField
          name="airShipment.fuelSurchargePerKg"
          label={t('home.labels.fuel_surcharge')}
        />
        <NumberField
          name="airShipment.handlingFee"
          label={t('home.labels.handling_fee')}
        />
      </div>

      <dl
        className="grid grid-cols-2 gap-3 rounded-md bg-muted p-3 text-sm"
        aria-live="polite"
      >
        <div>
          <dt className="text-muted-foreground">
            {t('home.labels.chargeable_weight')}
          </dt>
          <dd
            className="font-medium tabular-nums"
            data-testid="chargeable-weight"
          >
            {preview
              ? `${formatNumber(preview.chargeableWeight, language)} ${t('common.kg')}`
              : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">
            {t('home.labels.total_freight_cost')}
          </dt>
          <dd className="font-medium tabular-nums">
            {preview ? formatMoney(preview.freightUsd, 'USD', language) : '—'}
          </dd>
        </div>
      </dl>
    </Section>
  );
}
