/**
 * Writes the brand assets from one badge definition (lucide `Ship` on a
 * navy → teal rounded square, matching src/components/brand/LogoBadge.tsx):
 * favicon.svg, apple-touch-icon.png, icon-192/512.png, icon-maskable-512.png
 * and og-image.png (1200×630) in public/.
 *
 *   npm exec -- tsx scripts/make-brand-assets.ts
 */
import { writeFile } from 'node:fs/promises';

import sharp from 'sharp';

/** Hex equivalents of `--brand` and light `--highlight` in src/index.css. */
const NAVY = '#193365';
const TEAL = '#25a4b1';
const INK = '#0c1936';

/** lucide-react `ship` icon paths (24×24 grid, stroke icon). */
const SHIP = [
  'M12 2v2',
  'M12 9.189V13',
  'M19 12V6a2 2 0 00-2-2H7a2 2 0 00-2 2v6',
  'M19.38 19A11.6 11.6 0 0021 13l-8.188-3.639a2 2 0 00-1.624 0L3 13.001a11.6 11.6 0 002.81 7.76',
  'M2 20c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1',
];

const ship = (transform: string) =>
  `<g transform="${transform}" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${SHIP.map(d => `<path d="${d}"/>`).join('')}</g>`;

const gradient = (id: string) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${NAVY}"/><stop offset="1" stop-color="${TEAL}"/></linearGradient>`;

/** 32×32 badge: rounded square, soft top highlight, 20px icon. */
const badge = (
  rounded = true,
) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>${gradient('g')}<linearGradient id="h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".18"/><stop offset=".5" stop-color="#ffffff" stop-opacity="0"/></linearGradient></defs>
  <rect width="32" height="32" rx="${rounded ? 8 : 0}" fill="url(#g)"/>
  <rect width="32" height="32" rx="${rounded ? 8 : 0}" fill="url(#h)"/>
  ${ship('translate(6 6) scale(.8333)')}
</svg>`;

/** Full-bleed for maskable icons: icon inside the 80% safe zone. */
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>${gradient('g')}</defs>
  <rect width="32" height="32" fill="url(#g)"/>
  ${ship('translate(9 9) scale(.5833)')}
</svg>`;

const png = (svg: string, size: number, file: string) =>
  sharp(Buffer.from(svg), { density: 72 * Math.ceil(size / 32) })
    .resize(size, size)
    .png()
    .toFile(`public/${file}`);

/** Left-to-right marks keep the order English, Hebrew, Arabic under bidi reordering. */
const LANGUAGES = ['English', 'עברית', 'العربية'].join('\u200E · \u200E');

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.4" fill="#ffffff" fill-opacity=".07"/></pattern>
    <radialGradient id="glow" cx="1" cy="0" r=".9"><stop offset="0" stop-color="${TEAL}" stop-opacity=".45"/><stop offset="1" stop-color="${TEAL}" stop-opacity="0"/></radialGradient>
    ${gradient('g')}
  </defs>
  <rect width="1200" height="630" fill="${INK}"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="80" y="80" width="112" height="112" rx="28" fill="url(#g)"/>
  ${ship('translate(108 108) scale(2.3333)')}
  <text x="80" y="320" font-family="Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="88" font-weight="700" letter-spacing="-3" fill="#ffffff">Import Calculator</text>
  <text x="80" y="392" font-family="Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="34" fill="#c7d2de">Landed cost of importing into Israel: CIF, duty,</text>
  <text x="80" y="438" font-family="Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="34" fill="#c7d2de">purchase tax, VAT and expenses, in ₪.</text>
  <g font-family="Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="24" font-weight="600">
    <rect x="80" y="500" width="336" height="48" rx="24" fill="#ffffff" fill-opacity=".08" stroke="#ffffff" stroke-opacity=".14"/>
    <circle cx="108" cy="524" r="6" fill="#3aced6"/>
    <text x="126" y="532" fill="#ebeff4">Live Bank of Israel rates</text>
    <rect x="432" y="500" width="96" height="48" rx="24" fill="#ffffff" fill-opacity=".08" stroke="#ffffff" stroke-opacity=".14"/>
    <text x="480" y="532" fill="#ebeff4" text-anchor="middle">Free</text>
    <rect x="544" y="500" width="160" height="48" rx="24" fill="#ffffff" fill-opacity=".08" stroke="#ffffff" stroke-opacity=".14"/>
    <text x="624" y="532" fill="#ebeff4" text-anchor="middle">No signup</text>
  </g>
  <text x="1120" y="532" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="26" fill="#9aa6b4" text-anchor="end">${LANGUAGES}</text>
</svg>`;

await writeFile('public/favicon.svg', badge());
await png(badge(), 180, 'apple-touch-icon.png');
await png(badge(), 192, 'icon-192.png');
await png(badge(), 512, 'icon-512.png');
await png(maskable, 512, 'icon-maskable-512.png');
await sharp(Buffer.from(og)).png().toFile('public/og-image.png');
console.log(
  '✓ public/{favicon.svg,apple-touch-icon.png,icon-*.png,og-image.png}',
);
