import type { TourPricing, TourAvailability } from "@/types";

interface TourPricingCardProps {
  tourId: string;
  pricing?: TourPricing;
  availability?: TourAvailability[];
}

const STATUS_CONFIG = {
  available: { label: "Available", className: "text-emerald-700 bg-emerald-50" },
  limited: { label: "Limited spots", className: "text-amber-700 bg-amber-50" },
  sold_out: { label: "Sold out", className: "text-red-600 bg-red-50" },
};

export function TourPricingCard({ pricing, availability }: TourPricingCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6 space-y-6 sticky top-20">
      {/* Price */}
      {pricing ? (
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1.5">
            {pricing.pricePerPerson ? "Per person from" : "Total from"}
          </p>
          <div className="flex items-baseline gap-3">
            {pricing.discountedPrice ? (
              <>
                <span className="text-4xl font-black text-gray-900">
                  {pricing.currency} {pricing.discountedPrice.toLocaleString()}
                </span>
                <span className="text-base text-gray-400 line-through">
                  {pricing.basePrice.toLocaleString()}
                </span>
                <span className="badge bg-wandr-50 text-wandr-600 font-bold">
                  Save {Math.round(((pricing.basePrice - pricing.discountedPrice) / pricing.basePrice) * 100)}%
                </span>
              </>
            ) : (
              <span className="text-4xl font-black text-gray-900">
                {pricing.currency} {pricing.basePrice.toLocaleString()}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1.5">Live pricing from our booking system</p>
        </div>
      ) : (
        <div className="animate-pulse space-y-2">
          <div className="h-3 w-24 bg-gray-100 rounded" />
          <div className="h-9 w-36 bg-gray-100 rounded" />
        </div>
      )}

      {/* CTA */}
      <button className="w-full btn-primary py-3.5 text-base rounded-xl">
        Book now
      </button>

      {/* Availability */}
      {availability && availability.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Upcoming departures</h3>
          <ul className="space-y-2">
            {availability.slice(0, 5).map((slot) => {
              const config = STATUS_CONFIG[slot.status];
              return (
                <li
                  key={slot.date}
                  className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-0"
                >
                  <span className="text-gray-700 font-medium">
                    {new Date(slot.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config.className}`}>
                    {slot.status === "sold_out"
                      ? config.label
                      : `${slot.spotsRemaining} spots left`}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        Free cancellation &middot; No payment now
      </p>
    </div>
  );
}
