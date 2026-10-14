/// <reference types="node" />
import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const html = readFileSync('index.html', 'utf8');
const png = readFileSync('public/og-image.png');

describe('index.html meta', () => {
  it.each([
    'property="og:title"',
    'property="og:description"',
    'property="og:image"',
    'property="og:type"',
    'name="twitter:card" content="summary_large_image"',
    'name="description"',
  ])('has %s', tag => {
    expect(html).toContain(tag);
  });

  it('ships a 1200×630 preview image', () => {
    // PNG IHDR: width and height are big-endian at bytes 16 and 20.
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  });
});
