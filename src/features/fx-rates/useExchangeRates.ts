import { useCallback, useEffect, useState } from 'react';

import type { RatesPayload } from '../../../api/rates';
import { isRatesPayload, loadLastRates, saveLastRates } from './storage';

export type ExchangeRates = { USD: number; EUR: number };

export type ExchangeRatesState =
  | { status: 'loading' }
  | { status: 'live' | 'cached'; rates: ExchangeRates; lastUpdate: string }
  | { status: 'unavailable' };

const toState = (
  status: 'live' | 'cached',
  payload: RatesPayload,
): ExchangeRatesState => ({
  status,
  rates: { USD: payload.rates.USD.rate, EUR: payload.rates.EUR.rate },
  lastUpdate: payload.rates.USD.lastUpdate,
});

export async function fetchRates(signal?: AbortSignal): Promise<RatesPayload> {
  const response = await fetch('/api/rates', { signal });
  if (!response.ok) throw new Error(`Rates API responded ${response.status}`);
  const body: unknown = await response.json();
  if (!isRatesPayload(body)) throw new Error('Malformed rates response');
  return body;
}

/**
 * Today's Bank of Israel rates. Falls back to the last rates fetched in this
 * browser, then to 'unavailable' (the user must enter rates). Never invents a rate.
 */
export function useExchangeRates() {
  const [state, setState] = useState<ExchangeRatesState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchRates(controller.signal)
      .then(payload => {
        saveLastRates(payload);
        setState(toState('live', payload));
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        const last = loadLastRates();
        setState(last ? toState('cached', last) : { status: 'unavailable' });
      });
    return () => controller.abort();
  }, [attempt]);

  const refresh = useCallback(() => {
    setState({ status: 'loading' });
    setAttempt(n => n + 1);
  }, []);

  return { ...state, refresh };
}
