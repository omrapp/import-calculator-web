import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import type { FormPath } from '../formPath';
import type { ExpenseUnit } from '../formValues';
import { unitSymbol } from './units';

const NAME_KEYS: Record<ExpenseUnit, string> = {
  ILS: 'common.shekel',
  USD: 'common.dollar',
  EUR: 'common.euro',
  percent: 'calculator.labels.percent',
};

/** Segmented ₪ / $ / € (/ %) picker bound to a form field. */
export function UnitPicker({
  name,
  units,
  label,
}: {
  name: FormPath;
  units: readonly ExpenseUnit[];
  label: string;
}) {
  const { t } = useTranslation();
  const { field } = useController({ name });

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      aria-label={label}
      value={String(field.value)}
      onValueChange={value => value && field.onChange(value)}
    >
      {units.map(unit => (
        <ToggleGroupItem
          key={unit}
          value={unit}
          aria-label={t(NAME_KEYS[unit])}
          className="min-w-9"
        >
          {unitSymbol(unit)}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
