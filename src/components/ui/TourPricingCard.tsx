import { t } from "@/lib/i18n";
import { formatDate, formatMoney } from "@/lib/locale";
import type { Locale, TourAvailability, TourPricing } from "@/types";

interface TourPricingCardProps {
  locale: Locale;
  pricing?: TourPricing;
  availability?: TourAvailability[];
}

function formatPrice(amount: number, currency: string, locale: Locale): string {
  return formatMoney(amount, currency, locale);
}

export function TourPricingCard({ locale, pricing, availability }: TourPricingCardProps) {
  const statusLabels = {
    available: t(locale, "available"),
    limited: t(locale, "limitedSpots"),
    sold_out: t(locale, "soldOut"),
  };

  const statusClass = {
    available: "text-emerald-700 bg-emerald-50",
    limited: "text-amber-700 bg-amber-50",
    sold_out: "text-red-600 bg-red-50",
  };

  const sourceAmount =
    pricing?.sourceCurrency && pricing.sourceDiscountedPrice != null
      ? formatPrice(pricing.sourceDiscountedPrice, pricing.sourceCurrency, locale)
      : pricing?.sourceCurrency && pricing.sourceBasePrice != null
        ? formatPrice(pricing.sourceBasePrice, pricing.sourceCurrency, locale)
        : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6 space-y-6 sticky top-20">
      {pricing ? (
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1.5">
            {pricing.pricePerPerson ? t(locale, "perPersonFrom") : t(locale, "totalFrom")}
          </p>
          <div className="flex items-baseline gap-3 flex-wrap">
            {pricing.discountedPrice ? (
              <>
                <span className="text-4xl font-black text-gray-900">
                  {formatPrice(pricing.discountedPrice, pricing.currency, locale)}
                </span>
                <span className="text-base text-gray-400 line-through">
                  {formatPrice(pricing.basePrice, pricing.currency, locale)}
                </span>
                <span className="badge bg-wandr-50 text-wandr-600 font-bold">
                  {t(locale, "savePercent", {
                    percent: Math.round(
                      ((pricing.basePrice - pricing.discountedPrice) / pricing.basePrice) * 100
                    ),
                  })}
                </span>
              </>
            ) : (
              <span className="text-4xl font-black text-gray-900">
                {formatPrice(pricing.basePrice, pricing.currency, locale)}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1.5">{t(locale, "livePricingNote")}</p>
          {sourceAmount && pricing.exchangeRate && pricing.sourceCurrency && (
            <p className="text-xs text-gray-400 mt-1">
              {t(locale, "convertedFromNote", {
                amount: sourceAmount,
                source: pricing.sourceCurrency,
                rate: pricing.exchangeRate.toFixed(4),
                target: pricing.currency,
                date: pricing.ratesUpdatedAt
                  ? formatDate(pricing.ratesUpdatedAt, locale, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "",
              })}
            </p>
          )}
        </div>
      ) : (
        <div className="animate-pulse space-y-2">
          <div className="h-3 w-24 bg-gray-100 rounded" />
          <div className="h-9 w-36 bg-gray-100 rounded" />
        </div>
      )}

      <button className="w-full btn-primary py-3.5 text-base rounded-xl">
        {t(locale, "bookNow")}
      </button>

      {availability && availability.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            {t(locale, "upcomingDepartures")}
          </h3>
          <ul className="space-y-2">
            {availability.slice(0, 5).map((slot) => (
              <li
                key={slot.date}
                className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-0"
              >
                <span className="text-gray-700 font-medium">
                  {formatDate(slot.date, locale, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusClass[slot.status]}`}
                >
                  {slot.status === "sold_out"
                    ? statusLabels.sold_out
                    : t(locale, "spotsLeft", { count: slot.spotsRemaining })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">{t(locale, "freeCancellation")}</p>
    </div>
  );
}
