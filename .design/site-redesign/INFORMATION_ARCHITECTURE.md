# Information Architecture: Import Calculator (Site Redesign)

Companion to `DESIGN_BRIEF.md` (IMCL-11). Routes are unchanged; this IA restructures navigation, page anatomy and SEO URL handling on top of the existing route table in `src/app/routes.tsx`.

## Site Map

Every route is a lazy chunk under one `AppLayout`. No route is added, renamed or removed.

- **Calculator** (primary task, nav group)
  - Standard Calculation `/` (home; hero + form)
  - Air Shipment Calculation `/air-shipment` (hero + form)
  - Result `/result?c=<encoded calculation>` (shareable, not in nav)
- History `/history`
- Import & Export Guides `/guides?tab=guides|websites|gallery|terms|presentation`
- Site information (footer group)
  - About Us `/about`
  - Contact Us `/contact`
  - Privacy Policy `/privacy`
  - Terms of Use `/terms`
  - Settings `/settings`
- Not Found `*` (branded 404)

Static (new, in `public/` or generated at build): `/robots.txt`, `/sitemap.xml`, `/site.webmanifest`, `/favicon.svg`, `/apple-touch-icon.png`, `/icon-192.png`, `/icon-512.png`, `/icon-maskable-512.png`, `/og-image.png`.

## Navigation Model

- **Primary navigation** (header, max 3 items): **Calculator · History · Guides**.
  - "Calculator" links to `/` and is active on `/`, `/air-shipment` and `/result` (custom match, not `end`).
  - Active item marked by an animated teal-tinted pill (Motion `layoutId`) + `aria-current="page"`.
- **Secondary navigation** (contextual, inside pages):
  - **Mode switcher** (segmented control, in the hero): Standard | Air Shipment → navigates `/` ↔ `/air-shipment`. It's real links (`<a>`), so each mode is crawlable and deep-linkable.
  - **Guides tabs**: Guides, Websites, Gallery, Terms, Presentation; state in `?tab=`. Animated indicator.
  - **Result back bar**: "← Edit inputs" (arrow mirrors in RTL) + mode badge.
- **Utility navigation** (header end side): Theme toggle (system/light/dark) · Language switcher (EN/עב/عر) · Menu button (mobile only). Settings stays in the footer + mobile sheet (it holds the same controls, so it needs no header slot).
- **Footer navigation** (navy, multi-column):
  1. Brand: logo badge + wordmark, one-line tagline, contact email.
  2. Tools: Standard Calculation, Air Shipment Calculation, History, Guides.
  3. Information: About, Contact, Privacy, Terms, Settings.
  4. Data & trust: "Exchange rates: Bank of Israel representative rates" note, estimate-only disclaimer.
  - Bottom bar: © year · app version (`__APP_VERSION__`).
- **Mobile navigation** (< md): hamburger opens a `Sheet` from the inline-end side (right in LTR, left in RTL). Content order: primary links (Calculator expands to show the Standard / Air Shipment sub-links), divider, info links, divider, theme + language controls. Links stagger in; sheet closes on navigation. No bottom tab bar (the sticky total bar already owns the bottom edge on calculator pages).

Depth: max 2 levels (Calculator → mode). Every page is at most 1 click from the header or footer.

## Content Hierarchy

### Standard / Air Shipment Calculation (`/`, `/air-shipment`): the 80% page
1. **Hero (compact, ≤ ~40% of the first mobile viewport)**: H1 by mode ("Standard Calculation" / "Air Shipment Calculation", with a short lead sentence on what it estimates). It orients without delaying the task.
2. **Mode switcher**: the single biggest fork in the task; it's visible before any input.
3. **Trust chips**: Live Bank of Israel rates (pulsing dot when fresh) · Free · No signup. They answer "can I trust this / what's the catch" in one glance.
4. **Calculator form sections** (existing order): Exchange Rates → (Air Shipment section, air mode only) → CIF → Duties → Expenses. This is the task itself; the sections are numbered so progress reads at a glance.
5. **Sticky total bar** (bottom): live Total incl. VAT + Calculate button. It's always visible, so the user never loses the answer.
6. Draft notice / validation messages are inline near their fields.

### Result (`/result`)
1. **Back bar**: ← Edit inputs · mode badge. It's the most common next step after reading.
2. **H1 + rates line**: "Result" + which rates were used (Bank of Israel date / manual). Provenance is part of trust.
3. **Summary cards**: Total incl. VAT (primary, navy, counts up) → Landed cost → factors / chargeable weight / air freight. The answer comes first, largest.
4. **Actions row**: Save to history · Export (PNG/PDF/Print) · Copy link · Share · New calculation.
5. **Breakdown**: sectioned steps with formulas. It's for verification, so it sits below the answer.
6. Invalid link state: message + "Back to calculator".

### History (`/history`)
1. PageHeader: title + count + backup hint.
2. Saved calculation cards (newest first): total, mode, date, open / edit / delete.
3. Toolbar: Export · Import · Clear history (destructive, confirm dialog).
4. Empty state: illustration badge + "No saved calculations" + CTA to calculator.

### Guides (`/guides`)
1. PageHeader: title + one-line description.
2. Tabs + search field (search filters the active tab).
3. Tab content: modules accordion / websites cards / image gallery grid → lightbox / terms list / presentation.
4. Empty search result state.

### About / Contact / Privacy / Terms
1. PageHeader (icon badge, title, short lead; legal pages show the effective date).
2. Prose body, max ~70ch, logical headings.
3. Contact: email card as primary action.

### Settings (`/settings`)
1. PageHeader.
2. Language (radio group) → Theme (radio group: System / Light / Dark) → Share app → App version.

### Not Found (`*`)
1. Ship badge + "Page not found" + short lost-at-sea line.
2. CTA: Back to calculator; secondary links: Guides, History.

## User Flows

### First visit → first result (target < 60s)
1. User lands on `/` (from search, share or direct).
2. Sees the hero: what it is, mode switcher, trust chips; the form starts within the first scroll.
3. Chooses a mode:
   - Standard → stays on `/`.
   - Air Shipment → switcher thumb slides, navigates to `/air-shipment` (page transition).
4. Exchange rates auto-load (chip shows "Live"); user optionally overrides.
5. Fills Cost, Freight, Insurance, duties, expenses; sticky total updates live (tween).
   - If a field is invalid → inline error appears under the field; Calculate stays available and focuses the first error.
6. Presses Calculate → navigates to `/result?c=…` → summary cards stagger in, total counts up.

### Result → act on it
1. On `/result`, user reads the total, scans the breakdown.
2. Chooses:
   - Save → added to History (button confirms state).
   - Export → PNG / PDF (branded header) / Print.
   - Copy link / Share → URL contains the full calculation (+ `?lang` not required; the receiver's language applies).
   - Edit inputs → back to the matching calculator with the draft restored.
   - New calculation → empty calculator for the same mode.

### Returning user → reuse a past calculation
1. Header → History.
2. Finds a card → Open (result) or Edit (calculator with draft).
   - Empty → CTA back to calculator.

### Learn before calculating
1. Header → Guides → picks tab / searches.
2. Opens gallery image → lightbox (keyboard: arrows, Esc).
3. Returns to the calculator via header "Calculator".

### Change language / theme
1. Header language switcher or theme toggle (or Settings page / mobile sheet).
2. Language: UI + direction flip (RTL for he/ar), choice saved. Theme: cross-fade, choice saved.

### Arrive via a localized link (SEO / hreflang)
1. Crawler or user opens `/guides?lang=he`.
2. Language detection reads `?lang` first → applies Hebrew + RTL → saves choice → removes `lang` from the URL with `history.replaceState` (other params kept).

## Naming Conventions

Labels follow `CONTEXT.md` domain language; existing i18n keys are reused where present.

| Concept | Label in UI (en) | Notes |
| --- | --- | --- |
| Header group for `/`, `/air-shipment`, `/result` | Calculator | New key `nav.calculator`; avoids "Home" |
| Standard mode | Standard Calculation (switcher: "Standard") | `nav.standard`; never "Sea calculation" |
| Air mode | Air Shipment Calculation (switcher: "Air Shipment") | `nav.air_shipment`; never "Flight calculator" |
| One estimate | Calculation | Never "quote" or "estimate" as a noun in UI chrome |
| Final figure | Total incl. VAT | `result.total_including_vat` |
| Before VAT figure | Landed Cost | `result.landed_cost` |
| Rates source | Bank of Israel rates / Manual rates | Trust chip: "Live Bank of Israel rates" |
| Saved items | History / Saved calculations | `nav.history` |
| Learning area | Import & Export Guides (nav short: "Guides") | New short key `nav.guides_short` for header pill |
| Theme options | System / Light / Dark | New keys `settings.theme.*` |
| Edit from result | Edit inputs | `result.edit` |

All new keys added in en, he and ar.

## Component Reuse Map

| Component | Used on | Behavior differences |
| --- | --- | --- |
| `AppLayout` (header + main + footer + `PageTransition`) | All routes | Main width: calculator pages `max-w-3xl` form inside `max-w-6xl` shell; prose pages `max-w-3xl`; guides/history `max-w-6xl` |
| `SiteHeader` (sticky glass, shrink on scroll) | All | None (print: hidden) |
| `PrimaryNav` (pill indicator) | Header ≥ md | Calculator item uses multi-route match |
| `MobileNav` sheet | Header < md | Side = inline-end |
| `ThemeToggle`, `LanguageSwitcher` | Header, mobile sheet; Settings uses radio-group variants | Icon button vs radio list |
| `SiteFooter` | All | None (print: hidden) |
| `Hero` + `ModeSwitcher` + `TrustChip` | `/`, `/air-shipment` | Headline/lead by mode; air mode shows a plane-adjacent lead |
| `PageHeader` | History, Guides, About, Contact, Privacy, Terms, Settings, Result (with back bar slot), 404 | Optional icon, description, actions slot, meta line (effective date / count) |
| `Section` (numbered card) | Calculator forms | Number + icon per section |
| `AnimatedNumber` | Sticky total bar, Result summary, History card total (no count-up there, static) | Count-up only on result first reveal |
| `Reveal` / stagger | Form sections, summary cards, breakdown sections, history cards, guide cards | All honour reduced motion |
| `EmptyState` | History, Guides search | Icon + text + optional CTA |
| `useSeo` | All routes (via route `handle`) | Per-route description key; `/result` gets `noindex` |

## Content Growth Plan

- **History**: grows per user (localStorage). Newest first; current list scales to dozens. If > 50 items later: add a search/filter field and month grouping. Not built now.
- **Guides**: fixed curated content shipped with the app; tabs + search already accommodate growth. New guide tabs add to the `?tab=` enum.
- **Static pages**: fixed. Footer columns hold up to ~6 links each before needing regrouping.
- **Sitemap** is generated from the route list, so new routes appear automatically.

## URL Strategy

- **Pattern**: flat, lowercase, hyphenated single segment per page (`/air-shipment`, `/history`). Unchanged.
- **Dynamic segments**: none. State lives in query params.
- **Query parameters**:
  - `?c=<encoded calculation>` on `/result` (existing). Shareable; page is `noindex`.
  - `?tab=<guides|websites|gallery|terms|presentation>` on `/guides` (existing). Default tab omitted from canonical.
  - `?lang=<en|he|ar>` (**new**, any route): read first by language detection, saved, then stripped via `replaceState`. Used only for hreflang alternates and localized share links; never canonical.
- **Canonical**: `${VITE_SITE_URL}${pathname}` (no query, except none). If `VITE_SITE_URL` is unset, canonical/OG URLs are omitted rather than wrong.
- **hreflang**: for each indexable route, `<link rel="alternate" hreflang="en|he|ar" href="${VITE_SITE_URL}${path}?lang=xx">` plus `x-default` → `${path}` with no param.
- **Indexable routes** (sitemap): `/`, `/air-shipment`, `/history`, `/guides`, `/about`, `/contact`, `/privacy`, `/terms`, `/settings`. Excluded: `/result`, 404.
- **robots.txt**: allow all; `Disallow: /result`; `Sitemap:` line when `VITE_SITE_URL` is set.
