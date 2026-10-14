/**
 * Converts the React Native app's guide slides and document examples into
 * responsive AVIF/WebP files under public/guides. The app repo is only read.
 *
 *   npm exec -- tsx scripts/convert-guides.ts [path-to-rn-app]
 */
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

const appRoot =
  process.argv[2] ??
  '../../react-native/InternationalTradeCalculator/TradeCalculator';
const outDir = path.resolve('public/guides');
const WIDTHS = [640, 1600] as const;
const sizesFile = path.resolve('src/features/guides/data/image-sizes.json');
const sizes: Record<string, [number, number]> = {};

const slug = (file: string) =>
  path
    .parse(file)
    .name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

async function convert(file: string, withFull: boolean) {
  const name = slug(file);
  const image = sharp(file).flatten({ background: '#ffffff' });
  const { width = 0, height = 0 } = await image.metadata();
  // Intrinsic size, so pages reserve space before images load.
  sizes[name] = [width, height];
  for (const width of WIDTHS) {
    const resized = image.clone().resize({ width, withoutEnlargement: true });
    await resized
      .clone()
      .avif({ quality: 50 })
      .toFile(path.join(outDir, `${name}-${width}.avif`));
    await resized
      .clone()
      .webp({ quality: 75 })
      .toFile(path.join(outDir, `${name}-${width}.webp`));
  }
  // Document examples are also offered for download at full size.
  if (withFull) {
    await image
      .clone()
      .webp({ quality: 85 })
      .toFile(path.join(outDir, `${name}-full.webp`));
  }
  console.log(`✓ ${name}`);
}

async function main() {
  await mkdir(outDir, { recursive: true });
  for (const [folder, withFull] of [
    ['assets/guides', false],
    ['assets/examples', true],
  ] as const) {
    const dir = path.resolve(appRoot, folder);
    for (const file of (await readdir(dir)).sort()) {
      if (/\.(jpe?g|png)$/i.test(file)) {
        await convert(path.join(dir, file), withFull);
      }
    }
  }
  await writeFile(sizesFile, JSON.stringify(sizes, null, 2) + '\n');
}

await main();
