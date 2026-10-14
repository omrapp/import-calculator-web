/// <reference types="node" />
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { galleryItems } from './data/gallery';
import { presentationSlides } from './data/presentation';

const dir = path.resolve('public/guides');
const files = new Set(readdirSync(dir));
const variants = (image: string) =>
  [640, 1600].flatMap(width =>
    ['avif', 'webp'].map(
      format => `${path.basename(image)}-${width}.${format}`,
    ),
  );

describe('guide images', () => {
  it.each([...presentationSlides, ...galleryItems].map(i => [i.id, i.image]))(
    '%s has AVIF and WebP at both widths',
    (_, image) => {
      for (const file of variants(image)) expect(files).toContain(file);
    },
  );

  it('offers every gallery document at full size', () => {
    for (const item of galleryItems) {
      expect(files).toContain(`${path.basename(item.image)}-full.webp`);
    }
  });

  it('stays under 12 MB in total', () => {
    const bytes = [...files].reduce(
      (sum, file) => sum + statSync(path.join(dir, file)).size,
      0,
    );
    expect(bytes).toBeLessThan(12 * 1024 * 1024);
  });
});
