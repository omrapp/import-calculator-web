/**
 * Generates calc-engine golden fixtures by running the RN app's own
 * ResultViewModel on a set of inputs. Re-run by hand only:
 *
 *   RN_APP_PATH=/path/to/TradeCalculator npx tsx scripts/generate-golden.ts
 *
 * Air Shipment fixtures feed the RN view model's rounded air Freight into CIF
 * (deviation 3 in SPEC-calc-engine.md); fixtures avoid deviations 1, 2 and 4.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import type {
  CalculationInput,
  CalculationTotals,
  ExpenseAmount,
  Money,
} from '../src/features/calc-engine/types';

const RN_APP_PATH =
  process.env.RN_APP_PATH ??
  '/Users/omarayed/Documents/Projects/react-native/InternationalTradeCalculator/TradeCalculator';
const OUT = join(
  import.meta.dirname,
  '../src/features/calc-engine/__fixtures__/rn-golden.json',
);

type RnStep = { label: string; value?: string };
type RnViewModel = {
  total: number;
  totalWithVAT: number;
  calculateResult(data: unknown, t: (key: string) => string): RnStep[];
};

const { default: ResultViewModel } = (await import(
  pathToFileURL(join(RN_APP_PATH, 'src/viewmodel/ResultViewModel.tsx')).href
)) as { default: new () => RnViewModel };

const SYMBOL = { USD: '$', EUR: '€', ILS: '₪' } as const;

const rnValue = (money: Money) => ({
  value: money.amount,
  currency: SYMBOL[money.currency],
});
const rnExpense = (amount: ExpenseAmount) =>
  'percent' in amount
    ? { value: amount.percent, currency: '%' }
    : rnValue(amount);

function toRn(input: CalculationInput, airFreightUsd?: number) {
  const { cif, duty, expenses } = input;
  return {
    currency: {
      dollar: input.rates.USD,
      euro: input.rates.EUR,
      premium: cif.premiumPercent,
    },
    cif: {
      cost: rnValue(cif.cost),
      freight:
        airFreightUsd === undefined
          ? rnValue(cif.freight)
          : { value: airFreightUsd, currency: '$' },
      insurance: cif.insurance
        ? rnValue(cif.insurance)
        : { value: 0, currency: '$' },
    },
    taxes: {
      taxPercent: duty.kind === 'percent' ? duty.percent : 0,
      customTaxPercent: input.purchaseTaxPercent,
      vatPercent: input.vatPercent,
      tamaType:
        duty.kind === 'percent'
          ? 'None'
          : duty.rule === 'higher'
            ? 'ALF'
            : 'ALE',
      tamaData: {
        tamaI: duty.kind === 'compound' ? duty.optionI : 0,
        tamaII: duty.kind === 'compound' ? duty.optionII : 0,
        tamaPercent: input.tamaPercent,
      },
    },
    expenses: {
      localTransportation: rnExpense(expenses.localTransport),
      employee: rnExpense(expenses.customsBroker),
      bank: rnExpense(expenses.bank),
      other: rnExpense(expenses.other),
      customExpenses: expenses.custom.map(item => ({
        id: item.id,
        name: item.name,
        ...rnExpense(item.amount),
      })),
    },
    ...(input.mode === 'air-shipment' && input.airShipment
      ? {
          airFreight: {
            cartons: input.airShipment.cartons,
            freightRate: input.airShipment.ratePerKg,
            fuelSurcharge: input.airShipment.fuelSurchargePerKg,
            handlingFee: input.airShipment.handlingFee,
            divisor: input.airShipment.divisor,
          },
        }
      : {}),
  };
}

const parse = (value: string | undefined) =>
  value === undefined ? undefined : Number(value.replace(/[^0-9.-]/g, ''));

function runRn(input: CalculationInput): CalculationTotals {
  const run = (airFreightUsd?: number) => {
    const vm = new ResultViewModel();
    const steps = vm.calculateResult(toRn(input, airFreightUsd), key => key);
    const find = (label: string) =>
      parse(steps.find(step => step.label === label)?.value);
    return { vm, find };
  };

  let { vm, find } = run();
  let airFreightUsd: number | undefined;
  if (input.mode === 'air-shipment') {
    airFreightUsd = find('result.steps.total_air_freight');
    ({ vm, find } = run(airFreightUsd));
  }

  const customsDuty =
    find('result.steps.tax') ??
    find('result.steps.tax_check_higher') ??
    find('result.steps.tax_check_lower') ??
    0;

  return {
    cif: find('result.steps.cif_total')!,
    customsDuty,
    tama: find('result.steps.tama') ?? 0,
    purchaseTax: find('result.steps.purchase_tax') ?? 0,
    expenses: find('result.steps.total_expenses') ?? 0,
    landedCost: Math.round((vm.total + Number.EPSILON) * 100) / 100,
    vat: find('result.steps.vat')!,
    totalIncludingVat: vm.totalWithVAT,
    importFactor: find('result.steps.pivot_vs_shekel') ?? null,
    shekelPerUnitFactor: find('result.steps.pivot_vs_foreign') ?? null,
    ...(airFreightUsd === undefined
      ? {}
      : {
          chargeableWeight: find('result.steps.chargeable_weight')!,
          airFreightUsd,
        }),
  };
}

// ---------------------------------------------------------------------------
// Fixture inputs
// ---------------------------------------------------------------------------

const ils = (amount: number): Money => ({ amount, currency: 'ILS' });
const usd = (amount: number): Money => ({ amount, currency: 'USD' });
const eur = (amount: number): Money => ({ amount, currency: 'EUR' });

const base: CalculationInput = {
  mode: 'standard',
  rates: { USD: 3.074, EUR: 3.4393 },
  cif: {
    cost: usd(10000),
    freight: usd(1200),
    insurance: null,
    premiumPercent: 0.35,
  },
  duty: { kind: 'percent', percent: 12 },
  tamaPercent: 0,
  purchaseTaxPercent: 0,
  vatPercent: 18,
  expenses: {
    localTransport: ils(0),
    customsBroker: ils(0),
    bank: ils(0),
    other: ils(0),
    custom: [],
  },
};

const variant = (
  name: string,
  patch: (input: CalculationInput) => Partial<CalculationInput>,
) => ({ name, input: { ...base, ...patch(base) } });

const fixtures = [
  variant('usd cost, derived insurance', () => ({})),
  variant('eur cost and freight', b => ({
    cif: { ...b.cif, cost: eur(25000), freight: eur(1850.5) },
  })),
  variant('ils cost, usd freight', b => ({
    cif: { ...b.cif, cost: ils(48000), freight: usd(640) },
  })),
  variant('entered insurance usd', b => ({
    cif: { ...b.cif, insurance: usd(85) },
  })),
  variant('entered insurance eur', b => ({
    cif: { ...b.cif, insurance: eur(120.75) },
  })),
  variant('entered insurance ils', b => ({
    cif: { ...b.cif, insurance: ils(410) },
  })),
  variant('zero duty, vat 17', () => ({
    duty: { kind: 'percent', percent: 0 },
    vatPercent: 17,
  })),
  variant('compound higher', () => ({
    duty: { kind: 'compound', rule: 'higher', optionI: 3500, optionII: 4120.4 },
  })),
  variant('compound lower', () => ({
    duty: { kind: 'compound', rule: 'lower', optionI: 3500, optionII: 4120.4 },
  })),
  variant('tama without purchase tax', () => ({ tamaPercent: 14 })),
  variant('purchase tax without tama', () => ({ purchaseTaxPercent: 35 })),
  variant('tama and purchase tax', () => ({
    tamaPercent: 21,
    purchaseTaxPercent: 15,
  })),
  variant('compound + tama + purchase tax', () => ({
    duty: { kind: 'compound', rule: 'higher', optionI: 980, optionII: 1210 },
    tamaPercent: 8,
    purchaseTaxPercent: 25,
  })),
  variant('fixed expenses mixed currencies', b => ({
    expenses: {
      ...b.expenses,
      localTransport: ils(1350),
      customsBroker: usd(220),
      bank: eur(35),
      other: ils(99.9),
    },
  })),
  variant('percent expenses on running total', b => ({
    expenses: {
      ...b.expenses,
      localTransport: ils(900),
      customsBroker: { percent: 0.5 },
      bank: { percent: 0.25 },
    },
  })),
  variant('custom expenses', b => ({
    expenses: {
      ...b.expenses,
      customsBroker: ils(750),
      custom: [
        { id: 'a', name: 'Port storage', amount: ils(430) },
        { id: 'b', name: 'Lab test', amount: usd(180) },
        { id: 'c', name: 'Agent margin', amount: { percent: 1.5 } },
      ],
    },
  })),
  variant('everything combined', b => ({
    rates: { USD: 3.65, EUR: 3.97 },
    cif: {
      cost: eur(18450.25),
      freight: usd(2310),
      insurance: null,
      premiumPercent: 0.5,
    },
    duty: { kind: 'percent', percent: 8 },
    tamaPercent: 12,
    purchaseTaxPercent: 20,
    expenses: {
      ...b.expenses,
      localTransport: ils(1800),
      customsBroker: usd(260),
      bank: { percent: 0.3 },
      custom: [{ id: 'x', name: 'Forklift', amount: ils(350) }],
    },
  })),
  variant('air: single carton, actual wins', () => ({
    mode: 'air-shipment',
    airShipment: {
      cartons: [{ length: 40, width: 30, height: 20, weight: 18, quantity: 3 }],
      divisor: 6000,
      ratePerKg: 3.2,
      fuelSurchargePerKg: 0.85,
      handlingFee: 45,
    },
  })),
  variant('air: multi carton, volumetric wins', () => ({
    mode: 'air-shipment',
    airShipment: {
      cartons: [
        { length: 60, width: 50, height: 45, weight: 9.5, quantity: 4 },
        { length: 35, width: 35, height: 35, weight: 4.2, quantity: 2 },
      ],
      divisor: 6000,
      ratePerKg: 2.75,
      fuelSurchargePerKg: 1.1,
      handlingFee: 60,
    },
  })),
  variant('air: divisor 5000 with taxes and expenses', b => ({
    mode: 'air-shipment',
    cif: { ...b.cif, cost: eur(7400) },
    airShipment: {
      cartons: [
        { length: 55, width: 42, height: 38, weight: 12.3, quantity: 5 },
      ],
      divisor: 5000,
      ratePerKg: 4.1,
      fuelSurchargePerKg: 0.6,
      handlingFee: 30,
    },
    tamaPercent: 10,
    purchaseTaxPercent: 12,
    expenses: { ...b.expenses, customsBroker: ils(600) },
  })),
];

const golden = fixtures.map(({ name, input }) => ({
  name,
  input,
  expected: runRn(input),
}));

writeFileSync(OUT, JSON.stringify(golden, null, 2) + '\n');
console.log(`Wrote ${golden.length} fixtures to ${OUT}`);
