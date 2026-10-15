/**
 * Downloads the free shipping photos (Pexels license: free to use, no
 * attribution required) and writes responsive AVIF/WebP files to
 * public/photos, plus their intrinsic sizes and source credits.
 *
 *   npm exec -- tsx scripts/fetch-photos.ts
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

/** Photo name → Pexels photo id. */
const PHOTOS = {
  'ship-entering-port': 3840441,
  'container-yard-aerial': 3063470,
  'ship-at-berth-aerial': 1554646,
  'cargo-plane': 912050,
  'packing-box': 4246120,
  'calculator-dollars': 4386339,
  'container-rows-aerial': 1427107,
  'port-aerial': 2226458,
  'port-at-night': 753331,
  'container-terminal': 2231742,
  'ship-and-cranes': 906982,
  'ship-at-sunset': 799091,
} as const;

const outDir = path.resolve('public/photos');
const dataDir = path.resolve('src/components/photo');
const WIDTHS = [800, 1600] as const;

const sourceUrl = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?w=2400`;

async function main() {
  await mkdir(outDir, { recursive: true });
  const sizes: Record<string, [number, number]> = {};
  const credits: Record<string, string> = {};

  for (const [name, id] of Object.entries(PHOTOS)) {
    const response = await fetch(sourceUrl(id));
    if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
    const image = sharp(Buffer.from(await response.arrayBuffer())).rotate();
    const { width = 0, height = 0 } = await image.metadata();
    const largest = Math.min(width, WIDTHS.at(-1)!);
    // Intrinsic size of the largest file, so pages reserve space.
    sizes[name] = [largest, Math.round((height * largest) / width)];
    credits[name] = `https://www.pexels.com/photo/${id}/`;
    for (const w of WIDTHS) {
      const resized = image
        .clone()
        .resize({ width: w, withoutEnlargement: true });
      await resized
        .clone()
        .avif({ quality: 42 })
        .toFile(path.join(outDir, `${name}-${w}.avif`));
      await resized
        .clone()
        .webp({ quality: 62 })
        .toFile(path.join(outDir, `${name}-${w}.webp`));
    }
    console.log(`✓ ${name}`);
  }

  await writeFile(
    path.join(dataDir, 'photos.json'),
    JSON.stringify({ sizes, credits }, null, 2) + '\n',
  );
}

await main();
