import { calculateAirFreight } from './air-shipment';
import { round2, round4 } from './rounding';
import type {
  CalculationInput,
  CalculationResult,
  ExpenseAmount,
  FormulaToken,
  Money,
  Step,
  StepLabel,
  StepValue,
} from './types';
import { validate } from './validate';

export const DEFAULT_VAT_PERCENT = 18;

const ils = (amount: number): StepValue => ({ amount, unit: 'ILS' });
const percent = (value: number): FormulaToken => ({ percent: value });
const plus: FormulaToken = { op: '+' };
const times: FormulaToken = { op: '×' };
const divide: FormulaToken = { op: '÷' };
const header = (key: string): Step => ({ kind: 'header', label: { key } });
const divider: Step = { kind: 'divider' };

function toShekel(
  money: Money,
  rates: CalculationInput['rates'],
): { value: number; formula?: FormulaToken[] } {
  if (money.currency === 'ILS') return { value: money.amount };
  const rate = rates[money.currency];
  return {
    value: money.amount * rate,
    formula: [
      { amount: money.amount, unit: money.currency },
      times,
      { amount: rate, unit: 'factor' },
    ],
  };
}

/** Thrown when calculate() is called with inputs that fail validate(). */
export class InvalidCalculationError extends Error {
  readonly errors;
  constructor(errors: ReturnType<typeof validate>) {
    super(`Invalid calculation input: ${errors.map(e => e.field).join(', ')}`);
    this.errors = errors;
  }
}

export function calculate(input: CalculationInput): CalculationResult {
  const errors = validate(input);
  if (errors.length > 0) throw new InvalidCalculationError(errors);

  const steps: Step[] = [];
  const row = (
    key: string | StepLabel,
    value: StepValue,
    formula?: FormulaToken[],
    kind: 'row' | 'subtotal' | 'total' = 'row',
  ) =>
    steps.push({
      kind,
      label: typeof key === 'string' ? { key } : key,
      value,
      ...(formula ? { formula } : {}),
    });

  // 1. Air Shipment: Freight derived from Cartons, rounded before entering CIF.
  let freight = input.cif.freight;
  let air: ReturnType<typeof calculateAirFreight> | undefined;
  if (input.mode === 'air-shipment' && input.airShipment) {
    air = calculateAirFreight(input.airShipment);
    steps.push(...air.steps);
    freight = { amount: air.freightUsd, currency: 'USD' };
  }

  // 2. CIF
  steps.push(header('result.steps.cif_calculation'));
  const cost = toShekel(input.cif.cost, input.rates);
  row('result.steps.cost', ils(cost.value), cost.formula);
  const freightIls = toShekel(freight, input.rates);
  row('result.steps.freight', ils(freightIls.value), freightIls.formula);

  let insuranceIls: number;
  if (input.cif.insurance) {
    const insurance = toShekel(input.cif.insurance, input.rates);
    insuranceIls = insurance.value;
    row('result.steps.insurance', ils(insuranceIls), insurance.formula);
  } else {
    insuranceIls = round2(
      (cost.value + freightIls.value) * 1.1 * (input.cif.premiumPercent / 100),
    );
    row('result.steps.insurance', ils(insuranceIls), [
      { group: [ils(cost.value), plus, ils(freightIls.value)] },
      times,
      { amount: 1.1, unit: 'factor' },
      times,
      percent(input.cif.premiumPercent),
    ]);
  }

  const cif = round2(cost.value + freightIls.value + insuranceIls);
  row(
    'result.steps.cif_total',
    ils(cif),
    [ils(cost.value), plus, ils(freightIls.value), plus, ils(insuranceIls)],
    'subtotal',
  );
  steps.push(divider);
  let total = cif;

  // 3. Customs Duty
  steps.push(header('result.steps.customs_duty_calculation'));
  let customsDuty: number;
  if (input.duty.kind === 'percent') {
    customsDuty = round2(cif * (input.duty.percent / 100));
    row('result.steps.customs_duty', ils(customsDuty), [
      ils(cif),
      times,
      percent(input.duty.percent),
    ]);
  } else {
    const { optionI, optionII, rule } = input.duty;
    row('result.steps.duty_option_i', ils(optionI));
    row('result.steps.duty_option_ii', ils(optionII));
    customsDuty = round2(
      rule === 'higher'
        ? Math.max(optionI, optionII)
        : Math.min(optionI, optionII),
    );
    row(
      rule === 'higher'
        ? 'result.steps.compound_rule_higher'
        : 'result.steps.compound_rule_lower',
      ils(customsDuty),
    );
  }
  total += customsDuty;
  row(
    'result.steps.total_cif_duty',
    ils(round2(total)),
    [ils(cif), plus, ils(customsDuty)],
    'subtotal',
  );

  // Tama is for the Purchase Tax base only, never part of Landed Cost.
  const tama =
    input.tamaPercent > 0 ? round2(total * (input.tamaPercent / 100)) : 0;
  if (tama > 0) {
    row('result.steps.tama', ils(tama), [
      ils(total),
      times,
      percent(input.tamaPercent),
    ]);
    row(
      'result.steps.purchase_tax_base',
      ils(round2(total + tama)),
      [ils(total), plus, ils(tama)],
      'subtotal',
    );
  }
  steps.push(divider);

  // 4. Purchase Tax
  let purchaseTax = 0;
  if (input.purchaseTaxPercent > 0) {
    steps.push(header('result.steps.purchase_tax_calculation'));
    const base = total + tama;
    purchaseTax = round2(base * (input.purchaseTaxPercent / 100));
    row('result.steps.purchase_tax', ils(purchaseTax), [
      ils(base),
      times,
      percent(input.purchaseTaxPercent),
    ]);
    row(
      'result.steps.total',
      ils(round2(total + purchaseTax)),
      [ils(total), plus, ils(purchaseTax)],
      'subtotal',
    );
    total += purchaseTax;
    steps.push(divider);
  }

  // 5. Expenses, in fixed order; a percent Expense applies to the running total.
  const { expenses } = input;
  const expenseItems: { label: StepLabel; amount: ExpenseAmount }[] = [
    {
      label: { key: 'result.steps.local_transport' },
      amount: expenses.localTransport,
    },
    {
      label: { key: 'result.steps.customs_broker' },
      amount: expenses.customsBroker,
    },
    { label: { key: 'result.steps.bank' }, amount: expenses.bank },
    { label: { key: 'result.steps.other' }, amount: expenses.other },
    ...expenses.custom.map(item => ({
      label: { text: item.name },
      amount: item.amount,
    })),
  ].filter(({ amount }) =>
    'percent' in amount ? amount.percent > 0 : amount.amount > 0,
  );

  let expensesTotal = 0;
  if (expenseItems.length > 0) {
    steps.push(header('result.steps.expenses'));
    for (const { label, amount } of expenseItems) {
      let value: number;
      let formula: FormulaToken[] | undefined;
      if ('percent' in amount) {
        value = round2(total * (amount.percent / 100));
        formula = [ils(total), times, percent(amount.percent)];
      } else {
        ({ value, formula } = toShekel(amount, input.rates));
      }
      row(label, ils(value), formula);
      expensesTotal += value;
      total += value;
    }
    row(
      'result.steps.total_expenses',
      ils(round2(expensesTotal)),
      undefined,
      'subtotal',
    );
    steps.push(divider);
  }

  // 6. VAT
  steps.push(header('result.steps.vat_calculation'));
  const vatPercent = input.vatPercent ?? DEFAULT_VAT_PERCENT;
  const vat = round2(total * (vatPercent / 100));
  row('result.steps.vat', ils(vat), [ils(total), times, percent(vatPercent)]);
  const totalIncludingVat = round2(total + vat);
  row(
    'result.steps.total_including_vat',
    ils(totalIncludingVat),
    [ils(total), plus, ils(vat)],
    'total',
  );
  steps.push(divider);

  // 7. Import Factor and Shekel-per-Unit Factor
  const landedCost = round2(total);
  let importFactor: number | null = null;
  let shekelPerUnitFactor: number | null = null;
  steps.push(header('result.steps.factors'));
  if (cost.value > 0) {
    importFactor = round4(landedCost / cost.value);
    row(
      'result.steps.import_factor',
      { amount: importFactor, unit: 'factor' },
      [ils(landedCost), divide, ils(cost.value)],
    );
    shekelPerUnitFactor = round4(landedCost / input.cif.cost.amount);
    row(
      'result.steps.shekel_per_unit_factor',
      { amount: shekelPerUnitFactor, unit: 'factor' },
      [
        ils(landedCost),
        divide,
        { amount: input.cif.cost.amount, unit: input.cif.cost.currency },
      ],
    );
  }
  steps.push(divider);

  return {
    steps,
    totals: {
      cif,
      customsDuty,
      tama,
      purchaseTax,
      expenses: round2(expensesTotal),
      landedCost,
      vat,
      totalIncludingVat,
      importFactor,
      shekelPerUnitFactor,
      ...(air
        ? {
            chargeableWeight: air.chargeableWeight,
            airFreightUsd: air.freightUsd,
          }
        : {}),
    },
  };
}

const NO_EXPENSE: ExpenseAmount = { amount: 0, currency: 'ILS' };

/**
 * CIF in ₪ for live preview while the form is being filled. Only CIF inputs
 * (and Air Shipment inputs) need to be valid; 0 otherwise.
 */
export function estimateCif(input: CalculationInput): number {
  try {
    return calculate({
      ...input,
      duty: { kind: 'percent', percent: 0 },
      tamaPercent: 0,
      purchaseTaxPercent: 0,
      vatPercent: 0,
      expenses: {
        localTransport: NO_EXPENSE,
        customsBroker: NO_EXPENSE,
        bank: NO_EXPENSE,
        other: NO_EXPENSE,
        custom: [],
      },
    }).totals.cif;
  } catch {
    return 0;
  }
}
