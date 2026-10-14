import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { STORAGE_KEY } from './storage';
import { useExchangeRates } from './useExchangeRates';

const payload = {
  rates: {
    USD: { rate: 3.074, lastUpdate: '2026-10-13T12:20:03Z' },
    EUR: { rate: 3.4393, lastUpdate: '2026-10-13T12:20:03Z' },
  },
  source: 'boi',
};

const apiResponds = (body: unknown, status = 200) =>
  vi.stubGlobal(
    'fetch',
    vi.fn<typeof fetch>().mockResolvedValue(Response.json(body, { status })),
  );

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  localStorage.clear();
});

describe('useExchangeRates', () => {
  it('returns live rates and remembers them', async () => {
    apiResponds(payload);
    const { result } = renderHook(() => useExchangeRates());
    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current.status).toBe('live'));
    expect(result.current).toMatchObject({
      rates: { USD: 3.074, EUR: 3.4393 },
      lastUpdate: '2026-10-13T12:20:03Z',
    });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(payload);
  });

  it('falls back to the last saved rates with their date', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    apiResponds({ error: 'unavailable' }, 502);
    const { result } = renderHook(() => useExchangeRates());
    await waitFor(() => expect(result.current.status).toBe('cached'));
    expect(result.current).toMatchObject({
      rates: { USD: 3.074, EUR: 3.4393 },
      lastUpdate: '2026-10-13T12:20:03Z',
    });
  });

  it('is unavailable when nothing was ever saved', async () => {
    apiResponds({ error: 'unavailable' }, 502);
    const { result } = renderHook(() => useExchangeRates());
    await waitFor(() => expect(result.current.status).toBe('unavailable'));
    expect(result.current).not.toHaveProperty('rates');
  });

  it('rejects a malformed API response', async () => {
    apiResponds({ rates: { USD: { rate: -1 } } });
    const { result } = renderHook(() => useExchangeRates());
    await waitFor(() => expect(result.current.status).toBe('unavailable'));
  });

  it('survives storage that throws', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    apiResponds({}, 502);
    const { result } = renderHook(() => useExchangeRates());
    await waitFor(() => expect(result.current.status).toBe('unavailable'));
  });

  it('refetches on refresh', async () => {
    apiResponds({}, 502);
    const { result } = renderHook(() => useExchangeRates());
    await waitFor(() => expect(result.current.status).toBe('unavailable'));
    apiResponds(payload);
    act(() => result.current.refresh());
    await waitFor(() => expect(result.current.status).toBe('live'));
  });
});
