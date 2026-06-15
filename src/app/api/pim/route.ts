import { NextRequest } from "next/server";
import { getPimData } from "@/lib/federation/pim";

// Mock PIM service — Hygraph remote source federation can point here.
// Returns pricing + availability for a tour by slug.

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tourId = searchParams.get("tourId");

  if (!tourId) {
    return Response.json({ error: "tourId required" }, { status: 400 });
  }

  return Response.json(await getPimData(tourId));
}
