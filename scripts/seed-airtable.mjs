#!/usr/bin/env node
/**
 * Seed Airtable Pricing + Departures tables from scripts/airtable/*.csv
 *
 * Usage:
 *   AIRTABLE_API_KEY=pat... AIRTABLE_BASE_ID=app... node scripts/seed-airtable.mjs
 *
 * Token needs: data.records:read, data.records:write, schema.bases:read, schema.bases:write
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const API_KEY = process.env.AIRTABLE_API_KEY?.trim();
const BASE_ID = process.env.AIRTABLE_BASE_ID?.trim();
const PRICING_TABLE = process.env.AIRTABLE_PRICING_TABLE?.trim() || "Pricing";
const DEPARTURES_TABLE =
  process.env.AIRTABLE_DEPARTURES_TABLE?.trim() || "Departures";

if (!API_KEY || !BASE_ID) {
  console.error(
    "Set AIRTABLE_API_KEY and AIRTABLE_BASE_ID (in .env.local or env)."
  );
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

async function api(path, options = {}) {
  const res = await fetch(`https://api.airtable.com/v0${path}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error?.message || `${res.status} ${path}`);
  }
  return data;
}

function parseCsv(text) {
  const lines = text.trim().split("\n");
  const cols = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    return Object.fromEntries(cols.map((col, i) => [col, values[i] ?? ""]));
  });
}

function toPricingFields(row) {
  return {
    tourId: row.tourId,
    basePrice: Number(row.basePrice),
    currency: row.currency || "EUR",
    ...(row.discountedPrice
      ? { discountedPrice: Number(row.discountedPrice) }
      : {}),
    pricePerPerson: row.pricePerPerson === "true",
  };
}

function toDepartureFields(row) {
  return {
    tourId: row.tourId,
    date: row.date,
    spotsTotal: Number(row.spotsTotal),
    spotsRemaining: Number(row.spotsRemaining),
  };
}

async function getTables() {
  const data = await api(`/meta/bases/${BASE_ID}/tables`);
  return data.tables ?? [];
}

async function ensureTable(name, fields) {
  const tables = await getTables();
  const existing = tables.find((t) => t.name === name);
  if (existing) {
    console.log(`✓ Table "${name}" already exists (${existing.id})`);
    return existing.id;
  }

  console.log(`Creating table "${name}"...`);
  const created = await api(`/meta/bases/${BASE_ID}/tables`, {
    method: "POST",
    body: JSON.stringify({ name, fields }),
  });
  console.log(`✓ Created table "${name}" (${created.id})`);
  return created.id;
}

async function clearTable(tableName) {
  const tables = await getTables();
  const table = tables.find((t) => t.name === tableName);
  if (!table) return;

  let offset;
  const ids = [];
  do {
    const params = new URLSearchParams({ pageSize: "100" });
    if (offset) params.set("offset", offset);
    const data = await api(
      `/${BASE_ID}/${encodeURIComponent(tableName)}?${params}`
    );
    ids.push(...data.records.map((r) => r.id));
    offset = data.offset;
  } while (offset);

  for (let i = 0; i < ids.length; i += 10) {
    const batch = ids.slice(i, i + 10);
    const params = batch.map((id) => `records[]=${id}`).join("&");
    await api(`/${BASE_ID}/${encodeURIComponent(tableName)}?${params}`, {
      method: "DELETE",
    });
  }

  if (ids.length) console.log(`  Cleared ${ids.length} existing rows in "${tableName}"`);
}

async function insertRows(tableName, fieldRows) {
  for (let i = 0; i < fieldRows.length; i += 10) {
    const batch = fieldRows.slice(i, i + 10);
    await api(`/${BASE_ID}/${encodeURIComponent(tableName)}`, {
      method: "POST",
      body: JSON.stringify({
        records: batch.map((fields) => ({ fields })),
      }),
    });
  }
  console.log(`✓ Inserted ${fieldRows.length} rows into "${tableName}"`);
}

async function main() {
  await ensureTable(PRICING_TABLE, [
    { name: "tourId", type: "singleLineText" },
    { name: "basePrice", type: "number", options: { precision: 0 } },
    { name: "currency", type: "singleLineText" },
    { name: "discountedPrice", type: "number", options: { precision: 0 } },
    { name: "pricePerPerson", type: "checkbox" },
  ]);

  await ensureTable(DEPARTURES_TABLE, [
    { name: "tourId", type: "singleLineText" },
    { name: "date", type: "date", options: { dateFormat: { name: "iso" } } },
    { name: "spotsTotal", type: "number", options: { precision: 0 } },
    { name: "spotsRemaining", type: "number", options: { precision: 0 } },
  ]);

  const pricingCsv = readFileSync(
    join(__dirname, "airtable/pricing.csv"),
    "utf8"
  );
  const departuresCsv = readFileSync(
    join(__dirname, "airtable/departures.csv"),
    "utf8"
  );

  const pricingRows = parseCsv(pricingCsv).map(toPricingFields);
  const departureRows = parseCsv(departuresCsv).map(toDepartureFields);

  await clearTable(PRICING_TABLE);
  await clearTable(DEPARTURES_TABLE);

  await insertRows(PRICING_TABLE, pricingRows);
  await insertRows(DEPARTURES_TABLE, departureRows);

  console.log("\nDone! Add to .env.local:");
  console.log(`AIRTABLE_BASE_ID=${BASE_ID}`);
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
