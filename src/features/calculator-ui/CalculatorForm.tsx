import { Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  type CalculationInput,
  encodeCalculation,
  estimateCif,
  validate,
} from '@/features/calc-engine';
import { useExchangeRates } from '@/features/fx-rates';
import { formatMoney, useLanguage } from '@/features/i18n';

import { clearDraft, loadDraft, saveDraft } from './draft';
import type { FormPath } from './formPath';
import {
  emptyFormValues,
  type FormValues,
  formPathFor,
  toCalculationInput,
} from './formValues';
import { AirShipmentSection } from './sections/AirShipmentSection';
import { CifSection } from './sections/CifSection';
import { DutiesSection } from './sections/DutiesSection';
import { ExpensesSection } from './sections/ExpensesSection';
import { RatesSection } from './sections/RatesSection';

type Mode = CalculationInput['mode'];

function CifPreview({ mode }: { mode: Mode }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const values = useWatch<FormValues>() as FormValues;
  const cif = estimateCif(toCalculationInput(values, mode).input);

  return (
    <div className="flex flex-col" aria-live="polite">
      <span className="text-xs text-muted-foreground">
        {t('calculator.labels.cif_preview')}
      </span>
      <span
        className="text-lg font-semibold tabular-nums"
        data-testid="cif-preview"
      >
        {formatMoney(cif, 'ILS', language)}
      </span>
    </div>
  );
}

/** Saves the form as a draft while the user types (debounced). */
function DraftSaver({
  mode,
  manualRates,
}: {
  mode: Mode;
  manualRates: boolean;
}) {
  const values = useWatch<FormValues>() as FormValues;
  useEffect(() => {
    const timer = setTimeout(
      () => saveDraft(mode, { values, manualRates }),
      300,
    );
    return () => clearTimeout(timer);
  }, [values, manualRates, mode]);
  return null;
}

export function CalculatorForm({ mode, title }: { mode: Mode; title: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [initialDraft] = useState(() => loadDraft(mode));
  const form = useForm<FormValues>({
    defaultValues: initialDraft?.values ?? emptyFormValues(),
  });
  const [manualRates, setManualRates] = useState(
    initialDraft?.manualRates ?? false,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const exchangeRates = useExchangeRates();
  const bankRates =
    exchangeRates.status === 'live' || exchangeRates.status === 'cached'
      ? exchangeRates.rates
      : null;

  const applyBankRates = () => {
    if (!bankRates) return;
    form.setValue('rates.USD', String(bankRates.USD));
    form.setValue('rates.EUR', String(bankRates.EUR));
    form.clearErrors(['rates.USD', 'rates.EUR']);
  };

  useEffect(() => {
    if (!manualRates) applyBankRates();
    // applyBankRates only reads bankRates and form, both covered here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bankRates, manualRates]);

  const onSubmit = (values: FormValues) => {
    const { input, invalidExpressions } = toCalculationInput(values, mode);
    const errors = [
      ...invalidExpressions.map(path => ({ path, code: 'invalid-expression' })),
      ...validate(input).map(error => ({
        path: formPathFor(error.field),
        code: error.code,
      })),
    ].filter(
      // An invalid expression already explains that field.
      (error, i, all) => all.findIndex(e => e.path === error.path) === i,
    );

    if (errors.length > 0) {
      errors.forEach(({ path, code }) =>
        form.setError(path as FormPath, { type: code }),
      );
      // Focus the first invalid field on screen, not the first in engine order.
      const invalid = new Set(errors.map(e => e.path));
      const fields =
        formRef.current?.querySelectorAll<HTMLInputElement>('input[name]');
      const first = [...(fields ?? [])].find(field => invalid.has(field.name));
      form.setFocus((first?.name ?? errors[0].path) as FormPath);
      return;
    }

    const source = manualRates
      ? 'manual'
      : exchangeRates.status === 'live' || exchangeRates.status === 'cached'
        ? exchangeRates.status
        : 'manual';
    const lastUpdate =
      source !== 'manual' && 'lastUpdate' in exchangeRates
        ? exchangeRates.lastUpdate
        : undefined;
    const encoded = encodeCalculation({
      v: 1,
      input,
      rates: lastUpdate ? { source, lastUpdate } : { source },
    });
    void navigate(`/result?c=${encoded}`);
  };

  const clearForm = () => {
    form.reset(emptyFormValues());
    clearDraft(mode);
    setManualRates(false);
    applyBankRates();
  };

  return (
    <FormProvider {...form}>
      <form
        ref={formRef}
        noValidate
        onSubmit={event => void form.handleSubmit(onSubmit)(event)}
        className="mx-auto flex max-w-3xl flex-col gap-4 pb-24"
      >
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={t('calculator.actions.clear_form')}
              >
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t('calculator.actions.clear_confirm_title')}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t('calculator.actions.clear_confirm_body')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={clearForm}>
                  {t('common.clear')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <DraftSaver mode={mode} manualRates={manualRates} />
        <RatesSection
          rates={exchangeRates}
          manual={manualRates}
          onManualChange={() => setManualRates(true)}
          onUseBankRate={() => setManualRates(false)}
          onRefresh={exchangeRates.refresh}
        />
        {mode === 'air-shipment' && <AirShipmentSection />}
        <CifSection mode={mode} />
        <DutiesSection />
        <ExpensesSection />

        <div className="sticky bottom-0 -mx-4 flex items-center justify-between gap-4 border-t bg-background/95 px-4 py-3 backdrop-blur">
          <CifPreview mode={mode} />
          <Button type="submit" size="lg">
            {t('common.calculate')}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
