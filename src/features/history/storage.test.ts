import { afterEach, describe, expect, it, vi } from 'vitest';

import { calculate, type CalculationLink } from '@/features/calc-engine';
import { standardInput } from '@/features/calc-engine/fixtures';

import {
  clearHistory,
  deleteSaved,
  exportHistory,
  HistoryImportError,
  importHistory,
  listSaved,
  saveCalculation,
  STORAGE_KEY,
  updateSavedMeta,
} from './storage';

const linkWith = (cost: number): CalculationLink => {
  const input = standardInput();
  return {
    v: 1,
    input: {
      ...input,
      cif: { ...input.cif, cost: { amount: cost, currency: 'USD' } },
    },
    rates: { source: 'manual' },
  };
};
const save = (cost: number) => {
  const link = linkWith(cost);
  return saveCalculation(link, calculate(link.input).totals);
};

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
});

describe('history storage', () => {
  it('lists saved calculations newest first', () => {
    save(100);
    save(200);
    expect(listSaved().map(item => item.link.input.cif.cost.amount)).toEqual([
      200, 100,
    ]);
    expect(listSaved()[0].totals.totalIncludingVat).toBeGreaterThan(0);
  });

  it('does not save the same link twice', () => {
    const first = save(100);
    expect(save(100).id).toBe(first.id);
    expect(listSaved()).toHaveLength(1);
  });

  it('deletes one item and clears all', () => {
    const a = save(100);
    save(200);
    deleteSaved(a.id);
    expect(listSaved()).toHaveLength(1);
    clearHistory();
    expect(listSaved()).toEqual([]);
  });

  it.each(['not json', '{"a":1}', '[{"id":1}]'])(
    'treats malformed storage %j as empty',
    raw => {
      localStorage.setItem(STORAGE_KEY, raw);
      expect(listSaved()).toEqual([]);
    },
  );

  it('drops invalid items but keeps valid ones', () => {
    save(100);
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY)!) as unknown[];
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...items, { id: 'x', savedAt: 'nope' }]),
    );
    expect(listSaved()).toHaveLength(1);
  });

  it('round-trips export → import and skips duplicates', () => {
    save(100);
    save(200);
    const file = exportHistory();
    const before = listSaved();
    clearHistory();

    expect(importHistory(file)).toEqual({ added: 2, skipped: 0 });
    expect(listSaved()).toEqual(before);
    expect(importHistory(file)).toEqual({ added: 0, skipped: 2 });
    expect(listSaved()).toHaveLength(2);
  });

  it.each([
    'garbage',
    JSON.stringify({ app: 'other', v: 1, items: [] }),
    JSON.stringify({ app: 'import-calculator', v: 2, items: [] }),
  ])('rejects a foreign file %#', file => {
    save(100);
    const before = localStorage.getItem(STORAGE_KEY);
    expect(() => importHistory(file)).toThrow(HistoryImportError);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(before);
  });

  it('renames a Saved Calculation in place', () => {
    const item = save(100);
    save(200);
    updateSavedMeta(item.id, { title: 'Shoes', description: 'Order 42' });
    const updated = listSaved().find(saved => saved.id === item.id);
    expect(updated?.link.meta).toEqual({
      title: 'Shoes',
      description: 'Order 42',
    });
    expect(listSaved()).toHaveLength(2);
  });
});
