# Import Calculator

A free web tool for importers into Israel. It estimates the full landed cost of a shipment: goods value, freight, insurance, customs duties, purchase tax, VAT and local expenses, all converted to Israeli Shekels (₪).

**Version:** 1.0.0 · **License:** [Apache 2.0](./LICENSE)

## Features

- **Two calculation modes**
  - **Standard**: you enter freight directly.
  - **Air shipment**: freight comes from your cartons, chargeable weight (actual vs. volumetric) and carrier rates.
- **Live exchange rates**: USD and EUR rates come from the Bank of Israel, and you can override them for any calculation.
- **Detailed result**: summary cards, a line-by-line breakdown, the formula used, cost charts, and a switch to view totals in ₪, $ or €.
- **History**: save calculations in your browser and reopen them later. There are no accounts and no server-side storage.
- **Share and export**: share a calculation as a link, or export it as PDF or PNG.
- **Guides and examples**: guides to import costs, plus worked example calculations.
- **Websites directory**: a categorized, filterable list of useful import-related sites.
- **Three languages**: English, Hebrew and Arabic, with full right-to-left support.
- **Light and dark themes**.

## Tech stack

Vite 8 · React 19 · TypeScript 6 · React Router 8 · Tailwind CSS 4 · shadcn/ui (Radix) · i18next · React Hook Form · @react-pdf/renderer · Motion · Vitest 5 + Testing Library · ESLint 10 + Prettier 3 · React Compiler

The app is a static single-page app. Its only server code is one Vercel function, `/api/rates`, which proxies the Bank of Israel exchange-rate API.

## Getting started

### Prerequisites

- Node.js 24 or later
- npm

### Installation

```bash
git clone https://github.com/omrapp/import-calculator-web.git
cd import-calculator-web
npm install
```

### Run locally

```bash
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173). `/api/rates` is mounted on the dev and preview servers too, so live rates work locally.

## Scripts

| Command                | Description                             |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start the dev server                    |
| `npm run build`        | Type-check and build to `dist/`         |
| `npm run preview`      | Serve the production build locally      |
| `npm test`             | Run the test suite once                 |
| `npm run test:watch`   | Run tests in watch mode                 |
| `npm run lint`         | Lint with ESLint                        |
| `npm run format`       | Format with Prettier                    |
| `npm run format:check` | Check formatting without writing changes |

## Configuration

| Variable        | Required | Description                                                                                      |
| --------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `VITE_SITE_URL` | No       | Public site URL, e.g. `https://example.com`. When set, the build emits `sitemap.xml`, `og:url` and canonical links. |

Put local values in `.env.local`. Files matching `*.local` are git-ignored.

## Usage guide

1. **Pick a mode.** Open **Calculator** for a standard calculation, or **Air shipment** if freight depends on carton sizes and weights.
2. **Enter the goods.** Fill in the supplier cost and its currency, the freight, and the insurance (or an insurance premium). Required fields are marked, and each duty field has an info popup that explains it.
3. **Check the exchange rate.** The latest Bank of Israel rate is filled in automatically. Edit it if you need a different rate.
4. **Add duties and expenses.** Enter customs duty, purchase tax, VAT and any local expenses that apply.
5. **Calculate.** The result page shows the landed cost, the breakdown, the formula and charts. Use the currency switch to view the totals in ₪, $ or €.
6. **Save, share or export.** Save the calculation to **History**, copy a share link, or download it as PDF or PNG.

Change the language and theme from the header or from **Settings**.

## Project structure

```
api/                  Vercel function: /api/rates (Bank of Israel rates)
public/               Static assets: icons, guide content, photos, site images
scripts/              Dev scripts: asset generation, screenshots, test fixtures
src/app/              Router, layout, navigation, SEO
src/features/<name>/  One folder per feature (calc-engine, calculator-ui,
                      result, history, export, fx-rates, i18n, guides, ...)
src/components/       Shared UI (shadcn/ui primitives, brand, motion)
src/pages/            Route pages
src/locales/          Translations: en.json, he.json, ar.json
```

Tests sit next to the code they cover (`foo.ts` → `foo.test.ts`).

## Deployment

The project deploys to [Vercel](https://vercel.com) with no extra setup. `vercel.json` rewrites every route to the SPA and sets the security headers. Set `VITE_SITE_URL` in the Vercel project's environment variables to enable the sitemap and canonical URLs.

## Disclaimer

Results are estimates for planning only. They are not customs, tax or legal advice. Confirm actual duties and taxes with a licensed customs broker or the Israel Tax Authority.

## License

Licensed under the [Apache License 2.0](./LICENSE).
