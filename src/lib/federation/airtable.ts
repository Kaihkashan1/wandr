import type { TourAvailability, TourPricing } from "@/types";

interface AirtableListResponse<T> {
  records: Array<{ id: string; fields: T }>;
  offset?: string;
}

interface AirtablePricingFields {
  tourId?: string;
  basePrice?: number;
  currency?: string;
  discountedPrice?: number;
  pricePerPerson?: boolean;
  [key: string]: unknown;
}

interface AirtableDepartureFields {
  tourId?: string;
  date?: string;
  Date?: string;
  spotsTotal?: number;
  spotsRemaining?: number;
  [key: string]: unknown;
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

function normalizeTourId(value: unknown): string | null {
  if (value == null) return null;
  // Linked-record fields come back as arrays of record ids — skip those.
  if (Array.isArray(value)) return null;
  const id = String(value).trim();
  return id || null;
}

/** Airtable date fields are YYYY-MM-DD; tolerate datetimes. */
function normalizeDate(value: unknown): string | null {
  if (value == null) return null;
  const match = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
  return match?.[1] ?? null;
}

async function listAirtableRecords<T extends Record<string, unknown>>(
  table: string,
  filterFormula?: string
): Promise<T[]> {
  const config = readAirtableEnv();
  if (!config) {
    throw new Error("Airtable is not configured");
  }

  const fields: T[] = [];
  let offset: string | undefined;

  do {
    const params = new URLSearchParams({ pageSize: "100" });
    if (filterFormula) params.set("filterByFormula", filterFormula);
    if (offset) params.set("offset", offset);

    const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(table)}?${params}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${config.apiKey}` },
      // Demo needs Airtable edits to show up immediately (no Next/CDN cache).
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Airtable error (${table}): ${res.status}`);
    }

    const data = (await res.json()) as AirtableListResponse<T>;
    fields.push(...data.records.map((record) => record.fields));
    offset = data.offset;
  } while (offset);

  return fields;
}

function toAvailabilityStatus(
  spotsRemaining: number
): TourAvailability["status"] {
  if (spotsRemaining === 0) return "sold_out";
  if (spotsRemaining <= 3) return "limited";
  return "available";
}

function mapPricing(
  fields: AirtablePricingFields,
  tourId: string
): TourPricing | null {
  if (typeof fields.basePrice !== "number") return null;
  return {
    tourId,
    basePrice: fields.basePrice,
    currency: typeof fields.currency === "string" ? fields.currency : "EUR",
    discountedPrice:
      typeof fields.discountedPrice === "number"
        ? fields.discountedPrice
        : undefined,
    pricePerPerson:
      typeof fields.pricePerPerson === "boolean"
        ? fields.pricePerPerson
        : true,
  };
}

function mapDeparture(
  fields: AirtableDepartureFields,
  tourId: string
): TourAvailability | null {
  const date = normalizeDate(fields.date ?? fields.Date);
  if (!date) return null;

  const spotsTotal =
    typeof fields.spotsTotal === "number" ? fields.spotsTotal : 0;
  const spotsRemaining =
    typeof fields.spotsRemaining === "number" ? fields.spotsRemaining : 0;

  return {
    tourId,
    date,
    spotsTotal,
    spotsRemaining,
    status: toAvailabilityStatus(spotsRemaining),
  };
}

export async function getAirtablePimData(tourId: string): Promise<{
  pricing: TourPricing;
  availability: TourAvailability[];
}> {
  const config = readAirtableEnv();
  if (!config) {
    throw new Error("Airtable is not configured");
  }

  // Load table rows and match tourId in JS (trims whitespace; avoids formula
  // misses on newly typed rows). Fine for a small demo base.
  const [pricingRows, departureRows] = await Promise.all([
    listAirtableRecords<AirtablePricingFields>(config.pricingTable),
    listAirtableRecords<AirtableDepartureFields>(config.departuresTable),
  ]);

  const pricingRow = pricingRows.find(
    (row) => normalizeTourId(row.tourId) === tourId
  );
  const pricing = pricingRow ? mapPricing(pricingRow, tourId) : null;
  if (!pricing) {
    throw new Error(`No Airtable pricing row for tourId: ${tourId}`);
  }

  const availability = departureRows
    .filter((row) => normalizeTourId(row.tourId) === tourId)
    .map((row) => mapDeparture(row, tourId))
    .filter((slot): slot is TourAvailability => slot !== null)
    .sort((a, b) => a.date.localeCompare(b.date));

  return { pricing, availability };
}
