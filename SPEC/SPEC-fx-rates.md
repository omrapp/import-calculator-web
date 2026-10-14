# Spec: fx-rates

Module of [CAPABILITY-MAP.md](./CAPABILITY-MAP.md). Shared rules: [SPEC.md](./SPEC.md). Decision: [ADR 0001](./docs/adr/0001-static-spa-no-accounts.md). Depends on: nothing.

## Objective

Give every Calculation today's Bank of Israel representative rates for USD and EUR without the user typing them, and never use a made-up rate. If the bank can't be reached, show the last known rate with its date; if there is none, ask the user to enter it.

Consumers: `calculator-ui` (default rates, status line, override), `history` (recalculate with today's rates).

## Source

`GET https://boi.org.il/PublicApi/GetExchangeRates` → `{ exchangeRates: [{ key, currentExchangeRate, currentChange, unit, lastUpdate }] }`. Verified 2026-10-14: USD 3.074, EUR 3.4393, `unit` 1, no CORS header (browser can't call it directly), `cache-control: no-store`.

## Design

- `api/rates.ts` is self-contained (no imports from `src/`: Vercel compiles functions per file and the repo is ESM, so cross-folder extensionless imports are a deploy risk). It exports:
  - `getRates()`: fetch BOI (5 s timeout), pick USD and EUR, divide by `unit`, return `{ rates: { USD: { rate, lastUpdate }, EUR: { rate, lastUpdate } }, source: 'boi' }`. Malformed or missing data → throw.
  - `GET()` (Web handler): 200 with `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`; on error 502 `{ error: 'unavailable' }` with `no-store`.
  - `RatesPayload` type, imported type-only by the client.
- Local dev: a small Vite plugin in `vite.config.ts` mounts the same handler at `/api/rates` on the dev and preview servers, so `npm run dev` gets real rates without `vercel dev` or a linked project.
- Client `useExchangeRates()` → `{ status: 'live' | 'cached' | 'unavailable' | 'loading', rates?, lastUpdate?, refresh() }`:
  - Success: `live`; save to localStorage key `fx-rates:last`.
  - Failure with saved rates: `cached` with their `lastUpdate`.
  - Failure without saved rates: `unavailable`; the form requires manual rates (engine validation already rejects ≤ 0).
- Override is form state in `calculator-ui`; this module only supplies defaults. A Calculation records which rates it used and whether they were overridden.
- Rates are never hardcoded anywhere in the app.

## Files

```
api/rates.ts                      (every file in api/ becomes a Vercel function, so no tests here)
src/features/fx-rates/rates-api.test.ts
src/features/fx-rates/  index.ts  useExchangeRates.ts  storage.ts  (+ tests)
vite.config.ts (dev/preview middleware), tsconfig.node.json (include api/ for typecheck)
```

No new runtime deps (native `fetch`).

## Success Criteria

- [x] `getRates` test (mocked fetch): parses the real response shape; divides by `unit`; throws on missing USD/EUR, non-positive rate, non-200, timeout.
- [x] `api/rates.ts` test: 200 + `s-maxage=3600` header on success; 502 + `no-store` on failure.
- [x] `useExchangeRates` tests: live → saved to localStorage; failure + saved → `cached` with date; failure + nothing saved → `unavailable`; localStorage throwing doesn't crash.
- [x] `npm run dev` / `npm run preview` then `curl …/api/rates` returns live USD/EUR (checked 2026-10-14: USD 3.074, EUR 3.4393).
- [x] `grep` finds no numeric rate literals (3.5, 4.0, etc.) in `src/` outside tests.
- [x] `npm test`, `npm run lint`, `npm run build` pass.

## Open Questions

None.
