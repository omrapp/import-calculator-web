# Spec: history, export, guides, site-pages

Combined spec for the last four modules of [CAPABILITY-MAP.md](./CAPABILITY-MAP.md). Shared rules: [SPEC.md](./SPEC.md). Terms: [CONTEXT.md](./CONTEXT.md). Each module is built on its own ticket branch, in this order:

| Ticket | Module | Branch |
|---|---|---|
| IMCL-7 | history | `feat/IMCL-7-history` |
| IMCL-8 | export | `feat/IMCL-8-export` |
| IMCL-9 | guides | `feat/IMCL-9-guides` |
| IMCL-10 | site-pages | `feat/IMCL-10-site-pages` |

**Result page composition.** `result` must not import `history` or `export` (map dependencies point the other way). `ResultView` gains an `actions` render prop, `(args: { link, result, contentRef }) => ReactNode`, and `ResultPage` passes Save (history) and Export (export) through it.

---

## 1. history (IMCL-7)

### Objective

Importers keep Calculations they care about, reopen them later, rerun them with today's Bank of Israel rates, and back the whole History up to a file, because localStorage is per-browser.

### Data

```ts
type SavedCalculation = {
  id: string;            // crypto.randomUUID()
  savedAt: string;       // ISO
  link: CalculationLink; // inputs + rate source, as in the share link
  totals: CalculationTotals; // frozen at save time
};
```

- Store: localStorage `history:v1` holds a JSON `SavedCalculation[]`, newest first. Unreadable or malformed storage counts as an empty History, and the next write replaces it. Each item is validated on read with the same structural checks as `decodeCalculation`, and bad items are dropped.
- `src/features/history/storage.ts` is pure apart from `localStorage` and exposes `listSaved`, `saveCalculation`, `deleteSaved`, `clearHistory`, `exportHistory() → string` and `importHistory(json) → { added, skipped }`.
- `useHistory()` hook: list plus actions. It re-renders on changes in the same tab and also listens to `storage` events from other tabs.

### Screens

- **Result page → Save button.** Saves the current link and its totals. If the same encoded link is already saved, the button shows "Saved" and is disabled, so nothing is saved twice.
- **History page (`/history`).** Newest first. Each card shows:
  - mode (Standard / Air Shipment), saved date, Cost with its currency, Total Including VAT and Landed Cost (the frozen values);
  - **Open**, which goes to `/result?c=<link>`;
  - **Recalculate with today's rates**, which replaces `input.rates` with current BOI rates (`useExchangeRates`), sets `rates: { source, lastUpdate }` and opens the Result. It is disabled while rates are loading or unavailable, with a tooltip-free hint;
  - **Delete**.
- **Header actions:**
  - Export (downloads `import-calculator-history-YYYY-MM-DD.json`);
  - Import (file picker that accepts `.json`, merges by `id`, keeps existing items on conflict, then reports "Imported N, skipped M" inline);
  - Clear History (confirm dialog).
- **Empty state:** "No Saved Calculations yet" plus a link to the calculator.
- Export file format: `{ "app": "import-calculator", "v": 1, "exportedAt": ISO, "items": SavedCalculation[] }`. Import rejects any other `app` or `v` with an inline error.

### Files

```
src/features/history/  storage.ts  useHistory.ts  SaveButton.tsx  HistoryView.tsx  SavedCalculationCard.tsx  index.ts  (+ tests)
src/features/result/ResultView.tsx (actions prop), src/pages/ResultPage.tsx, src/pages/HistoryPage.tsx, src/app/routes.tsx
src/locales/*.json
```

No new dependencies.

### Success Criteria

- [x] `storage.test.ts`:
  - save → list round-trips, newest first;
  - delete and clear work;
  - malformed storage → empty list;
  - export → import into empty storage reproduces the items;
  - importing the same file again adds 0 and skips N;
  - wrong `app`/`v` or garbage → error, storage unchanged.
- [x] `HistoryView.test.tsx`:
  - empty state;
  - card shows the frozen Total Including VAT;
  - Open navigates to the Result;
  - Recalculate uses mocked live rates (decoded link has the new rates and `source: 'live'`);
  - Delete removes the card;
  - Clear removes everything after confirm;
  - Import reports counts.
- [x] Result Save: first click saves and shows "Saved"; a reload of the same link still shows "Saved".

---

## 2. export (IMCL-8)

### Objective

Download a Result as a PNG image or as a PDF that renders Hebrew and Arabic correctly, plus a print layout as fallback.

### Design

- An **Export** button group on the Result page offers Download image (PNG), Download PDF and Print.
- **PNG:** `html-to-image` `toPng(contentRef.current, { pixelRatio: 2, backgroundColor })`, imported lazily. The filename is `import-calculation-YYYY-MM-DD.png`. Action buttons are excluded through a `data-export-ignore` filter.
- **PDF:** `@react-pdf/renderer`, imported lazily through a dynamic `import('./pdf/renderPdf')`.
  - The document contains: title, mode, date, rates note, the summary totals, and every Breakdown section with label, value and formula.
  - Text is built from the same `formatStepValue` / `formatFormula` and translated labels as the screen. To allow that, `result` exports a pure helper, `toBreakdownSections(steps, label)`, together with those formatters.
  - Fonts are registered from `@fontsource/noto-sans` (Latin), `@fontsource/noto-sans-hebrew` and `@fontsource/ibm-plex-sans-arabic`. Noto Sans Arabic was dropped because react-pdf misplaced its separately positioned dot marks, while IBM Plex Sans Arabic uses precomposed letters `.woff` files via `?url`, so they are bundled, self-hosted and only fetched when a PDF is made.
  - In he/ar the page direction is RTL (aligned to the right edge), and numbers and formulas stay LTR.
  - The filename is `import-calculation-YYYY-MM-DD.pdf`.
- **Print:** `window.print()`, with `@media print` CSS that hides the header, nav, footer and actions, removes the sticky bar and avoids page breaks inside sections.
- If PNG or PDF generation fails, an inline error appears ("Couldn't create the file — try Print instead"). Buttons show a busy state while working.

### Files

```
src/features/export/  ExportMenu.tsx  download.ts  png.ts  pdf/{renderPdf.tsx,ResultDocument.tsx,fonts.ts}  index.ts  (+ tests)
src/features/result/ (export toBreakdownSections + formatters from index.ts)
src/index.css (print styles), src/pages/ResultPage.tsx, src/locales/*.json
```

New runtime dependencies: `html-to-image`, `@react-pdf/renderer`, `@fontsource/noto-sans`, `@fontsource/noto-sans-hebrew`, `@fontsource/ibm-plex-sans-arabic`.

### Success Criteria

- [x] `ExportMenu.test.tsx` (libs mocked): PNG calls `toPng` with the result node and downloads a `.png` with a dated name; PDF downloads a `.pdf`; a failure shows the inline error; Print calls `window.print`.
- [x] `renderPdf.test.ts` (node environment, real react-pdf and fonts): en, he and ar documents for the "everything combined" fixture each produce a non-empty blob starting with `%PDF`.
- [x] Neither `html-to-image` nor `@react-pdf/renderer` is in the main chunk (build output check).
- [ ] Manual (owner): open the PDF in he and ar and check that letters connect and text runs right to left.

---

## 3. guides (IMCL-9)

### Objective

Port the app's Guides screen: learning modules, the 22-slide presentation, trade terms, the document example gallery and recommended trading websites, searchable, in en/he/ar.

### Design

- `/guides?tab=guides|presentation|terms|gallery|websites` uses tabs (shadcn `tabs`). The tab is kept in the URL, and the default tab is `guides`.
- A search box filters the active tab, with the same matching as the app: title + content for modules; term + name + description for terms; title for slides; title + description for the gallery and websites. Switching tabs clears the search. Every tab has an empty state.
- **Guides:** accordion (shadcn `accordion`), one item per learning module. Content uses the app's mini-format: lines, `•` bullets, numbered lines and `**bold**`. It is rendered by a small parser into React elements, with no HTML injection.
- **Presentation:** grid of slide cards with a number and title. Clicking a card opens the **lightbox**.
- **Terms:** cards with a badge (e.g. FOB), name and description.
- **Gallery:** document example cards (COO, EUR.1, EUR-MED, Form A, Canada, Mercosur). Clicking a card opens the lightbox, which has a Download button for the full-size image.
- **Websites:** cards with title, description and a "Visit website" link (`target=_blank rel="noopener noreferrer"`).
- **Lightbox:** shadcn `dialog` with the image at full width.
  - Controls: zoom in, zoom out and reset (CSS scale in a scrollable box); double-click toggles 2× zoom. Previous and next buttons plus arrow keys move between images in reading order (direction-aware in RTL), and Esc closes.
  - Caption shows the title and "n / total".
- **Images:**
  - `scripts/convert-guides.ts` (run once with sharp) reads the RN app's `assets/guides/*.jpg` and `assets/examples/*.png` read-only. It writes `public/guides/<slug>-{640,1600}.{avif,webp}` and, for gallery items, the original as `-full.webp`.
  - Pages use `<picture>` with AVIF then WebP and `srcset`/`sizes`, `loading="lazy"` and `decoding="async"`, with explicit width/height to avoid layout shift.
  - The converted files are committed; the script is kept for re-runs.
- **Data:** `src/features/guides/data/{learning-modules,presentation,terms,gallery,websites}.ts` with `LocalizedString`, content copied from the RN app as is. Image paths point to `/guides/...`.

### Files

```
scripts/convert-guides.ts
public/guides/*
src/features/guides/  GuidesView.tsx  tabs/{ModulesTab,ImageGridTab,TermsTab,WebsitesTab,EmptyState}.tsx  Lightbox.tsx  Picture.tsx  RichText.tsx  search.ts  data/* (incl. image-sizes.json written by the script)  index.ts  (+ tests)
src/components/ui/{tabs,accordion,dialog}.tsx (shadcn)
src/pages/GuidesPage.tsx, src/app/routes.tsx, src/locales/*.json
```

New dev dependency: `sharp` (image conversion script only).

### Success Criteria

- [x] `search.test.ts`: per-tab filtering matches the app's rules in en/he/ar; an empty query returns everything.
- [x] `RichText.test.tsx`: bullets, numbered lines and `**bold**` render as list items and `<strong>`; `<script>` in content renders as text.
- [x] `GuidesView.test.tsx`:
  - `?tab=terms` opens Terms;
  - switching tabs updates the URL and clears the search;
  - searching "FOB" shows the FOB card;
  - an empty result shows the empty state;
  - website links open in a new tab with `noopener`.
- [x] `Lightbox.test.tsx`: opens on the clicked slide; next and previous (arrow keys) change "n / total"; zoom in changes scale; Esc closes.
- [x] All 22 slides and 6 gallery items have AVIF and WebP files at both widths (test reads `public/guides`).
- [x] Total `public/guides` size is under 12 MB (sources are 45 MB).

---

## 4. site-pages (IMCL-10)

### Objective

The site shell and the informational pages: navigation that works on phones, Settings, About Us, Contact Us, Privacy Policy, Terms of Use, 404, page titles, meta/OG tags and Vercel Analytics. Routes are code-split.

### Design

- **Layout:**
  - Header: brand ("Import Calculator", which links to `/`); primary nav (Standard, Air Shipment, History, Guides); language switcher.
  - Below `md`, the primary nav moves into a menu (shadcn `sheet`, opening from the inline-end side).
  - Footer: About Us, Contact Us, Privacy Policy, Terms of Use, Settings, and the line "Estimates only — not customs advice".
  - All styling uses logical properties.
- **Page titles:** `usePageTitle(key)` sets `document.title` to `<Page> — Import Calculator` in the current language. Every route uses it, including the existing Result page.
- **Settings:** language picker (radio group: English / עברית / العربية) and "Share this site". Share uses the Web Share API when available; otherwise it copies the site URL with a "Link copied" confirmation.
- **About Us:**
  - What the calculator does, merged from the app's About screen;
  - feature list (Standard and Air Shipment, live BOI rates, History, export, guides, three languages);
  - "Who built it and why", a draft paragraph for the owner to edit;
  - a Contact button and the version (`__APP_VERSION__` from package.json via Vite `define`).
- **Contact Us:** the email omrayed.27@gmail.com shown as text plus a `mailto:` button with a localised subject. No form.
- **Privacy Policy / Terms of Use:**
  - Drafted by Claude in en/he/ar, kept in `src/features/site-pages/content/{privacy,terms}.ts` as localised sections, with an effective date of 2026-10-14 and a banner, visible only in dev builds, saying "Draft — pending legal review".
  - Privacy covers: no accounts and no personal data collected; localStorage (drafts, History, language, last rates); Vercel Analytics (cookieless, aggregate); Bank of Israel rates fetched through our function; mailto contact.
  - Terms cover: estimates only; no liability for customs or tax decisions; verify with a licensed customs broker; rates come from the Bank of Israel; the service is provided as is.
- **404:** the existing page plus a title.
- **Meta/OG** (`index.html`): description, `og:title`, `og:description`, `og:type`, `og:image` (`/og-image.png`, 1200×630, generated by a script from an SVG with sharp), `twitter:card=summary_large_image`, and `theme-color`. Crawlers need an absolute `og:image` and `og:url`, so the owner sets them after deploy, once the `*.vercel.app` URL is known (noted in TASKS.md).
- **Vercel Analytics:** `<Analytics />` from `@vercel/analytics/react` in the root layout. It does nothing outside Vercel.
- **Code-splitting:** every page is loaded with React Router `lazy` route objects, and the main chunk falls under Vite's 500 kB warning.
- `PlaceholderPage` is deleted once no route uses it.

### Files

```
src/app/{AppLayout.tsx,nav.ts,routes.tsx,SiteFooter.tsx,MobileNav.tsx,usePageTitle.ts}
src/features/site-pages/  SettingsView.tsx  AboutView.tsx  ContactView.tsx  LegalView.tsx  content/{privacy,terms,types}.ts  index.ts  (+ tests)
src/pages/{Settings,About,Contact,Privacy,Terms}Page.tsx, src/pages/NotFoundPage.tsx
src/components/ui/{sheet,radio-group}.tsx (shadcn)
index.html, public/og-image.png, scripts/make-og-image.ts, vite.config.ts (define), src/locales/*.json
```

New runtime dependency: `@vercel/analytics`.

### Success Criteria

- [x] `routes.test.tsx`: every route renders its page heading (lazy), and an unknown path renders 404.
- [x] `usePageTitle`: title changes with the route and with the language.
- [x] Layout: at a narrow width the menu button opens the nav sheet, and choosing a link closes it; the footer links are present.
- [x] Settings: choosing עברית sets `<html dir="rtl" lang="he">`; Share calls `navigator.share` when available and otherwise copies the URL.
- [x] Contact: the `mailto:omrayed.27@gmail.com` link is present.
- [x] Privacy and Terms render every section in en/he/ar; a test checks section-count parity across languages.
- [x] `index.html` has the OG/Twitter meta tags; `public/og-image.png` is 1200×630.
- [x] `npm run build`: main chunk 273 kB, under 500 kB. Vite still warns about the lazy `renderPdf` chunk (1.2 MB), which loads only when a PDF is made.

---

## Shared success criteria (every ticket)

- [x] `npm test`, `npm run lint` and `npm run build` pass before each merge.
- [x] New strings exist in en/he/ar (the locale parity test passes) and the direction test passes.
- [x] Each ticket is merged `--no-ff` into `develop` and then `main`, and pushed; branches are kept; TASKS.md is updated.
- [ ] Manual (owner): browser check in en/he/ar of the History, Guides, Settings and legal pages, plus the PDF in he and ar.

## Open Questions

- he/ar wording, including the Guides content copied verbatim from the app, needs owner review.
- Privacy and Terms are drafts; they need legal review before relying on them.
- About Us "who built it" paragraph is a placeholder for the owner's own text.
- The absolute `og:url` and `og:image` URLs need setting after the first deploy.
