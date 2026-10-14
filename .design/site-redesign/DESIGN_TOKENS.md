# Design Tokens: Site Redesign (IMCL-11)

Source of truth: `src/index.css` (Tailwind v4 `@theme` + CSS custom properties). This file documents intent and verified contrast; the CSS wins if they drift.

**Philosophy**: Swiss / International Typographic, tempered by Dieter Rams (from `DESIGN_BRIEF.md`). Strict scale, restrained palette, numbers as the primary type element, functional detail only.

## Deviations from the design-tokens skill template

| Template says | We do | Why |
| --- | --- | --- |
| `[data-theme="dark"]` + `prefers-color-scheme` media | `.dark` class on `<html>` (existing shadcn `@custom-variant dark`) | Tailwind `dark:` utilities and shadcn components already key off `.dark`. The ThemeProvider resolves "system" via `matchMedia` and an inline pre-paint script in `index.html` applies the class before first paint (no flash). |
| `--color-bg-primary`, `--color-text-primary`… | shadcn names (`--background`, `--foreground`, `--primary`…) + new semantic extras | 12 shadcn primitives and every feature component already use these names; renaming would touch unrelated code. |
| Custom `--space-*` scale | Tailwind's default spacing (`--spacing: 0.25rem`, 4px base) | Swiss = 4px base, which Tailwind already is. Use `p-4`, `gap-6`, etc. |
| Custom breakpoints | Tailwind defaults (`sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280) | Unchanged; QA viewports 375 / 768 / 1024 / 1440. |
| Display font ≠ Inter (frontend-design guidance) | Inter Variable | User decision. Offset with tight display tracking, the `display`/`title`/`figure` ramp, `cv11`/`ss01` features and tabular figures. |

## Color

60 / 30 / 10: **navy** (trust) / **white + slate** (structure) / **sky-teal** (live, interactive, final).

### Light

| Token | oklch | ≈ hex | Role |
| --- | --- | --- | --- |
| `--background` | 0.985 0.004 248 | #f8fafd | Page |
| `--card` / `--popover` | 1 0 0 | #ffffff | Raised surfaces |
| `--foreground` | 0.22 0.045 262 | #0f1a2f | Navy ink text |
| `--primary` / `--brand` | 0.33 0.095 262 | #193365 | Primary buttons, brand badge, summary total |
| `--primary-foreground` | 0.985 0.004 248 | #f8fafd | Text on navy |
| `--secondary` / `--muted` | 0.955 0.008 250 | #ecf1f5 | Wells, secondary buttons |
| `--muted-foreground` | 0.5 0.03 257 | #596475 | Secondary text |
| `--border` | 0.915 0.012 252 | #dde4eb | Hairlines (decorative) |
| `--input` | 0.66 0.02 255 | — | Form-control boundary (3:1) |
| `--accent` | 0.955 0.03 205 | #daf6fa | Teal tint: hover, active nav pill |
| `--accent-foreground` | 0.42 0.07 215 | #0d5665 | Text on teal tint |
| `--highlight` | 0.66 0.105 205 | #25a4b1 | Teal fill: live dot, glow, indicator bars. **Never** white text on it |
| `--highlight-foreground` | 0.22 0.045 262 | #0f1a2f | Navy text on teal fill |
| `--link` / `--ring` / `--info` | 0.5 0.085 215 | #0e6f81 | Links, focus ring |
| `--destructive` | 0.577 0.215 27 | #dc2627 | Errors |
| `--success` | 0.52 0.1 160 | #277a55 | Success |
| `--warning` | 0.55 0.11 65 | #9d621e | Warnings |
| `--footer` | 0.22 0.06 264 | #0c1936 | Footer band |
| `--footer-foreground` / `--footer-muted` | 0.86 / 0.72 | #c7d2de / — | Footer text |

### Dark (midnight navy, cool; not an inversion)

| Token | oklch | ≈ hex | Role |
| --- | --- | --- | --- |
| `--background` | 0.19 0.035 262 | #0b1423 | Page |
| `--card` / `--popover` | 0.23 0.04 262 | #121d30 | Raised surfaces |
| `--foreground` | 0.95 0.008 250 | #ebeff4 | Off-white text |
| `--primary` | 0.82 0.1 205 | #6cd7e3 | Primary action flips to sky-teal so it reads on navy |
| `--primary-foreground` | 0.2 0.045 262 | #0a152a | Navy text on teal button |
| `--brand` | 0.33 0.095 262 | #193365 | Logo badge stays navy (gradient to teal) |
| `--muted` / `--secondary` | 0.27 0.035 262 | #1d2638 | Wells |
| `--muted-foreground` | 0.72 0.025 255 | #9aa6b4 | Secondary text |
| `--border` | 0.32 0.035 262 | #293345 | Hairlines; carry edges since shadows are weak on dark |
| `--input` | 0.52 0.035 262 | — | Form-control boundary (3:1) |
| `--accent` / `--accent-foreground` | 0.3 0.045 215 / 0.86 0.07 205 | #0c333c / #9adfe7 | Teal tint + text |
| `--highlight` / `--link` / `--ring` | 0.78 0.12 200 / 0.8 0.11 200 | #3aced6 / #56d3da | Teal |
| `--destructive` / `--success` / `--warning` | 0.7 0.19 22 / 0.75 0.13 160 / 0.8 0.14 75 | | Status |
| `--footer` | 0.15 0.03 264 | #030713 | Footer sinks below page |

### Verified contrast (WCAG 2.2, computed oklch → sRGB)

| Pair | Light | Dark | Requirement |
| --- | --- | --- | --- |
| foreground / background | 16.6 | 16.0 | 4.5 ✅ |
| foreground / card | 17.4 | 14.6 | 4.5 ✅ |
| muted-foreground / card | 6.0 | 6.8 | 4.5 ✅ |
| muted-foreground / muted | 5.3 | 6.1 | 4.5 ✅ |
| primary-foreground / primary | 11.9 | 10.8 | 4.5 ✅ |
| accent-foreground / accent | 7.3 | 9.0 | 4.5 ✅ |
| link / card | 5.8 | 9.4 | 4.5 ✅ |
| highlight-foreground / highlight | 5.8 | 9.5 | 4.5 ✅ |
| destructive / card | 4.8 | 5.8 | 4.5 ✅ |
| success / card | 5.2 | 8.0 | 4.5 ✅ |
| warning / card | 5.0 | 8.9 | 4.5 ✅ |
| footer-foreground / footer | 11.4 | 11.6 | 4.5 ✅ |
| footer-muted / footer | 7.0 | 6.9 | 4.5 ✅ |
| input / card (boundary) | 3.1 | 3.1 | 3.0 ✅ |
| ring / card (focus) | 5.8 | 8.9 | 3.0 ✅ |
| highlight / card (fill only) | 3.0 | 8.9 | decorative, no text |
| border / card | 1.3 | 1.3 | decorative hairline only, not a control boundary |

Rule: in light mode `--highlight` is a fill or decoration only; teal text uses `--link`/`--accent-foreground`. Focus rings use `--ring` at full opacity (components must not dim it below 3:1).

## Typography

- `--font-sans`: `Inter Variable` → `Noto Sans Hebrew` → `IBM Plex Sans Arabic` → system. Per-glyph fallback means Hebrew/Arabic text automatically picks its script face; `@fontsource` `unicode-range` subsets download only when used.
- Body: Tailwind `text-base` (16px / 1.5). Features `cv11` (single-storey a off), `ss01` (open digits).
- All figures: `font-variant-numeric: tabular-nums` on `bdi, data, output, td, dd, .num` (plus existing `tabular-nums` classes).

| Utility | Size | Line height | Tracking | Weight | Use |
| --- | --- | --- | --- | --- | --- |
| `text-display` | clamp(2rem → 3.25rem) | 1.08 | -0.035em | 700 | Hero H1 |
| `text-title` | clamp(1.5rem → 2rem) | 1.2 | -0.025em | 650 | Page H1 (PageHeader) |
| `text-figure` | clamp(1.75rem → 2.5rem) | 1.1 | -0.02em | 700 | Total incl. VAT, big numbers |
| `text-overline` | 0.75rem | 1rem | +0.08em | 600 | Section numbers, uppercase labels (Latin only; no case in he/ar) |
| Tailwind `text-xs…text-xl` | default | default | | | UI and body |

Headings h1–h3 get `--tracking-heading` (-0.02em) and `text-wrap: balance`.

## Spacing & Layout

- Spacing: Tailwind 4px scale. Rhythm: field gap 8–12px, section gap 16–24px, page section gap 48–64px.
- Widths: `max-w-page` 72rem (shell), `max-w-form` 48rem (calculator), `max-w-prose-tight` 42rem (legal/about prose).
- Radius: `--radius` 0.75rem → `rounded-lg` 12px (inputs, buttons), `rounded-xl` ≈ 17px (cards), `rounded-2xl` ≈ 22px (hero panel, summary total), `rounded-full` (chips, nav pill).

## Elevation

Navy-tinted, layered (ambient + key). Tailwind `shadow-xs…shadow-xl` map to `--elevation-*` and swap per theme.

| Token | Use |
| --- | --- |
| `shadow-xs` | Inputs, chips |
| `shadow-sm` | Cards at rest |
| `shadow-md` | Card hover, sticky header (scrolled), sticky total bar |
| `shadow-lg` | Popovers, mobile sheet, primary total card |
| `shadow-xl` | Dialogs, lightbox |

Dark: black, more transparent-looking but stronger alpha, since edges come from `--border`.

## Surfaces & Atmosphere

- `bg-surface-glass` + `backdrop-blur-md`: sticky header and total bar.
- `bg-overlay`: dialog/sheet backdrops.
- `bg-dot-grid`: 20px dot grid (navy 9% light / off-white 6% dark), hero only.
- `bg-hero-glow`: teal radial glow on the inline-end top corner; mirrors in RTL.
- `::selection`: teal 30%.

## Motion

CSS tokens (`--duration-*`) plus Tailwind easings; Motion (JS) mirrors them in `src/lib/motion.ts` (built in phase 6).

| Token | Value | Use |
| --- | --- | --- |
| `--duration-instant` | 80ms | Press feedback |
| `--duration-fast` | 150ms | Hover, color, exits |
| `--duration-normal` | 220ms | Enter, route change, tab content |
| `--duration-slow` | 400ms | Number tween, sheet, lightbox |
| `--duration-count` | 800ms | Result total count-up |
| `ease-out-quart` | (0.25, 1, 0.5, 1) | Default entry |
| `ease-out-expo` | (0.16, 1, 0.3, 1) | Large entries (hero, sheet) |
| `ease-in-quart` | (0.5, 0, 0.75, 0) | Exits |
| `ease-in-out-quart` | (0.76, 0, 0.24, 1) | Theme cross-fade |
| Motion springs (JS) | `{ stiffness: 500, damping: 40 }` nav pill; `{ stiffness: 300, damping: 30 }` layout | Shared-layout indicators |

Rules: exits faster than enters; stagger 40ms (max 8 items, then batch); translate ≤ 8px; no overshoot on numbers or data. Keyframes: `animate-live-dot` (rates freshness), `animate-highlight-flash` (total updated).

**Reduced motion**: global CSS clamps animations/transitions to ~0; Motion uses `MotionConfig reducedMotion="user"`; `AnimatedNumber` renders the final value immediately.
