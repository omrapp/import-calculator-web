import { describe, expect, it } from 'vitest';

import golden from '@/features/calc-engine/__fixtures__/rn-golden.json';
import {
  calculate,
  type CalculationInput,
  type Step,
} from '@/features/calc-engine';
import ar from '@/locales/ar.json';
import en from '@/locales/en.json';
import he from '@/locales/he.json';

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ''): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>(
    (out, [key, value]) =>
      typeof value === 'string'
        ? { ...out, [prefix + key]: value }
        : { ...out, ...flatten(value, `${prefix}${key}.`) },
    {},
  );
}

const locales = { en: flatten(en), he: flatten(he), ar: flatten(ar) };

const OLD_TERMS: Record<keyof typeof locales, RegExp[]> = {
  en: [/pivot/i, /Tama I\b/, /Bookmarks/, /Tax Employee/, /Final Total/],
  he: [/ציר/, /תמ["״]א \d/, /סה["״]כ סופי/],
  ar: [/محور/, /تاما \d/, /المفضلة/, /موظف الجمارك/, /النهائي/],
};

function engineLabelKeys(): Set<string> {
  const inputs = (golden as { input: CalculationInput }[]).map(f => f.input);
  const base = inputs[0];
  inputs.push(
    {
      ...base,
      duty: { kind: 'compound', rule: 'lower', optionI: 1, optionII: 2 },
    },
    {
      ...base,
      mode: 'air-shipment',
      airShipment: {
        cartons: [
          { length: 1, width: 1, height: 1, weight: 1, quantity: 1 },
          { length: 1, width: 1, height: 1, weight: 1, quantity: 1 },
        ],
        divisor: 6000,
        ratePerKg: 1,
        fuelSurchargePerKg: 0,
        handlingFee: 0,
      },
    },
  );
  const keys = new Set<string>();
  for (const input of inputs) {
    calculate(input).steps.forEach((step: Step) => {
      if (step.kind !== 'divider' && 'key' in step.label) {
        keys.add(step.label.key);
      }
    });
  }
  return keys;
}

describe('locales', () => {
  it('have identical key sets', () => {
    const enKeys = Object.keys(locales.en).sort();
    expect(Object.keys(locales.he).sort()).toEqual(enKeys);
    expect(Object.keys(locales.ar).sort()).toEqual(enKeys);
  });

  it('have no empty values', () => {
    for (const locale of Object.values(locales)) {
      expect(Object.entries(locale).filter(([, v]) => !v.trim())).toEqual([]);
    }
  });

  it.each(Object.keys(OLD_TERMS) as (keyof typeof locales)[])(
    '%s uses CONTEXT.md terms, not the old app terms',
    language => {
      const offenders = Object.entries(locales[language]).filter(([, value]) =>
        OLD_TERMS[language].some(term => term.test(value)),
      );
      expect(offenders).toEqual([]);
    },
  );

  it('translate every label key the calc engine emits', () => {
    const keys = [...engineLabelKeys()];
    expect(keys.length).toBeGreaterThan(30);
    for (const locale of Object.values(locales)) {
      expect(keys.filter(key => !(key in locale))).toEqual([]);
    }
  });
});
