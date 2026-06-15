import { unstable_cache } from "next/cache";

export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  updatedAt: string;
}

interface ExchangeRateApiResponse {
  result: string;
  base_code?: string;
  rates?: Record<string, number>;
  conversion_rates?: Record<string, number>;
  time_last_update_utc?: string;
}

async function fetchExchangeRates(base: string): Promise<ExchangeRates> {
  const apiKey = process.env.EXCHANGERATE_API_KEY;
  const url = apiKey
    ? `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`
    : `https://open.er-api.com/v6/latest/${base}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`ExchangeRate-API error: ${res.status}`);
  }

  const data = (await res.json()) as ExchangeRateApiResponse;
  if (data.result !== "success") {
    throw new Error("ExchangeRate-API returned unsuccessful result");
  }

  const rates = data.rates ?? data.conversion_rates;
  if (!rates) {
    throw new Error("ExchangeRate-API response missing rates");
  }

  return {
    base: data.base_code ?? base,
    rates,
    updatedAt: data.time_last_update_utc ?? new Date().toUTCString(),
  };
}

const getCachedExchangeRates = unstable_cache(
  fetchExchangeRates,
  ["exchange-rates"],
  { revalidate: 3600 }
);

export async function getExchangeRates(base = "EUR"): Promise<ExchangeRates> {
  return getCachedExchangeRates(base);
}

export function convertAmount(
  amount: number,
  rate: number,
  roundToWhole = true
): number {
  const converted = amount * rate;
  return roundToWhole ? Math.round(converted) : converted;
}
