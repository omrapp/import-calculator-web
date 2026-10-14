import type {
  CalculationInput,
  Currency,
  ExpenseAmount,
  Money,
} from '@/features/calc-engine';

import { evaluateExpression } from './expression';

export type ExpenseUnit = Currency | 'percent';

type AmountField = { amount: string; currency: Currency };
type ExpenseField = { amount: string; unit: ExpenseUnit };

export type CartonValues = {
  length: string;
  width: string;
  height: string;
  weight: string;
  quantity: string;
};

/**
 * What the form holds: strings as typed (plain numbers or expressions).
 * Paths mirror CalculationInput so engine validation errors map onto fields.
 */
export type FormValues = {
  rates: { USD: string; EUR: string };
  cif: {
    cost: AmountField;
    freight: AmountField;
    insurance: AmountField;
    premiumPercent: string;
  };
  airShipment: {
    cartons: CartonValues[];
    divisor: string;
    ratePerKg: string;
    fuelSurchargePerKg: string;
    handlingFee: string;
  };
  duty: {
    kind: 'percent' | 'higher' | 'lower';
    percent: string;
    optionI: string;
    optionII: string;
  };
  tamaPercent: string;
  purchaseTaxPercent: string;
  vatPercent: string;
  expenses: {
    localTransport: ExpenseField;
    customsBroker: ExpenseField;
    bank: ExpenseField;
    other: ExpenseField;
    custom: ({ id: string; name: string } & ExpenseField)[];
  };
};

export const FIXED_EXPENSES = [
  'localTransport',
  'customsBroker',
  'bank',
  'other',
] as const;

export const emptyCarton = (): CartonValues => ({
  length: '',
  width: '',
  height: '',
  weight: '',
  quantity: '1',
});

export function emptyFormValues(): FormValues {
  const usd = (): AmountField => ({ amount: '', currency: 'USD' });
  const ils = (): ExpenseField => ({ amount: '', unit: 'ILS' });
  return {
    rates: { USD: '', EUR: '' },
    cif: { cost: usd(), freight: usd(), insurance: usd(), premiumPercent: '' },
    airShipment: {
      cartons: [emptyCarton()],
      divisor: '6000',
      ratePerKg: '',
      fuelSurchargePerKg: '',
      handlingFee: '',
    },
    duty: { kind: 'percent', percent: '', optionI: '', optionII: '' },
    tamaPercent: '',
    purchaseTaxPercent: '',
    vatPercent: '',
    expenses: {
      localTransport: ils(),
      customsBroker: ils(),
      bank: ils(),
      other: ils(),
      custom: [],
    },
  };
}

export type ToInputResult = {
  input: CalculationInput;
  /** Form paths whose text is not a number or valid expression. */
  invalidExpressions: string[];
};

export function toCalculationInput(
  values: FormValues,
  mode: CalculationInput['mode'],
): ToInputResult {
  const invalidExpressions: string[] = [];
  /** Empty → `empty`; invalid → NaN and recorded. */
  const num = (path: string, text: string, empty = 0): number => {
    const value = evaluateExpression(text);
    if (value === null) return empty;
    if (Number.isNaN(value)) invalidExpressions.push(path);
    return value;
  };
  const money = (path: string, field: AmountField): Money => ({
    amount: num(`${path}.amount`, field.amount),
    currency: field.currency,
  });
  const expense = (path: string, field: ExpenseField): ExpenseAmount => {
    const value = num(`${path}.amount`, field.amount);
    return field.unit === 'percent'
      ? { percent: value }
      : { amount: value, currency: field.unit };
  };

  const { cif, duty, expenses } = values;
  const air = values.airShipment;

  const input: CalculationInput = {
    mode,
    rates: {
      USD: num('rates.USD', values.rates.USD, Number.NaN),
      EUR: num('rates.EUR', values.rates.EUR, Number.NaN),
    },
    cif: {
      cost: money('cif.cost', cif.cost),
      freight:
        mode === 'standard'
          ? money('cif.freight', cif.freight)
          : { amount: 0, currency: 'USD' },
      insurance:
        cif.insurance.amount.trim() === ''
          ? null
          : money('cif.insurance', cif.insurance),
      premiumPercent: num('cif.premiumPercent', cif.premiumPercent),
    },
    ...(mode === 'air-shipment'
      ? {
          airShipment: {
            cartons: air.cartons.map((carton, i) => {
              const path = `airShipment.cartons.${i}`;
              return {
                length: num(`${path}.length`, carton.length),
                width: num(`${path}.width`, carton.width),
                height: num(`${path}.height`, carton.height),
                weight: num(`${path}.weight`, carton.weight),
                quantity: num(`${path}.quantity`, carton.quantity),
              };
            }),
            divisor: num('airShipment.divisor', air.divisor),
            ratePerKg: num('airShipment.ratePerKg', air.ratePerKg),
            fuelSurchargePerKg: num(
              'airShipment.fuelSurchargePerKg',
              air.fuelSurchargePerKg,
            ),
            handlingFee: num('airShipment.handlingFee', air.handlingFee),
          },
        }
      : {}),
    duty:
      duty.kind === 'percent'
        ? { kind: 'percent', percent: num('duty.percent', duty.percent) }
        : {
            kind: 'compound',
            rule: duty.kind,
            optionI: num('duty.optionI', duty.optionI),
            optionII: num('duty.optionII', duty.optionII),
          },
    tamaPercent: num('tamaPercent', values.tamaPercent),
    purchaseTaxPercent: num('purchaseTaxPercent', values.purchaseTaxPercent),
    vatPercent:
      values.vatPercent.trim() === ''
        ? null
        : num('vatPercent', values.vatPercent),
    expenses: {
      localTransport: expense(
        'expenses.localTransport',
        expenses.localTransport,
      ),
      customsBroker: expense('expenses.customsBroker', expenses.customsBroker),
      bank: expense('expenses.bank', expenses.bank),
      other: expense('expenses.other', expenses.other),
      custom: expenses.custom.map((item, i) => ({
        id: item.id,
        name: item.name,
        amount: expense(`expenses.custom.${i}`, item),
      })),
    },
  };

  return { input, invalidExpressions };
}

const text = (value: number) => (value === 0 ? '' : String(value));

/** Inverse of toCalculationInput, for reopening a Calculation in the form. */
export function toFormValues(input: CalculationInput): FormValues {
  const empty = emptyFormValues();
  const amount = (m: Money): AmountField => ({
    amount: text(m.amount),
    currency: m.currency,
  });
  const expense = (e: ExpenseAmount): ExpenseField =>
    'percent' in e
      ? { amount: text(e.percent), unit: 'percent' }
      : { amount: text(e.amount), unit: e.currency };
  const air = input.airShipment;
  return {
    rates: { USD: String(input.rates.USD), EUR: String(input.rates.EUR) },
    cif: {
      cost: amount(input.cif.cost),
      freight: amount(input.cif.freight),
      insurance: input.cif.insurance
        ? {
            amount: String(input.cif.insurance.amount),
            currency: input.cif.insurance.currency,
          }
        : empty.cif.insurance,
      premiumPercent: text(input.cif.premiumPercent),
    },
    airShipment: air
      ? {
          cartons: air.cartons.map(c => ({
            length: text(c.length),
            width: text(c.width),
            height: text(c.height),
            weight: text(c.weight),
            quantity: String(c.quantity),
          })),
          divisor: String(air.divisor),
          ratePerKg: text(air.ratePerKg),
          fuelSurchargePerKg: text(air.fuelSurchargePerKg),
          handlingFee: text(air.handlingFee),
        }
      : empty.airShipment,
    duty:
      input.duty.kind === 'percent'
        ? { ...empty.duty, percent: text(input.duty.percent) }
        : {
            kind: input.duty.rule,
            percent: '',
            optionI: text(input.duty.optionI),
            optionII: text(input.duty.optionII),
          },
    tamaPercent: text(input.tamaPercent),
    purchaseTaxPercent: text(input.purchaseTaxPercent),
    vatPercent: input.vatPercent === null ? '' : String(input.vatPercent),
    expenses: {
      localTransport: expense(input.expenses.localTransport),
      customsBroker: expense(input.expenses.customsBroker),
      bank: expense(input.expenses.bank),
      other: expense(input.expenses.other),
      custom: input.expenses.custom.map(item => ({
        id: item.id,
        name: item.name,
        ...expense(item.amount),
      })),
    },
  };
}

/** Maps an engine validation field path onto the form field that shows it. */
export function formPathFor(enginePath: string): string {
  return enginePath
    .replace(/^(expenses\.custom\.\d+)\.amount\.(amount|percent)$/, '$1.amount')
    .replace(/^(expenses\.\w+)\.percent$/, '$1.amount');
}
