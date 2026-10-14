/**
 * Bank of Israel representative exchange rates for USD and EUR.
 *
 * Vercel function at /api/rates; also mounted on the Vite dev/preview
 * servers (vite.config.ts). Self-contained on purpose: Vercel compiles each
 * api/ file on its own, so this file imports nothing from src/.
 */

export const BOI_RATES_URL = 'https://boi.org.il/PublicApi/GetExchangeRates';

const CURRENCIES = ['USD', 'EUR'] as const;

export type RatesPayload = {
  rates: Record<
    (typeof CURRENCIES)[number],
    { rate: number; lastUpdate: string }
  >;
  source: 'boi';
};

type BoiRate = {
  key: string;
  currentExchangeRate: number;
  unit: number;
  lastUpdate: string;
};

export async function getRates(
  fetchImpl: typeof fetch = fetch,
): Promise<RatesPayload> {
  const response = await fetchImpl(BOI_RATES_URL, {
    signal: AbortSignal.timeout(5000),
    headers: { accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`BOI responded ${response.status}`);

  const body = (await response.json()) as { exchangeRates?: BoiRate[] };
  const entries = CURRENCIES.map(currency => {
    const item = body.exchangeRates?.find(r => r.key === currency);
    const rate = item ? item.currentExchangeRate / (item.unit || 1) : NaN;
    if (!item || !Number.isFinite(rate) || rate <= 0 || !item.lastUpdate) {
      throw new Error(`BOI response has no valid ${currency} rate`);
    }
    return [currency, { rate, lastUpdate: item.lastUpdate }] as const;
  });

  return {
    rates: Object.fromEntries(entries) as RatesPayload['rates'],
    source: 'boi',
  };
}

export async function GET(): Promise<Response> {
  try {
    return Response.json(await getRates(), {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return Response.json(
      { error: 'unavailable' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
