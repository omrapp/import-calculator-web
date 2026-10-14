# Spec: result

Module of [CAPABILITY-MAP.md](./CAPABILITY-MAP.md). Shared rules: [SPEC.md](./SPEC.md). Depends on: i18n, calc-engine (and links back into calculator-ui for Edit).

## Objective

`/result?c=<link>` shows a Calculation's outcome: headline totals first, then the full step-by-step breakdown the RN Result screen shows, every number traceable to its formula. The URL is the share link: anyone opening it sees the same Result.

## Screen

1. **Header**: title "Calculation Results", mode (Standard / Air Shipment), and a rates note: "Bank of Israel rate, {date}" / "Last known Bank of Israel rate from {date}" / "Rates entered manually", plus USD/EUR values used.
2. **Summary cards**: Landed Cost, Total Including VAT (emphasised), Import Factor, Shekel-per-Unit Factor (hidden when null). Air Shipment adds Chargeable Weight and air Freight (USD).
3. **Breakdown**: sections from `calculate().steps` in order. Header → section title; row → label, value, formula underneath in muted text; subtotal/total → emphasised; divider → spacing. Formula tokens render as text in the reading direction with LTR-isolated numbers (`<bdi>`), e.g. `$1,000.00 × 3.074`, `(₪3,074.00 + ₪368.88) × 1.1 × 0.35%`, `max(54.00 kg, 31.20 kg)`. Custom Expense labels show the user's text.
4. **Actions**: Copy link (Clipboard API; "Link copied" toast-free inline confirmation), Share (Web Share API when available, else hidden), Edit (opens the matching calculator pre-filled with these inputs), New calculation. Save (history) and Export are added by their own modules.

Numbers use `formatMoney` / `formatNumber` (Latin digits); factors 4 dp; weights 2 dp + kg.

## Behaviour

- Decode `c` with `decodeCalculation`; then `validate` + `calculate`. Missing, undecodable or invalid link → friendly error ("This calculation link is invalid or incomplete") with a button back to the calculator. No crash.
- Results are computed from inputs on every open (the link holds inputs, not results), so a shared link always matches today's engine.
- **Edit**: `openInCalculator(link)` exported from calculator-ui writes the inputs as that mode's draft (`toFormValues`; manual rates kept as manual, bank rates refetched) and navigates to `/` or `/air-shipment`.
- Page `<title>`: "Result — Import Calculator" (localised).

## Files

```
src/features/result/  ResultView.tsx  SummaryCards.tsx  Breakdown.tsx  Formula.tsx  useCalculationFromUrl.ts  index.ts  (+ tests)
src/features/calculator-ui/openInCalculator.ts (+ export)
src/pages/ResultPage.tsx, src/app/routes.tsx
src/locales/*.json (new strings)
```

No new dependencies.

## Success Criteria

- [ ] `Formula.test.tsx`: renders each token kind (money in ₪/$/€, factor, percent, kg, operators, nested group, max) with Latin digits in en/he/ar.
- [ ] `ResultView.test.tsx`:
  - golden fixture "everything combined" link shows Landed Cost ₪111,999.89 and Total Including VAT ₪132,159.87, and all section headers in order;
  - Air Shipment link shows Chargeable Weight and air Freight cards and per-Carton rows;
  - Custom Expense shows its own name;
  - factors hidden when Cost is 0;
  - rates note for live / cached / manual;
  - missing / garbage / invalid-input link shows the error state and a working back link.
- [ ] Copy link writes `location.href` to the clipboard (mocked) and shows confirmation; Share hidden when `navigator.share` is absent.
- [ ] Edit pre-fills the calculator: round-trip test from link → `openInCalculator` → form shows the same values.
- [ ] Hebrew renders RTL with numbers readable (direction test passes).
- [ ] `npm test`, `npm run lint`, `npm run build` pass.

## Open Questions

- New he/ar strings drafted by Claude; owner reviews.
