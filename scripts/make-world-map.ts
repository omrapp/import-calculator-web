/**
 * Builds public/maps/world-dots.svg: a dot-matrix world map in an
 * equirectangular projection (x = lon + 180, y = 80 - lat; viewBox 360×140),
 * from Natural Earth's public-domain 110m land polygons. Pages tint it with
 * CSS `mask-image`, so one file serves light and dark themes.
 *
 *   npm exec -- tsx scripts/make-world-map.ts
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SOURCE =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson';
const STEP = 2.5;
const NORTH = 80;
const SOUTH = -60;

type Ring = [number, number][];

const inRing = (lon: number, lat: number, ring: Ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    )
      inside = !inside;
  }
  return inside;
};

async function main() {
  const geo = (await (await fetch(SOURCE)).json()) as {
    features: { geometry: { type: string; coordinates: unknown } }[];
  };
  // Outer rings only; 110m land has no lakes worth punching out.
  const rings: Ring[] = geo.features.flatMap(({ geometry }) =>
    geometry.type === 'Polygon'
      ? [(geometry.coordinates as Ring[])[0]]
      : (geometry.coordinates as Ring[][]).map(polygon => polygon[0]),
  );

  const dots: string[] = [];
  for (let lat = NORTH - STEP / 2; lat > SOUTH; lat -= STEP) {
    for (let lon = -180 + STEP / 2; lon < 180; lon += STEP) {
      if (rings.some(ring => inRing(lon, lat, ring)))
        dots.push(`M${lon + 180} ${NORTH - lat}h0`);
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 ${NORTH - SOUTH}"><path d="${dots.join('')}" stroke="#000" stroke-width="1.6" stroke-linecap="round"/></svg>\n`;
  const out = path.resolve('public/maps/world-dots.svg');
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, svg);
  console.log(`✓ ${dots.length} dots → ${out}`);
}

await main();
