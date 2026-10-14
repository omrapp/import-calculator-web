# Capability Map: Import Calculator Web

Index of modules. Each module has its own `SPEC-<id>.md` at the repo root. Terms follow [CONTEXT.md](./CONTEXT.md).

| Module id | Responsibility | Depends on |
|---|---|---|
| i18n | en/he/ar, RTL, browser-default language, persisted choice, locale files with renamed terms | — |
| calc-engine | Pure Standard + Air Shipment Calculation returning structured steps; parity with RN `ResultViewModel` | — |
| fx-rates | Bank of Israel rates via Vercel function (+ Vite dev middleware), ~1h cache, last-known fallback, user override | — |
| calculator-ui | Standard and Air Shipment Calculation forms | i18n, calc-engine, fx-rates |
| result | Step breakdown, Landed Cost, Total Including VAT, factors, share link | i18n, calc-engine |
| history | Saved Calculations in localStorage, recalculate, delete/clear, JSON export/import | result, fx-rates |
| export | PNG + generated PDF (embedded he/ar fonts), print stylesheet fallback | result, i18n |
| guides | Ported guide content, optimized images, zoomable gallery | i18n |
| site-pages | Layout/nav, Settings, About Us, Contact Us, Privacy, Terms, 404, meta/OG, Vercel Analytics | i18n |

Build order: i18n, calc-engine, fx-rates → calculator-ui → result → history, export → guides, site-pages

Specs: history, export, guides and site-pages share [SPEC-final-modules.md](./SPEC-final-modules.md).

Review gate: owner approves each module spec; plan, tasks and implementation run autonomously with a report after each module merge.
