import { localeToCurrency } from "@/lib/locale";
import { getPimData } from "./pim";
import { convertAmount, getExchangeRates } from "./exchange-rates";
import type { Locale, Tour, TourPricing } from "@/types";

function applyCurrencyConversion(
  pricing: TourPricing,
  targetCurrency: string,
  rate: number,
  ratesUpdatedAt: string
): TourPricing {
  if (pricing.currency === targetCurrency) {
    return pricing;
  }

  const converted: TourPricing = {
    ...pricing,
    sourceCurrency: pricing.currency,
    sourceBasePrice: pricing.basePrice,
    sourceDiscountedPrice: pricing.discountedPrice,
    currency: targetCurrency,
    basePrice: convertAmount(pricing.basePrice, rate),
    discountedPrice: pricing.discountedPrice
      ? convertAmount(pricing.discountedPrice, rate)
      : undefined,
    exchangeRate: rate,
    ratesUpdatedAt,
  };

  return converted;
}

export async function enrichTourWithFederation(
  tour: Tour,
  locale: Locale
): Promise<Tour> {
  const { pricing, availability } = await getPimData(tour.slug);
  const targetCurrency = localeToCurrency(locale);

  try {
    const { rates, updatedAt } = await getExchangeRates(pricing.currency);
    const rate = rates[targetCurrency];

    if (!rate) {
      return { ...tour, pricing, availability };
    }

    const convertedPricing = applyCurrencyConversion(
      pricing,
      targetCurrency,
      rate,
      updatedAt
    );

    return { ...tour, pricing: convertedPricing, availability };
  } catch {
    return { ...tour, pricing, availability };
  }
}
