# Tasks

Module index: [CAPABILITY-MAP.md](./CAPABILITY-MAP.md). Shared rules: [SPEC.md](./SPEC.md).

## Done
- [x] Grill plan; settle scope, stack, domain terms
- [x] CONTEXT.md glossary
- [x] ADR 0001: static SPA, no accounts, BOI rates function
- [x] Update import-calculator-web-plan.md (incl. About Us, Contact Us, Privacy, Terms pages)
- [x] Create `develop` from `main`
- [x] IMCL-1: scaffold Vite 8 + React 19 + TS + Tailwind 4 + shadcn (RTL) + React Router 8 + Vitest + ESLint/Prettier + React Compiler; placeholder routes; `vercel.json` SPA rewrite — merged into `develop` and `main`
- [x] Capability map approved (9 modules)
- [x] Draft SPEC.md, SPEC-calc-engine.md, SPEC-i18n.md, SPEC-fx-rates.md — approved
- [x] IMCL-2 calc-engine: pure engine, 20 RN golden fixtures, 4 deviations tested, purity lint rule
- [x] IMCL-3 i18n: en/he/ar locales restructured to CONTEXT.md terms, instant RTL switch, Latin-digit formatting, locale/engine-key/direction tests
- [x] IMCL-4 fx-rates: self-contained api/rates.ts (BOI proxy, 1h CDN cache), Vite dev/preview middleware, useExchangeRates (live/cached/unavailable)

## Pending
- [ ] Spec calculator-ui (needs owner review)
- [ ] Build calculator-ui
- [ ] Spec + build result
- [ ] Spec + build history
- [ ] Spec + build export
- [ ] Spec + build guides
- [ ] Spec + build site-pages
- [ ] Owner: local browser test, then Vercel deploy

## Blockers
- Vercel deploy of api/rates.ts untested until owner deploys (works on Vite dev/preview)
- Owner review of he/ar wording (renamed terms, new pages)
- Legal review of Privacy / Terms drafts (after drafting)
