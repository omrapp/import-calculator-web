import { describe, expect, it } from 'vitest';

// Logical utilities (ms-, pe-, start-, text-start) keep layouts correct in RTL.
const PHYSICAL =
  /(?<![\w-])-?(?:ml|mr|pl|pr|left|right|rounded-[lr]|border-[lr]|text-left|text-right)(?:-[\w./[\]]+)?(?![\w-])/;

const sources = import.meta.glob<string>(
  ['/src/app/**/*.tsx', '/src/features/**/*.tsx', '/src/pages/**/*.tsx'],
  { query: '?raw', import: 'default', eager: true },
);

describe('RTL-safe styling', () => {
  it('uses no physical-direction Tailwind classes', () => {
    const offenders = Object.entries(sources).flatMap(([file, source]) =>
      [...source.matchAll(/className=(?:"([^"]*)"|{[^}]*?'([^']*)')/g)]
        .map(match => match[1] ?? match[2])
        .filter(classes => classes.split(/\s+/).some(c => PHYSICAL.test(c)))
        .map(classes => `${file}: ${classes}`),
    );
    expect(offenders).toEqual([]);
  });
});
