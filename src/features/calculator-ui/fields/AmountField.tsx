import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { FormPath } from '../formPath';
import type { ExpenseUnit } from '../formValues';
import { NumberField } from './NumberField';
import { UnitPicker } from './UnitPicker';
import { CURRENCIES, EXPENSE_UNITS, unitSymbol } from './units';

/** Amount + currency (or %) pair, e.g. Cost in $ or an Expense in %. */
export function AmountField({
  path,
  unitKey,
  label,
  hint,
  required = false,
  allowPercent = false,
}: {
  /** Group path holding `amount` and the unit field. */
  path: string;
  unitKey: 'currency' | 'unit';
  label: string;
  hint?: string;
  required?: boolean;
  allowPercent?: boolean;
}) {
  const { t } = useTranslation();
  const unitPath = `${path}.${unitKey}` as FormPath;
  const unit = useWatch({ name: unitPath }) as ExpenseUnit;

  return (
    <div className="flex flex-wrap items-start gap-x-3">
      <NumberField
        name={`${path}.amount` as FormPath}
        label={label}
        unit={unitSymbol(unit)}
        hint={hint}
        required={required}
        className="min-w-40 flex-1"
      />
      <div className="mt-6">
        <UnitPicker
          name={unitPath}
          units={allowPercent ? EXPENSE_UNITS : CURRENCIES}
          label={`${label} · ${t('common.currency')}`}
        />
      </div>
    </div>
  );
}
