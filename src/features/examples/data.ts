import {
  type CalculationInput,
  type CalculationLink,
  type ExpenseAmount,
  DEFAULT_VAT_PERCENT,
  estimateCif,
  round2,
} from '@/features/calc-engine';
import type { Tone } from '@/lib/tone';

/** Fixed teaching rates, so the examples never change with the market. */
export const EXAMPLE_RATES = { USD: 3.7, EUR: 4 } as const;

export type ExampleId =
  | 'sea_standard'
  | 'duty_free'
  | 'compound_duty'
  | 'purchase_tax'
  | 'vat_free'
  | 'euro_premium'
  | 'percent_expenses'
  | 'air_volumetric'
  | 'air_actual';

export type Example = {
  id: ExampleId;
  scene: 'sea' | 'air';
  tone: Tone;
  /** The example this one changes one thing from. */
  base?: ExampleId;
  /** A slide from /public/guides that explains the topic. */
  image?: string;
  input: CalculationInput;
  /** Numbers the explanation text quotes, as ₪/$ values or plain counts. */
  params?: Record<string, { amount: number; unit: 'ILS' | 'USD' | 'count' }>;
};

const ils = (amount: number): ExpenseAmount => ({ amount, currency: 'ILS' });
const none = ils(0);

/** Example 1: the base case every variant changes one thing from. */
const seaStandard: CalculationInput = {
  mode: 'standard',
  rates: { ...EXAMPLE_RATES },
  cif: {
    cost: { amount: 10_000, currency: 'USD' },
    freight: { amount: 1_200, currency: 'USD' },
    insurance: { amount: 100, currency: 'USD' },
    premiumPercent: 0,
  },
  duty: { kind: 'percent', percent: 12 },
  tamaPercent: 0,
  purchaseTaxPercent: 0,
  vatPercent: null,
  expenses: {
    localTransport: ils(900),
    customsBroker: ils(1_500),
    bank: none,
    other: none,
    custom: [],
  },
};

const baseCif = estimateCif(seaStandard);
const PAIRS = 2_000;
const PER_PAIR = 3.5;
const optionI = round2(baseCif * 0.12);
const optionII = round2(PAIRS * PER_PAIR);

const airCarrier = { divisor: 6_000, ratePerKg: 4.2, fuelSurchargePerKg: 0.9 };

export const EXAMPLES: Example[] = [
  {
    id: 'sea_standard',
    scene: 'sea',
    tone: 'cif',
    image: '/guides/7-cif',
    input: seaStandard,
  },
  {
    id: 'duty_free',
    scene: 'sea',
    tone: 'duty',
    base: 'sea_standard',
    image: '/guides/eur1',
    input: { ...seaStandard, duty: { kind: 'percent', percent: 0 } },
  },
  {
    id: 'compound_duty',
    scene: 'sea',
    tone: 'duty',
    base: 'sea_standard',
    input: {
      ...seaStandard,
      duty: { kind: 'compound', rule: 'higher', optionI, optionII },
    },
    params: {
      cif: { amount: baseCif, unit: 'ILS' },
      optionI: { amount: optionI, unit: 'ILS' },
      optionII: { amount: optionII, unit: 'ILS' },
      pairs: { amount: PAIRS, unit: 'count' },
      perPair: { amount: PER_PAIR, unit: 'ILS' },
    },
  },
  {
    id: 'purchase_tax',
    scene: 'sea',
    tone: 'ptax',
    base: 'sea_standard',
    image: '/guides/13-taxes',
    input: { ...seaStandard, tamaPercent: 10, purchaseTaxPercent: 15 },
  },
  {
    id: 'vat_free',
    scene: 'sea',
    tone: 'vat',
    base: 'sea_standard',
    input: { ...seaStandard, vatPercent: 0 },
  },
  {
    id: 'euro_premium',
    scene: 'sea',
    tone: 'rates',
    base: 'sea_standard',
    image: '/guides/9-insurance',
    input: {
      ...seaStandard,
      cif: {
        cost: { amount: 8_000, currency: 'EUR' },
        freight: { amount: 700, currency: 'EUR' },
        insurance: null,
        premiumPercent: 0.5,
      },
      duty: { kind: 'percent', percent: 8 },
    },
  },
  {
    id: 'percent_expenses',
    scene: 'sea',
    tone: 'expenses',
    base: 'sea_standard',
    image: '/guides/10-payment',
    input: {
      ...seaStandard,
      expenses: {
        localTransport: ils(900),
        customsBroker: { percent: 1.5 },
        bank: { percent: 0.5 },
        other: none,
        // `name` is an i18n key; localizeExample() swaps in the text.
        custom: [
          {
            id: 'storage',
            name: 'examples.items.percent_expenses.custom_name',
            amount: ils(450),
          },
        ],
      },
    },
  },
  {
    id: 'air_volumetric',
    scene: 'air',
    tone: 'air',
    image: '/guides/14-calculation',
    input: {
      ...seaStandard,
      mode: 'air-shipment',
      cif: {
        cost: { amount: 6_000, currency: 'USD' },
        freight: { amount: 0, currency: 'USD' },
        insurance: { amount: 40, currency: 'USD' },
        premiumPercent: 0,
      },
      airShipment: {
        ...airCarrier,
        handlingFee: 75,
        cartons: [
          { length: 60, width: 40, height: 40, weight: 12, quantity: 10 },
          { length: 50, width: 50, height: 30, weight: 18, quantity: 4 },
        ],
      },
      expenses: { ...seaStandard.expenses, localTransport: ils(600) },
    },
  },
  {
    id: 'air_actual',
    scene: 'air',
    tone: 'air',
    base: 'air_volumetric',
    input: {
      ...seaStandard,
      mode: 'air-shipment',
      cif: {
        cost: { amount: 4_000, currency: 'USD' },
        freight: { amount: 0, currency: 'USD' },
        insurance: { amount: 30, currency: 'USD' },
        premiumPercent: 0,
      },
      airShipment: {
        ...airCarrier,
        handlingFee: 75,
        cartons: [
          { length: 40, width: 30, height: 30, weight: 25, quantity: 20 },
        ],
      },
      duty: { kind: 'percent', percent: 6 },
      expenses: { ...seaStandard.expenses, localTransport: ils(600) },
    },
  },
];

export const exampleById = (id: ExampleId) =>
  EXAMPLES.find(example => example.id === id)!;

/** The example's inputs with Custom Expense names in the reader's language. */
export function localizeExample(
  example: Example,
  t: (key: string) => string,
): CalculationInput {
  const { input } = example;
  return {
    ...input,
    expenses: {
      ...input.expenses,
      custom: input.expenses.custom.map(item => ({
        ...item,
        name: t(item.name),
      })),
    },
  };
}

/** A Calculation link for the Result page and the calculator form. */
export const exampleLink = (
  input: CalculationInput,
  title: string,
): CalculationLink => ({
  v: 1,
  input,
  // Manual, so the calculator keeps the teaching rates instead of today's.
  rates: { source: 'manual' },
  meta: { title },
});

/** Scenario tags shown on each example, read from its inputs. */
export type ExampleTag =
  | { kind: 'shipping'; value: 'sea' | 'air' }
  | { kind: 'duty'; value: 'percent' | 'none' | 'compound'; percent?: number }
  | { kind: 'purchase_tax'; value: 'yes' | 'no' }
  | { kind: 'vat'; percent: number }
  | { kind: 'currency'; value: 'USD' | 'EUR' | 'ILS' }
  | { kind: 'expenses'; value: 'fixed' | 'percent' };

export function exampleTags(input: CalculationInput): ExampleTag[] {
  const { duty, expenses } = input;
  const expenseAmounts = [
    expenses.localTransport,
    expenses.customsBroker,
    expenses.bank,
    expenses.other,
    ...expenses.custom.map(item => item.amount),
  ];
  return [
    { kind: 'shipping', value: input.mode === 'standard' ? 'sea' : 'air' },
    duty.kind === 'compound'
      ? { kind: 'duty', value: 'compound' }
      : duty.percent > 0
        ? { kind: 'duty', value: 'percent', percent: duty.percent }
        : { kind: 'duty', value: 'none' },
    {
      kind: 'purchase_tax',
      value: input.purchaseTaxPercent > 0 ? 'yes' : 'no',
    },
    { kind: 'vat', percent: input.vatPercent ?? DEFAULT_VAT_PERCENT },
    { kind: 'currency', value: input.cif.cost.currency },
    {
      kind: 'expenses',
      value: expenseAmounts.some(amount => 'percent' in amount)
        ? 'percent'
        : 'fixed',
    },
  ];
}
