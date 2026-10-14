import {
  type CalculationLink,
  type CalculationMeta,
  type CalculationTotals,
  encodeCalculation,
  isCalculationLink,
} from '@/features/calc-engine';

/** One Saved Calculation: inputs plus the Result totals frozen at save time. */
export type SavedCalculation = {
  id: string;
  savedAt: string;
  link: CalculationLink;
  totals: CalculationTotals;
};

export const STORAGE_KEY = 'history:v1';

const EXPORT_APP = 'import-calculator';
const EXPORT_VERSION = 1;

const TOTAL_KEYS = [
  'cif',
  'customsDuty',
  'tama',
  'purchaseTax',
  'expenses',
  'landedCost',
  'vat',
  'totalIncludingVat',
] as const;

const isFiniteNumber = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v);

function isTotals(v: unknown): v is CalculationTotals {
  if (typeof v !== 'object' || v === null) return false;
  const totals = v as Record<string, unknown>;
  return (
    TOTAL_KEYS.every(key => isFiniteNumber(totals[key])) &&
    (totals.importFactor === null || isFiniteNumber(totals.importFactor)) &&
    (totals.shekelPerUnitFactor === null ||
      isFiniteNumber(totals.shekelPerUnitFactor))
  );
}

export function isSavedCalculation(v: unknown): v is SavedCalculation {
  if (typeof v !== 'object' || v === null) return false;
  const item = v as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    typeof item.savedAt === 'string' &&
    !Number.isNaN(Date.parse(item.savedAt)) &&
    isCalculationLink(item.link) &&
    isTotals(item.totals)
  );
}

const listeners = new Set<() => void>();
let cache: { raw: string | null; items: SavedCalculation[] } | null = null;

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function parse(raw: string | null): SavedCalculation[] {
  try {
    const value: unknown = JSON.parse(raw ?? '[]');
    return Array.isArray(value) ? value.filter(isSavedCalculation) : [];
  } catch {
    return [];
  }
}

/** Saved Calculations, newest first. Same array until storage changes. */
export function listSaved(): SavedCalculation[] {
  const raw = readRaw();
  if (cache?.raw !== raw) cache = { raw, items: parse(raw) };
  return cache.items;
}

function write(items: SavedCalculation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } finally {
    listeners.forEach(listener => listener());
  }
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Other tabs editing the same History.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

export function findSaved(link: CalculationLink): SavedCalculation | undefined {
  const encoded = encodeCalculation(link);
  return listSaved().find(item => encodeCalculation(item.link) === encoded);
}

export function saveCalculation(
  link: CalculationLink,
  totals: CalculationTotals,
): SavedCalculation {
  const existing = findSaved(link);
  if (existing) return existing;
  const item: SavedCalculation = {
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
    link,
    totals,
  };
  write([item, ...listSaved()]);
  return item;
}

/** Renames a Saved Calculation or changes its description. */
export function updateSavedMeta(id: string, meta: CalculationMeta): void {
  write(
    listSaved().map(item =>
      item.id === id ? { ...item, link: { ...item.link, meta } } : item,
    ),
  );
}

export function deleteSaved(id: string): void {
  write(listSaved().filter(item => item.id !== id));
}

export function clearHistory(): void {
  write([]);
}

export function exportHistory(now = new Date()): string {
  return JSON.stringify(
    {
      app: EXPORT_APP,
      v: EXPORT_VERSION,
      exportedAt: now.toISOString(),
      items: listSaved(),
    },
    null,
    2,
  );
}

export class HistoryImportError extends Error {}

/** Merges a History export by id; existing items win. Throws on a foreign file. */
export function importHistory(json: string): {
  added: number;
  skipped: number;
} {
  let file: unknown;
  try {
    file = JSON.parse(json);
  } catch {
    throw new HistoryImportError('Not JSON');
  }
  const { app, v, items } = (file ?? {}) as Record<string, unknown>;
  if (app !== EXPORT_APP || v !== EXPORT_VERSION || !Array.isArray(items)) {
    throw new HistoryImportError('Not an Import Calculator History export');
  }

  const current = listSaved();
  const ids = new Set(current.map(item => item.id));
  const incoming: SavedCalculation[] = [];
  for (const item of items) {
    if (isSavedCalculation(item) && !ids.has(item.id)) {
      ids.add(item.id);
      incoming.push(item);
    }
  }
  if (incoming.length > 0) {
    write(
      [...current, ...incoming].sort((a, b) =>
        b.savedAt.localeCompare(a.savedAt),
      ),
    );
  }
  return { added: incoming.length, skipped: items.length - incoming.length };
}
