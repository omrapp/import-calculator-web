# Spec: calc-engine

Module of [CAPABILITY-MAP.md](./CAPABILITY-MAP.md). Shared rules: [SPEC.md](./SPEC.md). Depends on: nothing.

## Objective

A pure, UI-free TypeScript module that turns a Calculation's inputs into a structured, step-by-step result. It replaces the RN `ResultViewModel` (and the freight wiring in `flight.tsx`). Same numbers as the app for normal inputs, with four known quirks fixed on purpose.

Consumers: `calculator-ui` (live CIF preview, validation), `result` (step breakdown, totals), `history` (recalculate), `export`.

## Public API (`src/features/calc-engine/index.ts`)

```ts
type Currency = 'USD' | 'EUR' | 'ILS';
type Money = { amount: number; currency: Currency };
type ExpenseAmount = Money | { percent: number };      // percent of running total

type CalculationInput = {
  mode: 'standard' | 'air-shipment';
  rates: { USD: number; EUR: number };                 // ₪ per unit, must be > 0
  cif: { cost: Money; freight: Money; insurance: Money | null; premiumPercent: number };
  airShipment?: {                                      // required when mode = 'air-shipment'; amounts in USD
    cartons: { length: number; width: number; height: number; weight: number; quantity: number }[];
    divisor: number; ratePerKg: number; fuelSurchargePerKg: number; handlingFee: number;
  };
  duty:
    | { kind: 'percent'; percent: number }
    | { kind: 'compound'; rule: 'higher' | 'lower'; optionI: number; optionII: number }; // options in ₪
  tamaPercent: number;
  purchaseTaxPercent: number;
  vatPercent: number | null;                           // null → 18
  expenses: {
    localTransport: ExpenseAmount; customsBroker: ExpenseAmount; bank: ExpenseAmount; other: ExpenseAmount;
    custom: { id: string; name: string; amount: ExpenseAmount }[];
  };
};

type StepValue = { amount: number; unit: 'ILS' | 'USD' | 'EUR' | 'kg' | 'factor' };
type Step =
  | { kind: 'header'; label: StepLabel }
  | { kind: 'row' | 'subtotal' | 'total'; label: StepLabel; value: StepValue; formula?: FormulaToken[] }
  | { kind: 'divider' };
type StepLabel = { key: string; params?: Record<string, string | number> } | { text: string }; // text = Custom Expense name
type FormulaToken = StepValue | { percent: number } | { op: '+' | '×' | '÷' | 'max' } | { group: FormulaToken[] };

type CalculationResult = {
  steps: Step[];
  totals: {
    cif: number; customsDuty: number; tama: number; purchaseTax: number; expenses: number;
    landedCost: number; vat: number; totalIncludingVat: number;
    importFactor: number | null; shekelPerUnitFactor: number | null;
    chargeableWeight?: number; airFreightUsd?: number;
  };
};

validate(input: CalculationInput): ValidationError[];   // [] when valid
calculate(input: CalculationInput): CalculationResult;  // throws if validate() is non-empty
estimateCif(input: CalculationInput): number;           // live preview; 0 when inputs incomplete
```

`ValidationError = { field: string; code: 'required' | 'positive' | 'non-negative' | 'duty-options-required' }`, where `field` is a dot path (e.g. `rates.USD`, `duty.optionII`).

The engine never formats strings or translates: labels are i18n keys, numbers are raw. Formatting is the UI's job.

## Calculation order (parity with RN)

1. Air Shipment only: per Carton volumetric weight = L×W×H ÷ Divisor × quantity, actual = weight × quantity (each rounded to 2 dp); Chargeable Weight = max(totals); Freight (USD) = round2(CW × rate) + round2(CW × fuel) + handling, and this rounded value becomes `cif.freight`.
2. CIF: Cost, Freight, Insurance converted to ₪; Insurance when not entered = round2((C + F) × 1.1 × Premium%); CIF = round2(C + F + I).
3. Customs Duty: `percent` → round2(CIF × %); `compound` → Duty Option I/II per rule (higher/lower).
4. Tama (if > 0) = round2((CIF + Customs Duty) × Tama%); shown, never added to Landed Cost.
5. Purchase Tax (if > 0) = round2((CIF + Duty + Tama) × %).
6. Expenses in fixed order (local transport, customs broker, bank, other, then custom in list order); a percent Expense = round2(running total × %).
7. VAT = round2(Landed Cost × VAT%); Total Including VAT = round2(Landed Cost + VAT).
8. Import Factor = round4(Landed Cost ÷ Cost in ₪); Shekel-per-Unit Factor = round4(Landed Cost ÷ Cost amount). Both null when Cost is 0.

Rounding: `round2(x) = Math.round((x + Number.EPSILON) * 100) / 100`, `round4` likewise — copied from RN `NumberUtils`.

## Deliberate deviations from RN

| # | RN behaviour | Web behaviour |
|---|---|---|
| 1 | VAT 0 silently becomes 18% | 0 means 0%; `null` means 18% |
| 2 | Compound rule with one Duty Option missing → Customs Duty 0 | `duty-options-required` validation error |
| 3 | Freight fed into CIF unrounded (from `useAirFreightCalculation`) while steps show rounded values | Rounded value used in both |
| 4 | Exchange rate ≤ 0 falls back to $3.5 / €4.0 | `positive` validation error on `rates.*` |

## Golden tests

`scripts/generate-golden.ts` imports the RN source directly (path from `RN_APP_PATH`, default the local RN repo), runs ~20 fixture inputs through `ResultViewModel.calculateResult` (with the `flight.tsx` freight wiring for Air Shipment), and writes `src/features/calc-engine/__fixtures__/rn-golden.json` (input + RN totals parsed from its steps). The fixture JSON is committed; the generator is re-run only by hand. Fixtures avoid the four deviation cases; each deviation has its own explicit test instead.

Fixture coverage: each currency for Cost/Freight/Insurance, derived vs entered Insurance, percent duty, compound higher/lower, Tama on/off, Purchase Tax on/off, every Expense type incl. percent and custom, multi-Carton Air Shipment where volumetric wins and where actual wins.

## Files

```
src/features/calc-engine/
  index.ts  types.ts  calculate.ts  validate.ts  rounding.ts  air-shipment.ts
  calculate.test.ts  validate.test.ts  air-shipment.test.ts  golden.test.ts
  __fixtures__/rn-golden.json
scripts/generate-golden.ts
```

New dev dependency: `tsx` (run the generator). No runtime dependencies.

## Success Criteria

- [x] `golden.test.ts`: every fixture's totals (CIF, duty, purchase tax, expenses, Landed Cost, VAT, Total Including VAT, both factors, Chargeable Weight) equal RN output exactly (to the cent / 4 dp).
- [x] Each of deviations 1–4 has a test asserting the web behaviour.
- [x] `validate` returns the documented error for: missing/≤0 rate, negative amounts, compound rule with a missing option, air-shipment mode without Cartons or with divisor ≤ 0.
- [x] Step list order and kinds match RN sections (Air freight → CIF → Duty → Purchase Tax → Expenses → VAT → Factors); empty sections omitted as in RN.
- [x] Module has no imports from React, i18n or the DOM (checked by an ESLint `no-restricted-imports` rule on the folder).
- [x] `npm test`, `npm run lint`, `npm run build` pass.

## Open Questions

None.
