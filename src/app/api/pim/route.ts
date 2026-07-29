import { NextRequest } from "next/server";
import { getPimData } from "@/lib/federation/pim";

// PIM service — Hygraph remote source federation points here.
// Returns pricing + availability for a tour by slug.
// Uses Airtable when AIRTABLE_API_KEY + AIRTABLE_BASE_ID are set; otherwise mock.
// Add ?debug=1 to include Airtable match diagnostics (no secrets).

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tourId = searchParams.get("tourId");
  const debug = searchParams.get("debug") === "1";

  if (!tourId) {
    return Response.json({ error: "tourId required" }, { status: 400 });
  }

  const { source, ...data } = await getPimData(tourId, { debug });

  return Response.json(
    { ...data, source },
    {
      headers: {
        "X-PIM-Source": source,
        "Cache-Control": "no-store",
      },
    }
  );
}
