/**
 * Writes public/og-image.png (1200×630), the link preview image.
 *
 *   npm exec -- tsx scripts/make-og-image.ts
 */
import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#111827"/>
  <rect x="80" y="80" width="120" height="120" rx="24" fill="#ffffff"/>
  <text x="140" y="165" font-family="Helvetica, Arial, sans-serif" font-size="72" font-weight="700" fill="#111827" text-anchor="middle">₪</text>
  <text x="80" y="330" font-family="Helvetica, Arial, sans-serif" font-size="84" font-weight="700" fill="#ffffff">Import Calculator</text>
  <text x="80" y="410" font-family="Helvetica, Arial, sans-serif" font-size="36" fill="#d1d5db">Landed cost of importing into Israel:</text>
  <text x="80" y="460" font-family="Helvetica, Arial, sans-serif" font-size="36" fill="#d1d5db">CIF, customs duty, purchase tax, VAT and expenses</text>
  <text x="80" y="560" font-family="Helvetica, Arial, sans-serif" font-size="28" fill="#9ca3af">English · עברית · العربية</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og-image.png');
console.log('✓ public/og-image.png');
