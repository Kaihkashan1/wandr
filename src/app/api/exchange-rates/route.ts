import { NextRequest } from "next/server";
import { getExchangeRates } from "@/lib/federation/exchange-rates";

// Exchange rates proxy — Hygraph can federate this as a second remote source.
// Wraps https://www.exchangerate-api.com/ (free tier, daily updates).

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const base = searchParams.get("base") ?? "EUR";

  try {
    const rates = await getExchangeRates(base);
    return Response.json(rates);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch rates";
    return Response.json({ error: message }, { status: 502 });
  }
}
