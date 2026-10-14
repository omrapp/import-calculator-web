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
- [x] IMCL-5 calculator-ui: Standard + Air Shipment forms, live rates w/ manual override, safe expression parser, multi-Carton, drafts, link codec → /result?c=
- [x] IMCL-6 result: summary cards, step breakdown with formulas, rates note, copy/share link, Edit back into calculator, invalid-link state
- [x] SPEC-final-modules.md (history, export, guides, site-pages) — approved
- [x] IMCL-7 history: Save on Result, History page (open, recalculate with today's rates, delete, clear), JSON export/import with merge by id
- [x] IMCL-8 export: PNG (html-to-image), PDF (react-pdf, embedded Noto Sans / Noto Sans Hebrew / IBM Plex Sans Arabic, RTL), Print; both libs lazy-loaded
- [x] IMCL-9 guides: 5 tabs (modules, presentation, terms, gallery, websites) with URL tab + search, lightbox with zoom and RTL-aware arrows; 22 slides + 6 documents converted to AVIF/WebP (45 MB → 7.5 MB)
- [x] IMCL-10 site-pages: header + mobile menu + footer, lazy route per page (main chunk 682 → 273 kB), page titles per route, Settings, About Us, Contact Us (mailto), Privacy/Terms drafts in en/he/ar, OG/Twitter meta + og-image.png, Vercel Analytics, version 1.0.0

## Pending

- [ ] IMCL-11 site redesign (design flow; `.design/site-redesign/`): brief, IA, tokens, task list done; Foundation T1–T3 + Core UI T4–T10 + T11 (PageHeader/EmptyState) done; Interactions T12–T16, Polish T17–T20 pending. Initial JS 193 KiB gz (budget 214)

- [ ] Owner: replace the About Us "who built it" draft paragraph (src/locales/*.json `pages.about.who_body`)
- [ ] Owner: after first deploy, make og:image absolute and add og:url in index.html
- [ ] Owner: local browser test, then Vercel deploy

## Blockers
- Guide content copied verbatim from the app; module 1 still says VAT 17% (now 18%). Owner to review the content
- Owner: open a he and an ar PDF from a real browser download and check them; the render was checked only from test output via macOS sips
- Browser check of calculator pages (en/he) not done — Chrome extension not connected
- Vercel deploy of api/rates.ts untested until owner deploys (works on Vite dev/preview)
- Owner review of he/ar wording (renamed terms, new pages)
- Legal review of Privacy / Terms drafts (src/features/site-pages/content)
