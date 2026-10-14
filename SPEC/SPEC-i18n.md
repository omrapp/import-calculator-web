# Spec: i18n

Module of [CAPABILITY-MAP.md](./CAPABILITY-MAP.md). Shared rules: [SPEC.md](./SPEC.md). Depends on: nothing.

## Objective

Every page renders in English, Hebrew or Arabic, with right-to-left layout for Hebrew and Arabic. A first visit picks the browser's language; a user's choice is remembered. Unlike the RN app, switching language applies instantly with no reload.

Consumers: every UI module.

## Design

- Libraries: `i18next`, `react-i18next` (same as RN app). No language-detector package: detection is ~15 lines (saved choice → `navigator.languages` → `en`).
- Locale files: copy RN `src/i18n/locales/{en,he,ar}.json` to `src/locales/`, then:
  - Rename keys and wording to CONTEXT.md terms in all three languages (`import_pivot` → `import_factor`, `pivot_vs_shekel` → `import_factor`, `pivot_vs_foreign` → `shekel_per_unit_factor`, `tama_i`/`tama_ii` → `duty_option_i`/`duty_option_ii`, `ALF`/`ALE` → `compound_rule_higher`/`compound_rule_lower`, `tama_percent` → `tama`, `employee` → `customs_broker`, `final_total` → `total_including_vat`, Bookmarks → History).
  - Drop RN-only keys (rate us, store links, "restart to apply language").
  - Fill the keys missing from he (1) and ar (2) relative to en.
  - New web strings (nav, About/Contact/Privacy/Terms, validation, rate status) are added by the module that needs them, in all three languages.
- Public API (`src/features/i18n/index.ts`):
  - `initI18n()` — called once in `main.tsx` before render.
  - `useLanguage()` → `{ language, setLanguage, dir }`.
  - `LanguageSwitcher` — select with native language names (English / עברית / العربية); placed in the header for now, `site-pages` owns final placement.
  - `formatNumber(value, { fractionDigits })`, `formatMoney(amount, currency)` — `Intl.NumberFormat` with the active language, forcing Latin digits (`-u-nu-latn`) so figures match invoices and customs forms.
- On language change: set `<html lang>` and `<html dir>`; save to localStorage key `language` (wrapped in try/catch; failures ignored).
- Layout direction uses Tailwind logical utilities (`ms-*`, `pe-*`, `start-*`) only; no `ml-*`/`mr-*`/`left-*`/`right-*` in app code (shadcn `rtl: true` already generates logical classes).
- Fonts: system font stack for v1; numbers render with tabular figures (`tabular-nums`) in tables.

## Files

```
src/features/i18n/  index.ts  i18n.ts  detect.ts  useLanguage.ts  LanguageSwitcher.tsx  format.ts  (+ tests)
src/locales/en.json  he.json  ar.json
src/main.tsx, src/app/AppLayout.tsx (wire-up)
```

New runtime deps: `i18next`, `react-i18next`.

## Success Criteria

- [x] Fresh visit with browser language `he-IL` renders Hebrew with `<html dir="rtl" lang="he">`; `ar-EG` → Arabic RTL; `fr-FR` → English LTR.
- [x] Choosing a language updates text and `dir` without reload and survives a page refresh.
- [x] Test asserts en, he, ar have identical key sets.
- [x] Test asserts no locale value contains the old terms (`pivot`, `Tama I`, `Bookmarks`, `Tax Employees`, `Final Total`, and their he/ar equivalents listed in the test).
- [x] `formatMoney(1234.5, 'ILS')` returns Latin digits in all three languages.
- [x] ESLint rule (`no-restricted-syntax` on className strings, or a test grep) blocks physical-direction Tailwind classes in `src/app`, `src/features`, `src/pages`.
- [x] Placeholder pages and nav use translated titles.
- [x] `npm test`, `npm run lint`, `npm run build` pass.

## Open Questions

- he/ar wording for the renamed terms is drafted by Claude; owner reviews.
