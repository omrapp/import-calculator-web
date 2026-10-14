import type { RatesPayload } from '../../../api/rates';

export const STORAGE_KEY = 'fx-rates:last';

export function isRatesPayload(value: unknown): value is RatesPayload {
  const rates = (value as RatesPayload | null)?.rates;
  return (['USD', 'EUR'] as const).every(currency => {
    const entry = rates?.[currency];
    return (
      typeof entry?.rate === 'number' &&
      entry.rate > 0 &&
      typeof entry.lastUpdate === 'string'
    );
  });
}

export function loadLastRates(): RatesPayload | null {
  try {
    const parsed: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? 'null',
    );
    return isRatesPayload(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveLastRates(payload: RatesPayload): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Storage unavailable; the cached fallback just won't exist next time.
  }
}
