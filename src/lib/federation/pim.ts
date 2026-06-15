import type { TourAvailability, TourPricing } from "@/types";

// Mock PIM catalog — in production this data lives in a separate product system
// and is exposed via Hygraph remote source federation (see /api/pim).

export const PIM_PRICING: Record<string, TourPricing> = {
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

function pseudoRandom(seed: string, index: number): number {
  let hash = 0;
  const str = `${seed}-${index}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateAvailability(tourId: string): TourAvailability[] {
  const today = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + (i + 1) * 14);
    const spots = (pseudoRandom(tourId, i) % 12) + 1;
    const remaining = pseudoRandom(tourId, i + 100) % (spots + 1);
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

export function getPimData(tourId: string): {
  pricing: TourPricing;
  availability: TourAvailability[];
} {
  const pricing = PIM_PRICING[tourId] ?? {
    tourId,
    basePrice: 1200,
    currency: "EUR",
    pricePerPerson: true,
  };

  return {
    pricing,
    availability: generateAvailability(tourId),
  };
}
