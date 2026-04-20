import { NextRequest } from "next/server";
import type { TourPricing, TourAvailability } from "@/types";

// In a real setup this would be a separate GraphQL service.
// For the showcase, it lives as a Next.js route that Hygraph federation points to.

const PRICING: Record<string, TourPricing> = {
  "patagonia-trek-7d": {
    tourId: "patagonia-trek-7d",
    basePrice: 2490,
    currency: "EUR",
    discountedPrice: 2190,
    pricePerPerson: true,
  },
  "kyoto-culture-5d": {
    tourId: "kyoto-culture-5d",
    basePrice: 1890,
    currency: "EUR",
    pricePerPerson: true,
  },
  "morocco-desert-8d": {
    tourId: "morocco-desert-8d",
    basePrice: 1650,
    currency: "EUR",
    discountedPrice: 1490,
    pricePerPerson: true,
  },
};

function generateAvailability(tourId: string): TourAvailability[] {
  const today = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + (i + 1) * 14);
    const spots = Math.floor(Math.random() * 12) + 1;
    const remaining = Math.floor(Math.random() * spots);
    return {
      tourId,
      date: date.toISOString().split("T")[0],
      spotsTotal: spots,
      spotsRemaining: remaining,
      status:
        remaining === 0
          ? "sold_out"
          : remaining <= 3
          ? "limited"
          : "available",
    };
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tourId = searchParams.get("tourId");

  if (!tourId) {
    return Response.json({ error: "tourId required" }, { status: 400 });
  }

  const pricing = PRICING[tourId] ?? {
    tourId,
    basePrice: 1200,
    currency: "EUR",
    pricePerPerson: true,
  };

  return Response.json({
    pricing,
    availability: generateAvailability(tourId),
  });
}
