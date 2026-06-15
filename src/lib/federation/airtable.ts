import { unstable_cache } from "next/cache";
import type { TourAvailability, TourPricing } from "@/types";

interface AirtableListResponse<T> {
  records: Array<{ id: string; fields: T }>;
}

interface AirtablePricingFields {
  tourId: string;
  basePrice: number;
  currency?: string;
  discountedPrice?: number;
  pricePerPerson?: boolean;
}

interface AirtableDepartureFields {
  tourId: string;
  date: string;
  spotsTotal: number;
  spotsRemaining: number;
}

function readAirtableEnv() {
  const apiKey = process.env.AIRTABLE_API_KEY?.trim();
  const baseId = process.env.AIRTABLE_BASE_ID?.trim();
  if (!apiKey || !baseId) return null;

  return {
    apiKey,
    baseId,
    pricingTable: process.env.AIRTABLE_PRICING_TABLE?.trim() || "Pricing",
    departuresTable:
      process.env.AIRTABLE_DEPARTURES_TABLE?.trim() || "Departures",
  };
}

export function isAirtablePimConfigured(): boolean {
  return readAirtableEnv() !== null;
}

async function listAirtableRecords<T>(
  table: string,
  filterFormula: string
): Promise<T[]> {
  const config = readAirtableEnv();
  if (!config) {
    throw new Error("Airtable is not configured");
  }

  const params = new URLSearchParams({ filterByFormula: filterFormula });
  const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(table)}?${params}`;

  const isDev = process.env.NODE_ENV === "development";
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${config.apiKey}` },
    ...(isDev ? { cache: "no-store" } : { next: { revalidate: 60 } }),
  });

  if (!res.ok) {
    throw new Error(`Airtable error (${table}): ${res.status}`);
  }

  const data = (await res.json()) as AirtableListResponse<T>;
  return data.records.map((record) => record.fields);
}

function toAvailabilityStatus(
  spotsRemaining: number
): TourAvailability["status"] {
  if (spotsRemaining === 0) return "sold_out";
  if (spotsRemaining <= 3) return "limited";
  return "available";
}

function mapPricing(fields: AirtablePricingFields): TourPricing {
  return {
    tourId: fields.tourId,
    basePrice: fields.basePrice,
    currency: fields.currency ?? "EUR",
    discountedPrice: fields.discountedPrice,
    pricePerPerson: fields.pricePerPerson ?? true,
  };
}

function mapDeparture(fields: AirtableDepartureFields): TourAvailability {
  return {
    tourId: fields.tourId,
    date: fields.date,
    spotsTotal: fields.spotsTotal,
    spotsRemaining: fields.spotsRemaining,
    status: toAvailabilityStatus(fields.spotsRemaining),
  };
}

async function fetchPimDataFromAirtable(tourId: string): Promise<{
  pricing: TourPricing;
  availability: TourAvailability[];
}> {
  const config = readAirtableEnv();
  if (!config) {
    throw new Error("Airtable is not configured");
  }

  const escapedTourId = tourId.replace(/'/g, "\\'");
  const filter = `{tourId}='${escapedTourId}'`;

  const [pricingRows, departureRows] = await Promise.all([
    listAirtableRecords<AirtablePricingFields>(config.pricingTable, filter),
    listAirtableRecords<AirtableDepartureFields>(
      config.departuresTable,
      filter
    ),
  ]);

  const pricingRow = pricingRows[0];
  if (!pricingRow) {
    throw new Error(`No Airtable pricing row for tourId: ${tourId}`);
  }

  return {
    pricing: mapPricing(pricingRow),
    availability: departureRows
      .map(mapDeparture)
      .sort((a, b) => a.date.localeCompare(b.date)),
  };
}

const getCachedAirtablePimData = unstable_cache(
  fetchPimDataFromAirtable,
  ["airtable-pim"],
  { revalidate: 60 }
);

export async function getAirtablePimData(tourId: string): Promise<{
  pricing: TourPricing;
  availability: TourAvailability[];
}> {
  if (process.env.NODE_ENV === "development") {
    return fetchPimDataFromAirtable(tourId);
  }
  return getCachedAirtablePimData(tourId);
}
