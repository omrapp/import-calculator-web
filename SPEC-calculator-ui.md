# Spec: calculator-ui

Module of [CAPABILITY-MAP.md](./CAPABILITY-MAP.md). Shared rules: [SPEC.md](./SPEC.md). Depends on: i18n, calc-engine, fx-rates.

## Objective

The two input screens — Standard Calculation (`/`) and Air Shipment Calculation (`/air-shipment`) — where an importer enters a shipment and presses Calculate to reach the Result. Same fields as the RN app, organised in the same sections, with web improvements: live Bank of Israel rates, multiple Carton lines, drafts that survive a refresh, and inline validation.

## Screens

Both screens share one form component; `mode` decides which sections show. Mobile-first single column; on wide screens max width ~3xl. A sticky bottom bar shows the live CIF preview (`estimateCif`) and the Calculate button.

| Section | Fields | Notes |
|---|---|---|
| Exchange Rates | USD, EUR (₪ per unit) | Prefilled from `useExchangeRates`. Status line: live → "Bank of Israel rate, {date}"; cached → "Last known Bank of Israel rate from {date}"; unavailable → "Couldn't reach Bank of Israel — enter rates"; loading → skeleton. Editing a rate marks it "manual" with a "Use Bank of Israel rate" reset. Refresh button. |
| Air Shipment (air only) | Carton lines (L, W, H cm, actual weight kg, quantity) with add/remove; Volumetric Divisor (default 6000); rate $/kg; fuel $/kg; handling $ | Live Chargeable Weight and air Freight (USD) under the section. At least one line; default one empty line, quantity 1. |
| CIF | Cost + currency; Freight + currency (standard only); Insurance + currency (optional); Premium % | Empty Insurance → derived from Premium (hint shows the formula). Currency picker: ₪ / $ / € segmented control. |
| Duties & Taxes | Duty mode: Percent / Compound Higher (ALF) / Compound Lower (ALE). Percent → Customs Duty %; Compound → Duty Option I and II (₪). Tama %, Purchase Tax %, VAT % (placeholder 18, empty = 18) | |
| Expenses | Local Transport, Customs Broker Fee, Bank, Other — each amount + currency incl. %; Custom Expenses list: name + amount + currency/% with add/remove | % means percent of the running total (hint text). |

Clear (trash) button in the page header resets the form and its draft after a confirm dialog.

## Behaviour

- **Number inputs** accept plain numbers or expressions with `+ − × ÷ * / ( )` and decimals (`1200*3+45`). Evaluated by a small hand-written parser (`src/features/calculator-ui/expression.ts`; no `eval`/`Function`) on blur; the evaluated value shows as a hint while typing. Invalid expression → field error. Latin and Arabic-Indic digits both accepted.
- **Validation**: on Calculate, run `validate()` from calc-engine; field paths map 1:1 to form field names; show translated messages under each field; focus and scroll to the first error. Errors clear as the user fixes the field.
- **Draft**: form values saved (debounced 300 ms) to localStorage `draft:standard` / `draft:air-shipment`; restored on load; Clear removes it. Rates are not drafted when they came from the bank (fresh rates load each visit); manual rates are.
- **Calculate**: builds `CalculationInput`, wraps it as `CalculationLink { v: 1, input, rates: { source: 'live' | 'cached' | 'manual', lastUpdate? } }`, and navigates to `/result?c=<encoded>`.
- **Codec** (`src/features/calc-engine/serialize.ts`, pure): `encodeCalculation(link) → string` (JSON → UTF-8 → base64url) and `decodeCalculation(string) → CalculationLink | null` (rejects unknown `v`, malformed data or inputs failing structural checks). Used again by `result` and `history`.

## Files

```
src/features/calculator-ui/
  CalculatorForm.tsx  sections/{RatesSection,AirShipmentSection,CifSection,DutiesSection,ExpensesSection}.tsx
  fields/{NumberField,CurrencyPicker,AmountField}.tsx
  expression.ts  formValues.ts (form ⇄ CalculationInput)  useDraft.ts  index.ts  (+ tests)
src/features/calc-engine/serialize.ts (+ test)
src/pages/StandardCalculationPage.tsx  src/pages/AirShipmentCalculationPage.tsx
src/app/routes.tsx (wire pages)
src/locales/*.json (new strings: validation messages, rate status, hints)
src/components/ui/* (shadcn: input, label, toggle-group, card, alert-dialog)
```

New runtime dependency: `react-hook-form` (as in the RN app; `useFieldArray` for Cartons and Custom Expenses). shadcn components bring their radix parts.

## Success Criteria

- [x] `expression.test.ts`: `1200*3+45` → 3645, `(10+5)/3` → 5, `١٢٣` → 123, `2÷4×3` → 1.5; `1+`, `abc`, `2**3`, `alert(1)` → invalid; no `eval`/`Function` in the module (lint rule `no-new-func`, `no-eval`).
- [x] `formValues.test.ts`: round-trips every field; empty Insurance → `null`; empty VAT → `null`; percent Expenses map to `{ percent }`.
- [x] `serialize.test.ts`: encode → decode round-trips a full Air Shipment link with Hebrew Custom Expense names; rejects `v: 2`, garbage and truncated strings.
- [x] Component tests (Testing Library):
  - Standard page shows Freight; Air page hides Freight and shows Cartons; adding/removing Carton lines works; at least one stays.
  - Rates prefill from a mocked `/api/rates`; status text for live/cached/unavailable; editing a rate shows "manual" and reset restores the bank rate.
  - Submitting with a missing rate or a missing Duty Option shows the translated error on that field and does not navigate.
  - Valid submit navigates to `/result?c=…` whose decoded input equals the form values.
  - Draft restores after remount; Clear (after confirm) empties the form and the draft.
  - Live CIF preview updates as Cost changes.
- [x] he and ar render the form RTL with no physical-direction classes (existing direction test).
- [x] `npm test`, `npm run lint`, `npm run build` pass.
- [ ] Manual browser check of both pages in en and he — not done (Chrome extension not connected); owner to check locally.

## Open Questions

- New he/ar strings drafted by Claude; owner reviews.
