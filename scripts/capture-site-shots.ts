/**
 * Captures a homepage screenshot of every site on the Websites page with
 * headless Chrome and writes card-sized AVIF/WebP files to public/sites,
 * plus the list of ids that have one (cards without fall back to the
 * generated category art).
 *
 *   npm exec -- tsx scripts/capture-site-shots.ts [id ...]
 *
 * Pass ids to recapture only those. Set CHROME to override the binary path.
 */
import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import sharp from 'sharp';

import { tradingWebsites } from '../src/features/guides/data/websites';

const run = promisify(execFile);
const CHROME =
  process.env.CHROME ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const VIEWPORT = [1280, 800] as const;
const OUT_WIDTH = 640;
/**
 * Sites whose homepage can't be captured usefully: bot walls / captcha
 * (gov.il, Europages, IndiaMART, Payoneer, Made-in-China, Drewry,
 * VesselFinder) or a cookie/video overlay covering the page. Their cards
 * keep the generated category art. Checked 2026-10-15.
 */
const SKIP = new Set([
  ...['3', '4', '5', '6', '8', '9', '18', '20', '21', '22'],
  ...['26', '27', '28', '31', '33'],
]);

const outDir = path.resolve('public/sites');
const listFile = path.resolve('src/features/guides/data/site-shots.json');

async function capture(url: string, file: string) {
  await run(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--mute-audio',
      '--lang=en-US',
      `--window-size=${VIEWPORT.join(',')}`,
      '--virtual-time-budget=20000',
      `--screenshot=${file}`,
      url,
    ],
    { timeout: 45_000 },
  );
  return readFile(file);
}

async function main() {
  const only = new Set(process.argv.slice(2));
  const sites = tradingWebsites.filter(
    s => !SKIP.has(s.id) && (only.size === 0 || only.has(s.id)),
  );
  await mkdir(outDir, { recursive: true });
  const tmp = await mkdtemp(path.join(tmpdir(), 'site-shots-'));
  const existing: string[] = JSON.parse(
    await readFile(listFile, 'utf8').catch(() => '[]'),
  );
  const done = new Set(existing.filter(id => !SKIP.has(id)));

  for (const site of sites) {
    try {
      const png = await capture(site.url, path.join(tmp, `${site.id}.png`));
      const img = sharp(png).resize({ width: OUT_WIDTH });
      await img
        .clone()
        .avif({ quality: 50 })
        .toFile(path.join(outDir, `${site.id}.avif`));
      await img
        .clone()
        .webp({ quality: 70 })
        .toFile(path.join(outDir, `${site.id}.webp`));
      done.add(site.id);
      console.log(`✓ ${site.id} ${site.url}`);
    } catch (error) {
      console.warn(`✗ ${site.id} ${site.url}: ${(error as Error).message}`);
    }
  }

  await rm(tmp, { recursive: true, force: true });
  const ids = [...done].sort((a, b) => Number(a) - Number(b));
  await writeFile(listFile, `${JSON.stringify(ids)}\n`);
  console.log(`${ids.length} screenshots listed in ${listFile}`);
}

await main();
