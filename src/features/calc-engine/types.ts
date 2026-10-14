export type Currency = 'USD' | 'EUR' | 'ILS';

export type Money = { amount: number; currency: Currency };

/** An Expense given as a money amount or as a percent of the running total. */
export type ExpenseAmount = Money | { percent: number };

export type Carton = {
  length: number;
  width: number;
  height: number;
  weight: number;
  quantity: number;
};

/** Air Shipment carrier pricing; all amounts in USD. */
export type AirShipmentInput = {
  cartons: Carton[];
  divisor: number;
  ratePerKg: number;
  fuelSurchargePerKg: number;
  handlingFee: number;
};

export type DutyInput =
  | { kind: 'percent'; percent: number }
  | {
      kind: 'compound';
      rule: 'higher' | 'lower';
      /** Duty Option amounts in ₪. */
      optionI: number;
      optionII: number;
    };

export type CustomExpense = { id: string; name: string; amount: ExpenseAmount };

export type CalculationInput = {
  mode: 'standard' | 'air-shipment';
  /** ₪ per unit of foreign currency; must be > 0. */
  rates: { USD: number; EUR: number };
  cif: {
    cost: Money;
    /** Ignored in air-shipment mode; Freight is derived from the Cartons. */
    freight: Money;
    /** null → derived from the Premium. */
    insurance: Money | null;
    premiumPercent: number;
  };
  airShipment?: AirShipmentInput;
  duty: DutyInput;
  tamaPercent: number;
  purchaseTaxPercent: number;
  /** null → default VAT (18%). */
  vatPercent: number | null;
  expenses: {
    localTransport: ExpenseAmount;
    customsBroker: ExpenseAmount;
    bank: ExpenseAmount;
    other: ExpenseAmount;
    custom: CustomExpense[];
  };
};

export type StepUnit = 'ILS' | 'USD' | 'EUR' | 'kg' | 'factor';

export type StepValue = { amount: number; unit: StepUnit };

/** i18n key (+ params), or literal text for user-named Custom Expenses. */
export type StepLabel =
  { key: string; params?: Record<string, string | number> } | { text: string };

export type FormulaToken =
  | StepValue
  | { percent: number }
  | { op: '+' | '×' | '÷' | 'max' }
  | { group: FormulaToken[] };

export type Step =
  | { kind: 'header'; label: StepLabel }
  | {
      kind: 'row' | 'subtotal' | 'total';
      label: StepLabel;
      value: StepValue;
      formula?: FormulaToken[];
    }
  | { kind: 'divider' };

export type CalculationTotals = {
  cif: number;
  customsDuty: number;
  tama: number;
  purchaseTax: number;
  expenses: number;
  landedCost: number;
  vat: number;
  totalIncludingVat: number;
  importFactor: number | null;
  shekelPerUnitFactor: number | null;
  chargeableWeight?: number;
  airFreightUsd?: number;
};

export type CalculationResult = {
  steps: Step[];
  totals: CalculationTotals;
};

export type ValidationErrorCode =
  'required' | 'positive' | 'non-negative' | 'duty-options-required';

export type ValidationError = { field: string; code: ValidationErrorCode };
