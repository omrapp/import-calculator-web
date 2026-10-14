import { type ReactNode, useId } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatNumber, useLanguage } from '@/features/i18n';
import { cn } from '@/lib/utils';

import { evaluateExpression, sanitizeNumericInput } from '../expression';
import type { FormPath } from '../formPath';

type Props = {
  name: FormPath;
  label: string;
  /** Unit shown inside the field, e.g. ₪, %, kg. */
  unit?: string;
  hint?: string;
  /** Marks the field with * (required) or "optional" next to the label. */
  required?: boolean;
  /** Hide "optional" for a field that is needed only as an alternative to another. */
  showOptional?: boolean;
  /** Extra control shown after the label, e.g. an info button. */
  labelAddon?: ReactNode;
  placeholder?: string;
  className?: string;
  onUserChange?: () => void;
};

const HAS_OPERATOR = /\d\s*[-+*/×÷−]\s*[\d(]/;

/**
 * Text field that accepts a number or an arithmetic expression. Letters and
 * other symbols are dropped as they are typed or pasted; an expression that
 * still doesn't parse is flagged when the field loses focus.
 */
export function NumberField({
  name,
  label,
  unit,
  hint,
  required = false,
  showOptional = true,
  labelAddon,
  placeholder,
  className,
  onUserChange,
}: Props) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { clearErrors, setError } = useFormContext();
  const {
    field: { ref, value: rawValue, onBlur, onChange },
    fieldState,
  } = useController({ name });
  const id = useId();
  const value = String(rawValue ?? '');
  const evaluated = HAS_OPERATOR.test(value) ? evaluateExpression(value) : null;
  const error = fieldState.error?.type;
  const describedBy = `${id}-desc`;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <FieldLabel
        htmlFor={id}
        label={label}
        required={required}
        showOptional={showOptional}
        addon={labelAddon}
      />
      {/* Numbers read LTR in every language, so the unit sits at the LTR end. */}
      <div className="relative" dir="ltr">
        <Input
          id={id}
          ref={ref}
          name={name}
          value={value}
          onBlur={() => {
            onBlur();
            if (Number.isNaN(evaluateExpression(value))) {
              setError(name, { type: 'invalid-expression' });
            }
          }}
          onChange={event => {
            onChange(sanitizeNumericInput(event.target.value));
            clearErrors(name);
            onUserChange?.();
          }}
          inputMode="decimal"
          autoComplete="off"
          dir="ltr"
          placeholder={placeholder}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn('tabular-nums', unit && 'pe-10')}
        />
        {unit && (
          <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-sm text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
      <p id={describedBy} className="min-h-4 text-xs">
        {error ? (
          <span className="text-destructive">
            {t(`calculator.validation.${error}`)}
          </span>
        ) : evaluated !== null && !Number.isNaN(evaluated) ? (
          <span className="text-muted-foreground tabular-nums">
            {t('calculator.hints.expression_result', {
              value: formatNumber(evaluated, language),
            })}
          </span>
        ) : (
          hint && <span className="text-muted-foreground">{hint}</span>
        )}
      </p>
    </div>
  );
}

/** Label row: the label, then * or "optional", then an optional addon. */
export function FieldLabel({
  htmlFor,
  label,
  required,
  showOptional = true,
  addon,
}: {
  htmlFor: string;
  label: string;
  required: boolean;
  showOptional?: boolean;
  addon?: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-5 items-center gap-1">
      <Label htmlFor={htmlFor}>{label}</Label>
      {required ? (
        <span aria-hidden className="text-sm font-medium text-destructive">
          *
        </span>
      ) : (
        showOptional && (
          <span className="text-xs text-muted-foreground">
            ({t('calculator.labels.optional')})
          </span>
        )
      )}
      {addon}
    </div>
  );
}
