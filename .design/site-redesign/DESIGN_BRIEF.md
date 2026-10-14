# Design Brief: Site Redesign (Import Calculator)

Ticket: IMCL-11 · Branch: `feat/IMCL-11-site-redesign` · Date: 2026-10-14

## Problem

Importers and customs brokers in Israel need a landed-cost number they can quote to a client or put in a purchase decision. Today the tool computes correctly but looks like an unstyled default: a grayscale shadcn shell, system fonts, a text-only header and a one-line footer. It reads like a prototype or a government form, so a professional hesitates to trust it or share it, and nothing tells a first-time visitor what the site is, that rates are live, or that it is free before they hit a wall of inputs.

## Solution

A calm, precise instrument with a maritime identity. A visitor lands on a compact hero that says what the tool does and why it can be trusted (live Bank of Israel rates, free, no signup), picks Standard or Air Shipment, and is in the form within one scroll. Inputs sit in clean, raised sections on a quiet grid; the running total is always visible; the result page presents the numbers as the hero, with totals that count up into place and a breakdown that is easy to scan, export and share. Navy anchors every surface for stability, teal marks what is live, interactive or final. Motion is rich but always explains something: where you are, what changed, what is the answer. The whole site works equally well in English, Hebrew and Arabic, light and dark.

## Experience Principles

1. **Precision over decoration**: every visual choice makes numbers easier to read, compare or trust (tabular figures, aligned columns, clear hierarchy of total → subtotal → step). Ornament (glow, grid pattern) stays behind content and never competes with a figure.
2. **Motion that explains, never performs**: animate state change (route, tab, active nav, value update, result reveal). No looping or decorative motion on content. Everything collapses to an instant change under `prefers-reduced-motion`.
3. **Time-to-number over storytelling**: the hero is short; the calculator is reachable without scrolling past marketing. Trust signals are chips, not sections.

## Aesthetic Direction

- **Philosophy**: Swiss / International Typographic, tempered by Dieter Rams. Strict 12-column grid, strong scale contrast between display headings and body, numbers set as the primary typographic element, restrained palette, functional detail only.
- **Tone**: Authoritative, calm, precise; quietly modern. Confident, not loud.
- **Palette (60 / 30 / 10)**:
  - 60% Primary: navy / midnight blue (trust, stability, the ocean). Brand surfaces, footer, primary buttons, headings in light mode; base background in dark mode.
  - 30% Secondary: pure white and slate gray (structure, cleanliness, clarity). Page background, cards, borders, muted text.
  - 10% Accent: sky blue / teal (modernization, maritime). Active nav pill, focus rings, live-rate indicators, final total highlight, links.
- **Typography**: Inter Variable for Latin (user decision; mitigated against "generic" by tight negative tracking on display sizes, a strict type ramp and `font-variant-numeric: tabular-nums` on all figures). Noto Sans Hebrew for Hebrew, IBM Plex Sans Arabic for Arabic (already used in PDF export; now loaded for the web UI too). Fonts self-hosted via `@fontsource`, subset, `font-display: swap`, Latin preloaded.
- **Surfaces**: soft raised cards: `rounded-2xl`, hairline border, layered navy-tinted shadows (light) / darker transparent shadows + lighter border (dark). Subtle dot-grid background pattern and a faint teal radial glow behind the hero only.
- **Logo**: lucide `Ship` icon in a rounded-square badge with a navy→teal gradient, plus the wordmark. Same badge used for favicon (SVG), apple-touch icon, manifest icons, OG image and the PDF/PNG export header.
- **Reference points**: Stripe and Linear: crisp type, precise alignment, refined motion, dark-mode polish.
- **Anti-references**: government/customs form portals (gray, dense, bureaucratic); generic AI SaaS (purple gradients, emoji bullets, stock 3D blobs); crypto/casino (neon, over-animated, low trust).

## Existing Patterns

- **Stack**: Vite + React 19 (React Compiler), Tailwind CSS v4 (`@theme inline` in `src/index.css`), shadcn `new-york` style, `radix-ui`, `lucide-react`, `tw-animate-css`, react-router v8 (lazy routes), react-i18next (en / he / ar, RTL enabled in `components.json`).
- **Typography**: no web font loaded today (UI renders in system font). `@fontsource/noto-sans`, `noto-sans-hebrew`, `ibm-plex-sans-arabic` installed but used only by the PDF renderer (`src/features/export/pdf/fonts.ts`). `tabular-nums` and `<bdi dir="ltr">` already used on money values: keep.
- **Colors**: stock shadcn neutral oklch tokens in `:root` and `.dark` (`src/index.css`); `.dark` exists but nothing toggles it. `@custom-variant dark (&:is(.dark *))` already defined.
- **Radius**: `--radius: 0.625rem` with derived `--radius-sm…4xl`.
- **Spacing / layout**: Tailwind default scale; shell `max-w-5xl px-4`; calculator `max-w-3xl` with a sticky bottom total bar (`pb-24`).
- **Components**: `src/components/ui/`: accordion, alert-dialog, button, card, dialog, input, label, radio-group, sheet, tabs, toggle, toggle-group. Feature components in `src/features/*` (calculator `Section` wraps `Card`; `SummaryCards`, `Breakdown`, `Formula` in result; `SavedCalculationCard` in history; guides tabs + `Lightbox`). Shell in `src/app/` (`AppLayout`, `MobileNav`, `SiteFooter`, `nav.ts`, `usePageTitle`).
- **Head / SEO**: static meta + OG/Twitter in `index.html`, `public/og-image.png`, `public/favicon.svg`; `usePageTitle` sets `document.title` per route.

## Component Inventory

| Component | Status | Notes |
| --- | --- | --- |
| Design tokens (`src/index.css`) | Modify | Navy/slate/teal oklch palette, light + dark, shadows, motion durations/easings, type ramp, font stacks per script |
| `ThemeProvider` + `useTheme` | New | system / light / dark, persisted in `localStorage` (try/catch), toggles `.dark` on `<html>`, no flash (inline pre-hydration script in `index.html`) |
| `ThemeToggle` | New | Header icon button (Sun/Moon/Monitor) with animated icon swap; also a radio group in Settings |
| `LogoBadge` / `Logo` | New | Lucide `Ship` in gradient rounded square + wordmark; sizes sm/md/lg |
| `AppLayout` header | Modify | Sticky glass bar (`backdrop-blur`, translucent bg), shrinks + gains border/shadow on scroll; animated active pill (Motion `layoutId`) |
| `MobileNav` | Modify | Animated sheet, staggered links, theme + language controls inside |
| `LanguageSwitcher` | Modify | Restyle to match header controls |
| `SiteFooter` | Modify | Navy multi-column: brand + tagline, Tools, Info/legal, contact email, Bank of Israel rates note, disclaimer, version, © |
| `Hero` | New | On `/` and `/air-shipment`: headline, one-line value prop, Standard/Air mode switcher (animated segmented control), 3 trust chips; dot-grid + teal glow |
| `TrustChip` | New | Icon + label pill (live rates with pulsing dot, free, no signup) |
| `PageTransition` | New | Motion `AnimatePresence` fade/slide on route change, direction-aware for RTL |
| `Reveal` / stagger helpers | New | In-view fade-up for sections and card lists; reduced-motion aware |
| `AnimatedNumber` | New | Count-up/tween for totals (result summary + sticky total bar); respects reduced motion; keeps `tabular-nums` and final value in DOM for tests/a11y |
| `Card` (ui) | Modify | rounded-2xl, hairline border, layered shadow tokens, optional hover lift |
| `Button` (ui) | Modify | Navy primary, teal focus ring, press scale micro-interaction |
| `Input` / `Label` | Modify | Taller hit area, focus ring teal, error state styling |
| `Tabs` / `ToggleGroup` | Modify | Animated active indicator (Motion `layoutId`) |
| Calculator `Section` | Modify | Section number/icon, title style, staggered entrance |
| Sticky total bar | Modify | Glass surface, `AnimatedNumber`, subtle pulse on change |
| `SummaryCards` | Modify | Primary total card navy with teal accent edge; count-up; staggered reveal |
| `Breakdown` / `Formula` | Modify | Grid-aligned rows, section dividers, monospace-feel tabular alignment |
| `SavedCalculationCard` / `HistoryView` | Modify | New card style, empty state illustration (lucide composition), list stagger, exit animation on delete |
| `GuidesView` + tabs + `Lightbox` | Modify | Tab indicator, card style, search field style, image hover zoom, lightbox open/close animation |
| `AboutView`, `ContactView`, `LegalView`, `SettingsView` | Modify | Page header pattern, prose styles, settings adds theme control |
| `PageHeader` | New | Shared title + description + optional icon for non-calculator pages |
| `EmptyState` | Modify | Shared, icon in tinted badge |
| `NotFoundPage` | Modify | Branded 404 (ship icon, "lost at sea" tone) |
| `useSeo` (extends `usePageTitle`) | New | Per-route title, description, canonical, hreflang alternates, OG/Twitter tags, from `VITE_SITE_URL` |
| JSON-LD | New | `WebApplication` (site-wide, `index.html`), `FAQPage` on Guides terms where suitable |
| `robots.txt`, `sitemap.xml`, `site.webmanifest` | New | Static in `public/`; sitemap generated at build from route list + `VITE_SITE_URL` |
| Favicon set + OG image | Modify/New | SVG favicon, `apple-touch-icon.png`, manifest 192/512, maskable; regenerate `og-image.png` with new brand (sharp script) |
| PDF/PNG export header | Modify | Logo badge + navy accent rule only; body stays black on white |

## Key Interactions

- **Theme**: first load follows OS; toggle cycles/chooses system → light → dark; icon morphs (rotate + fade); colors cross-fade 200ms (disabled under reduced motion); choice persists.
- **Header on scroll**: at top: transparent, tall (64px). After ~8px scroll: glass background, border, shadow, height 56px; transitions 200ms.
- **Active nav**: teal-tinted pill slides between links with spring (`layoutId`), not a jump.
- **Route change**: outgoing page fades out (120ms), incoming fades + rises 8px (220ms). Direction of any horizontal offset flips in RTL.
- **Hero mode switcher**: segmented control Standard | Air Shipment; selected thumb slides; navigates to the route (state stays in URL).
- **Form sections**: stagger in on first load (40ms apart). Focused input gets teal ring; invalid gets destructive border + message fade-in.
- **Sticky total**: value tweens to new number on change (~400ms ease-out); brief teal highlight flash.
- **Result reveal**: summary cards stagger in, primary total counts up from 0 (~800ms), breakdown sections fade up in view.
- **History**: cards stagger in; deleted card collapses and fades (layout animation); empty state fades in.
- **Guides**: tab indicator slides; content cross-fades; images scale 1.03 on hover; lightbox scales from 0.96 + backdrop fade.
- **Buttons**: hover lift via shadow; press scale 0.98.
- **Live rates chip**: small pulsing teal dot while rates are fresh (static under reduced motion).

## Responsive Behavior

Mobile-first. Breakpoints: Tailwind defaults (`sm` 640, `md` 768, `lg` 1024).

- **< md**: header shows logo badge + theme + language + menu button; nav moves to animated `Sheet` (side = `inline-end`, mirrors in RTL). Hero: stacked, headline ~32px, chips wrap, mode switcher full width. Calculator sections full width, single column. Sticky total bar full width at bottom (safe-area inset). Footer collapses to stacked columns (brand, then 2-column Tools/Info).
- **md–lg**: inline nav pills visible; hero headline ~44px; form max-w-3xl centered; summary cards 3 columns.
- **≥ lg**: shell max-w-6xl; hero allows a side visual (decorative grid/glow) on the inline-end side; footer 4 columns.
- Header shrink-on-scroll applies at all sizes.

## Accessibility Requirements

- WCAG 2.2 AA: text contrast ≥ 4.5:1 (≥ 3:1 for large text and UI boundaries) in both themes; teal accent must pass on white and on navy where used for text, else used only as fill with navy/white text.
- Visible focus on every interactive element (2px teal ring + offset), never removed.
- Full keyboard operation: nav, theme toggle, mode switcher, tabs, lightbox (focus trap + Escape), mobile sheet.
- `prefers-reduced-motion: reduce` → no transforms, no count-up (final value shown immediately), no pulse; opacity-only or instant.
- `AnimatedNumber` exposes only the final value to assistive tech (`aria-live` region keeps current behavior; animated digits `aria-hidden`).
- Theme toggle has an accessible name reflecting current state; logo link has accessible name.
- RTL parity: logical properties only (`ps/pe/ms/me/start/end`); directional motion mirrored; numbers stay `dir="ltr"` inside `<bdi>`.
- Target sizes ≥ 24×24px (2.2 AA), primary controls 44px on touch.
- Existing test roles, labels and selectors unchanged; full vitest suite stays green.

## Performance Budget

- Initial JS increase ≤ ~60KB gzip over current main bundle (Motion included; import from `motion/react`, use `LazyMotion` + `domAnimation` features where possible).
- Fonts: Inter Variable Latin subset preloaded; Hebrew/Arabic faces loaded via `unicode-range` only when used.
- LCP < 2.5s on simulated 4G; no layout shift from header shrink or fonts (CLS < 0.1).
- Lighthouse ≥ 90 on Performance, Accessibility, Best Practices, SEO.

## Success Criteria

- Visitors trust the numbers enough to quote them; site looks credible enough for brokers to share with clients.
- First result reachable in under 60 seconds; calculator form visible within one scroll on mobile.
- Lighthouse 90+ on all four categories; WCAG 2.2 AA spot-checks pass in en and he/ar, light and dark.

## Out of Scope

- Changing calculation logic, validation rules, storage formats, URLs/routes or i18n keys' meaning (new keys may be added for new copy in all 3 languages).
- Separate marketing landing page, features/how-it-works/FAQ sections on home.
- SSR or build-time prerendering.
- Custom hand-drawn SVG logo (lucide badge chosen; custom mark can come later).
- Restyling PDF/PNG body or print CSS beyond the brand header.
- Analytics, accounts, backend changes, rates API changes.
- New guide content or legal copy rewrites.
