import type { TourAvailability, TourPricing } from "@/types";

interface AirtableRecord<T> {
  id: string;
  fields: T;
}

interface AirtableListResponse<T> {
  records: AirtableRecord<T>[];
  offset?: string;
}

interface AirtablePricingFields {
  tourId?: unknown;
  basePrice?: number;
  currency?: string;
  discountedPrice?: number;
  pricePerPerson?: boolean;
  [key: string]: unknown;
}

interface AirtableDepartureFields {
  tourId?: unknown;
  date?: unknown;
  Date?: unknown;
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

/** Plain text tourId, or null if missing / needs linked-record resolve. */
function asPlainTourId(value: unknown): string | null {
  if (value == null || Array.isArray(value)) return null;
  let id = String(value).trim();
  if (!id) return null;
  // Airtable "Duplicate record" appends " copy" / " copy copy" to text fields.
  id = id.replace(/(?:\s+copy)+$/i, "").trim();
  return id || null;
}

function asLinkedRecordIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => String(v).trim()).filter(Boolean);
}

/** Airtable date fields are YYYY-MM-DD; tolerate datetimes. */
function normalizeDate(value: unknown): string | null {
  if (value == null) return null;
  const match = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
  return match?.[1] ?? null;
}

async function listAirtableRecords<T extends Record<string, unknown>>(
  table: string
): Promise<AirtableRecord<T>[]> {
  const config = readAirtableEnv();
  if (!config) {
    throw new Error("Airtable is not configured");
  }

  const records: AirtableRecord<T>[] = [];
  let offset: string | undefined;

  do {
    const params = new URLSearchParams({ pageSize: "100" });
    if (offset) params.set("offset", offset);

    const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(table)}?${params}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${config.apiKey}` },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Airtable error (${table}): ${res.status}`);
    }

    const data = (await res.json()) as AirtableListResponse<T>;
    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records;
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

function resolveDepartureTourId(
  fields: AirtableDepartureFields,
  pricingTourIdByRecordId: Map<string, string>
): string | null {
  const plain = asPlainTourId(fields.tourId);
  if (plain) return plain;

  // Linked-record tourId → Pricing row id(s) → Pricing.tourId text
  for (const recordId of asLinkedRecordIds(fields.tourId)) {
    const linked = pricingTourIdByRecordId.get(recordId);
    if (linked) return linked;
  }

  return null;
}

export interface AirtablePimDebug {
  pricingRecordCount: number;
  departureRecordCount: number;
  matchedDepartureCount: number;
  skippedNoTourId: number;
  skippedNoDate: number;
  skippedWrongTour: number;
  resolvedTourIds: string[];
  upcomingCount?: number;
}

export async function getAirtablePimData(
  tourId: string,
  options?: { debug?: boolean }
): Promise<{
  pricing: TourPricing;
  availability: TourAvailability[];
  debug?: AirtablePimDebug;
}> {
  const config = readAirtableEnv();
  if (!config) {
    throw new Error("Airtable is not configured");
  }

  const [pricingRecords, departureRecords] = await Promise.all([
    listAirtableRecords<AirtablePricingFields>(config.pricingTable),
    listAirtableRecords<AirtableDepartureFields>(config.departuresTable),
  ]);

  const pricingTourIdByRecordId = new Map<string, string>();
  for (const record of pricingRecords) {
    const id = asPlainTourId(record.fields.tourId);
    if (id) pricingTourIdByRecordId.set(record.id, id);
  }

  const pricingRecord = pricingRecords.find(
    (record) => asPlainTourId(record.fields.tourId) === tourId
  );
  const pricing = pricingRecord
    ? mapPricing(pricingRecord.fields, tourId)
    : null;
  if (!pricing) {
    throw new Error(`No Airtable pricing row for tourId: ${tourId}`);
  }

  let skippedNoTourId = 0;
  let skippedNoDate = 0;
  let skippedWrongTour = 0;
  const resolvedTourIds = new Set<string>();

  const availability: TourAvailability[] = [];
  for (const record of departureRecords) {
    const resolvedId = resolveDepartureTourId(
      record.fields,
      pricingTourIdByRecordId
    );
    if (!resolvedId) {
      skippedNoTourId += 1;
      continue;
    }
    resolvedTourIds.add(resolvedId);
    if (resolvedId !== tourId) {
      skippedWrongTour += 1;
      continue;
    }
    const slot = mapDeparture(record.fields, tourId);
    if (!slot) {
      skippedNoDate += 1;
      continue;
    }
    availability.push(slot);
  }

  availability.sort((a, b) => a.date.localeCompare(b.date));

  const result: {
    pricing: TourPricing;
    availability: TourAvailability[];
    debug?: AirtablePimDebug;
  } = { pricing, availability };

  if (options?.debug) {
    result.debug = {
      pricingRecordCount: pricingRecords.length,
      departureRecordCount: departureRecords.length,
      matchedDepartureCount: availability.length,
      skippedNoTourId,
      skippedNoDate,
      skippedWrongTour,
      resolvedTourIds: [...resolvedTourIds].sort(),
    };
  }

  return result;
}
