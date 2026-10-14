import { describe, expect, it, vi } from 'vitest';

import { BOI_RATES_URL, GET, getRates } from '../../../api/rates';

// Shape verified against the live BOI API on 2026-10-14.
const boiBody = {
  exchangeRates: [
    {
      key: 'USD',
      currentExchangeRate: 3.074,
      currentChange: -0.13,
      unit: 1,
      lastUpdate: '2026-10-13T12:20:03.836954Z',
    },
    {
      key: 'EUR',
      currentExchangeRate: 3.4393,
      currentChange: -0.08,
      unit: 1,
      lastUpdate: '2026-10-13T12:20:03.836954Z',
    },
    {
      key: 'JPY',
      currentExchangeRate: 2.05,
      currentChange: 0.1,
      unit: 100,
      lastUpdate: '2026-10-13T12:20:03.836954Z',
    },
  ],
};

const respond = (body: unknown, status = 200) =>
  vi.fn<typeof fetch>().mockResolvedValue(Response.json(body, { status }));

describe('getRates', () => {
  it('picks USD and EUR from the BOI response', async () => {
    const fetchMock = respond(boiBody);
    await expect(getRates(fetchMock)).resolves.toEqual({
      rates: {
        USD: { rate: 3.074, lastUpdate: '2026-10-13T12:20:03.836954Z' },
        EUR: { rate: 3.4393, lastUpdate: '2026-10-13T12:20:03.836954Z' },
      },
      source: 'boi',
    });
    expect(fetchMock).toHaveBeenCalledWith(BOI_RATES_URL, expect.anything());
  });

  it('divides by unit', async () => {
    const body = {
      exchangeRates: boiBody.exchangeRates.map(r =>
        r.key === 'USD' ? { ...r, currentExchangeRate: 307.4, unit: 100 } : r,
      ),
    };
    const payload = await getRates(respond(body));
    expect(payload.rates.USD.rate).toBeCloseTo(3.074, 10);
  });

  it.each([
    [
      'missing EUR',
      { exchangeRates: boiBody.exchangeRates.filter(r => r.key !== 'EUR') },
    ],
    [
      'zero rate',
      {
        exchangeRates: boiBody.exchangeRates.map(r => ({
          ...r,
          currentExchangeRate: 0,
        })),
      },
    ],
    ['no list', {}],
  ])('throws on %s', async (_, body) => {
    await expect(getRates(respond(body))).rejects.toThrow();
  });

  it('throws on a non-200 response', async () => {
    await expect(getRates(respond({}, 503))).rejects.toThrow('503');
  });

  it('throws on timeout or network failure', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockRejectedValue(new DOMException('timed out', 'TimeoutError'));
    await expect(getRates(fetchMock)).rejects.toThrow();
  });
});

describe('GET /api/rates', () => {
  it('returns rates with a 1h CDN cache', async () => {
    vi.stubGlobal('fetch', respond(boiBody));
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toContain('s-maxage=3600');
    expect((await response.json()).rates.USD.rate).toBe(3.074);
    vi.unstubAllGlobals();
  });

  it('returns 502 without caching when BOI fails', async () => {
    vi.stubGlobal('fetch', respond({}, 500));
    const response = await GET();
    expect(response.status).toBe(502);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toEqual({ error: 'unavailable' });
    vi.unstubAllGlobals();
  });
});
