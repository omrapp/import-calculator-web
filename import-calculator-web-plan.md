## Import Calculator Website

**Goal**: build a public website that brings the React Native app's import cost calculator to the web, with full feature parity.

- Source app (React Native/Expo): `/Users/omarayed/Documents/Projects/react-native/InternationalTradeCalculator/TradeCalculator`
- Source app repo: https://github.com/omrapp/ImportCalculator.git (RN app only, not used for the web)
- Web repo: new separate repo (e.g. `omrapp/import-calculator-web`), linked to Vercel

Domain terms: see [CONTEXT.md](./CONTEXT.md). Architecture decisions: see [docs/adr](./docs/adr/).

### Tech Stack

- Front-End: React, Vite, TypeScript
- Routing: React Router
- UI: Tailwind CSS + shadcn/ui (logical CSS properties for RTL)
- i18n: i18next / react-i18next, reusing the app's `en`, `he`, `ar` locale JSONs
- Tests: Vitest (calculation engine golden tests against RN output)
- Export: html-to-image (PNG), react-pdf with embedded Hebrew/Arabic fonts (lazy-loaded), print stylesheet fallback
- Deployment: Vercel (`*.vercel.app` for now), Vercel Analytics, meta/OG tags
- Serverless: one Vercel function proxying Bank of Israel exchange rates (ADR 0001)

### Scope (v1 = full parity + web extras)

| Area | Decision |
|---|---|
| Market | Israel only; ₪ is the Base Currency |
| Calculations | Standard Calculation and Air Shipment Calculation, with full step-by-step Result |
| Engine | Port `src/viewmodel/ResultViewModel.tsx` to a pure function `input → structured steps`; UI translates labels. No rewrite of tax logic. Golden tests prove parity with the app |
| VAT | Default 18%, editable. Drop stale `VAT_VALUE = 17` from the app's `Values.ts` |
| Exchange Rates | Live Bank of Israel rates via Vercel function, cached ~1h. On failure show last known rate + date. User can always override. No silent $3.5 / €4.0 fallback |
| History | localStorage. Saved Calculation = inputs + frozen result, with "recalculate with today's rates". JSON export/import of the whole History |
| Share link | Calculation inputs encoded in the URL |
| Export | PNG image + generated PDF |
| Guides | Same 22 slides + examples, converted to WebP/AVIF, served from `/public`, lazy-loaded, zoomable gallery |
| Settings | Language (en/he/ar, RTL, default from browser) + share site URL via Web Share API. No store links (app not public) |
| i18n | en / he / ar with full RTL (`dir` on `<html>`) |

### Pages

| Page | Notes |
|---|---|
| Standard Calculation | Home page; CIF, duties/taxes, Expenses |
| Air Shipment Calculation | Cartons, Chargeable Weight, carrier rates |
| Result | Step-by-step breakdown, save, share link, export |
| History | Saved Calculations, delete, clear, JSON export/import |
| Guides | Learning modules, presentations, terms, websites, image gallery |
| Settings | Language, share site |
| About Us | Merges the app's About screen with who built it and why |
| Contact Us | Shown email + mailto link (no form, no backend) |
| Privacy Policy | Drafted by Claude, reviewed by owner. Covers localStorage, Vercel Analytics, BOI rate fetch, no accounts/personal data. en/he/ar |
| Terms of Use | Drafted by Claude, reviewed by owner. Estimate-only disclaimer, no liability for customs decisions. en/he/ar |
| 404 | Not found |

### Domain renames from the app

| App term | Web term |
|---|---|
| Import Pivot / Pivot 1 | Import Factor |
| Pivot 2 | Shekel-per-Unit Factor |
| Tama I / Tama II | Duty Option I / II |
| Tama type ALF / ALE | Compound Duty Rule: Higher / Lower |
| Tama % | Tama |
| Bookmarks / history item | Saved Calculation; list = History |
| Tax Employees | Customs Broker Fee |
| Final Total | Total Including VAT |
| CIF screen / Flight screen | Standard Calculation / Air Shipment Calculation |

### Git

- Branches: `feat|bugfix|chore/IMCL-<ticket>-<slug>`, first ticket `IMCL-1`
- Create `develop` from `main`; feature branches from `develop`
- Merge with `--no-ff`, keep branches

### Open items

- Contact email address to publish on Contact Us
- Legal review of Privacy Policy and Terms of Use drafts
