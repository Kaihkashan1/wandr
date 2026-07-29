import { NextRequest } from "next/server";
import { getPimData } from "@/lib/federation/pim";

// PIM service — Hygraph remote source federation points here.
// Returns pricing + availability for a tour by slug.
// Uses Airtable when AIRTABLE_API_KEY + AIRTABLE_BASE_ID are set; otherwise mock.

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tourId = searchParams.get("tourId");

  if (!tourId) {
    return Response.json({ error: "tourId required" }, { status: 400 });
  }

  const { source, ...data } = await getPimData(tourId);

  return Response.json(data, {
    headers: {
      "X-PIM-Source": source,
      // Helps confirm whether production is reading Airtable or falling back.
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
    },
  });
}
