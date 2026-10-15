import { Plus, Trash2, Wallet } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { AmountField } from '../fields/AmountField';
import { FIXED_EXPENSES, type FormValues } from '../formValues';
import { Section } from './Section';

const LABEL_KEYS = {
  localTransport: 'home.labels.local_transport',
  customsBroker: 'home.labels.customs_broker',
  bank: 'home.labels.bank',
  other: 'home.labels.other',
} as const;

export function ExpensesSection() {
  const { t } = useTranslation();
  const { register } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray<
    FormValues,
    'expenses.custom'
  >({
    name: 'expenses.custom',
  });

  return (
    <Section tone="expenses" icon={<Wallet />} title={t('home.expenses')}>
      <p className="text-xs text-muted-foreground">
        {t('calculator.hints.percent_expense')}
      </p>
      {FIXED_EXPENSES.map(key => (
        <AmountField
          key={key}
          path={`expenses.${key}`}
          unitKey="unit"
          label={t(LABEL_KEYS[key])}
          allowPercent
        />
      ))}

      {fields.map((item, index) => (
        <div key={item.id} className="rounded-md border p-3">
          <div className="flex items-end gap-2">
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor={`custom-${item.id}`}>
                {t('common.expense_name')}
              </Label>
              <Input
                id={`custom-${item.id}`}
                {...register(`expenses.custom.${index}.name`)}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              aria-label={t('calculator.actions.remove')}
            >
              <Trash2 />
            </Button>
          </div>
          <AmountField
            path={`expenses.custom.${index}`}
            unitKey="unit"
            label={t('common.expense_value')}
            allowPercent
          />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="self-start"
        onClick={() =>
          append({ id: crypto.randomUUID(), name: '', amount: '', unit: 'ILS' })
        }
      >
        <Plus />
        {t('common.add_expense')}
      </Button>
    </Section>
  );
}
