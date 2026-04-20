import type { TourPricing, TourAvailability } from "@/types";

interface TourPricingCardProps {
  tourId: string;
  pricing?: TourPricing;
  availability?: TourAvailability[];
}

const STATUS_CONFIG = {
  available: { label: "Available", className: "text-green-600 bg-green-50" },
  limited: { label: "Limited spots", className: "text-amber-600 bg-amber-50" },
  sold_out: { label: "Sold out", className: "text-red-500 bg-red-50" },
};

export function TourPricingCard({
  pricing,
  availability,
}: TourPricingCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 p-6 space-y-6 sticky top-20">
      {/* Price */}
      {pricing ? (
        <div>
          <p className="text-xs text-gray-500 mb-1">
            {pricing.pricePerPerson ? "Per person from" : "Total from"}
          </p>
          <div className="flex items-baseline gap-2">
            {pricing.discountedPrice ? (
              <>
                <span className="text-3xl font-bold text-gray-900">
                  {pricing.currency} {pricing.discountedPrice.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {pricing.basePrice.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                {pricing.currency} {pricing.basePrice.toLocaleString()}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Federated from PIM · live data
          </p>
        </div>
      ) : (
        <div className="animate-pulse">
          <div className="h-3 w-24 bg-gray-100 rounded mb-2" />
          <div className="h-8 w-36 bg-gray-100 rounded" />
        </div>
      )}

      {/* Availability */}
      {availability && availability.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Upcoming departures
          </h3>
          <ul className="space-y-2">
            {availability.slice(0, 5).map((slot) => {
              const config = STATUS_CONFIG[slot.status];
              return (
                <li
                  key={slot.date}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700">
                    {new Date(slot.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.className}`}
                  >
                    {slot.status === "sold_out"
                      ? config.label
                      : `${slot.spotsRemaining} left`}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <button className="w-full bg-gray-900 text-white font-semibold py-3 rounded-full hover:bg-gray-700 transition-colors text-sm">
        Check availability
      </button>

      <p className="text-xs text-gray-400 text-center">
        No payment required to reserve
      </p>
    </div>
  );
}
