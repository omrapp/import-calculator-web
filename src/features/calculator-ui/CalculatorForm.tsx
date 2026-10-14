import { Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { AnimatedNumber } from '@/components/motion';
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
import { Hero } from './hero';
import { AirShipmentSection } from './sections/AirShipmentSection';
import { CifSection } from './sections/CifSection';
import { DutiesSection } from './sections/DutiesSection';
import { ExpensesSection } from './sections/ExpensesSection';
import { RatesSection } from './sections/RatesSection';

type Mode = CalculationInput['mode'];

function ClearFormButton({ onConfirm }: { onConfirm: () => void }) {
  const { t } = useTranslation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground"
          aria-label={t('calculator.actions.clear_form')}
          title={t('calculator.actions.clear_form')}
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
          <AlertDialogAction onClick={onConfirm}>
            {t('common.clear')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function CifPreview({ mode }: { mode: Mode }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const values = useWatch<FormValues>() as FormValues;
  const cif = estimateCif(toCalculationInput(values, mode).input);
  const format = (value: number) => formatMoney(value, 'ILS', language);

  // Flash the figure when it changes, but not on first paint.
  const figureRef = useRef<HTMLSpanElement>(null);
  const initialCif = useRef(cif);
  useEffect(() => {
    const el = figureRef.current;
    if (!el || cif === initialCif.current) return;
    initialCif.current = Number.NaN;
    el.classList.remove('animate-highlight-flash');
    void el.offsetWidth; // restart the animation
    el.classList.add('animate-highlight-flash');
  }, [cif]);

  return (
    <div className="flex min-w-0 flex-col">
      <span className="text-xs text-muted-foreground">
        {t('calculator.labels.cif_preview')}
      </span>
      <span
        ref={figureRef}
        aria-hidden
        className="-mx-1.5 rounded-md px-1.5 text-xl font-bold tracking-tight tabular-nums sm:text-2xl"
        data-testid="cif-preview"
      >
        <AnimatedNumber value={cif} format={format} />
      </span>
      {/* The tween is visual only; screen readers get the settled value. */}
      <span className="sr-only" aria-live="polite">
        {format(cif)}
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
        className="mx-auto flex max-w-form flex-col gap-4 [counter-reset:calc-section]"
      >
        <Hero
          mode={mode}
          title={title}
          ratesLive={bankRates !== null}
          action={<ClearFormButton onConfirm={clearForm} />}
        />

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

        <div className="sticky bottom-0 z-20 -mx-4 mt-2 sm:mx-0 sm:mb-2">
          <div className="flex items-center justify-between gap-4 border-t bg-surface-glass px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-md backdrop-blur-md sm:rounded-2xl sm:border sm:px-5 sm:pb-3">
            <CifPreview mode={mode} />
            <Button type="submit" size="lg" className="shrink-0 px-6">
              {t('common.calculate')}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
