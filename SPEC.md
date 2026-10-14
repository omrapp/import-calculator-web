# Spec: Import Calculator Web (project-wide)

Shared rules for every module spec. Module specs (`SPEC-<id>.md`, indexed in [CAPABILITY-MAP.md](./CAPABILITY-MAP.md)) add objective, design and success criteria. Vocabulary: [CONTEXT.md](./CONTEXT.md). Decisions: [docs/adr](./docs/adr/).

## Objective

Public website that lets importers into Israel estimate the Landed Cost of a shipment, with full feature parity with the React Native app plus web extras (share link, History backup, live Bank of Israel rates). Deployed to Vercel by the owner after every module is built and tested locally.

## Tech Stack

Vite 8, React 19, TypeScript 6, React Router 8, Tailwind CSS 4, shadcn/ui (radix, RTL), Vitest 5 + Testing Library + jsdom, ESLint 10 + Prettier 3, React Compiler (Babel preset). Node 24.

## Commands

```
Dev:          npm run dev
Build:        npm run build          # tsc -b && vite build
Preview:      npm run preview
Test:         npm test               # vitest run
Test (watch): npm run test:watch
Lint:         npm run lint
Format:       npm run format         # check only: npm run format:check
```

## Project Structure

```
api/                     → Vercel functions (fx-rates only, per ADR 0001)
src/app/                 → Router, layout, providers
src/features/<module>/   → One folder per module id; public API via index.ts
src/components/ui/       → shadcn/ui primitives (generated)
src/lib/                 → Cross-module helpers (cn, formatting)
src/locales/{en,he,ar}.json → Translations
src/test/                → Test setup
scripts/                 → One-off/dev scripts (golden fixture generation)
docs/adr/                → Architecture decisions
```

Tests live next to the code: `foo.ts` → `foo.test.ts`.

## Code Style

Prettier: single quotes, trailing commas, 2-space indent, no parens on single arrow params. `@/*` → `src/*`. Named exports, function components, domain names from CONTEXT.md in code (`landedCost`, `importFactor`, `dutyOptionI`; never `pivot`, `tama1`).

```ts
export function chargeableWeight(cartons: Carton[], divisor: number): number {
  const actual = sum(cartons.map(c => c.weight * c.quantity));
  const volumetric = sum(cartons.map(c => volumetricWeight(c, divisor)));
  return round2(Math.max(actual, volumetric));
}
```

## Testing Strategy

- Unit (Vitest): pure logic — engine, URL codec, storage, rate parsing. Every module ships tests.
- Component (Testing Library): forms, validation messages, RTL direction, routing.
- Golden: engine output vs fixtures generated from the RN app source.
- Manual: owner tests locally in a browser before deploying.
- No coverage gate; every acceptance criterion maps to at least one test or a stated manual check.

## Boundaries

- Always: run `npm test`, `npm run lint`, `npm run build` before each commit; use CONTEXT.md terms; branch `feat/IMCL-<n>-<slug>` from `develop`; merge `--no-ff` into `develop` and `main`; keep branches; update TASKS.md.
- Ask first: adding a runtime dependency not named in a module spec; any backend/storage beyond ADR 0001; changing a decision recorded in an ADR or CONTEXT.md; Vercel account or project changes.
- Never: commit secrets; edit the RN app repo; silently fall back to hardcoded exchange rates; deploy (owner deploys).

## Contact

Contact Us email: omrayed.27@gmail.com
