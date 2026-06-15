import type { Locale } from "@/types";

export const LOCALES: Locale[] = ["en", "de", "fr", "es"];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
};

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_CURRENCY: Record<Locale, string> = {
  en: "USD",
  de: "EUR",
  fr: "EUR",
  es: "EUR",
};

export function localeToCurrency(locale: Locale): string {
  return LOCALE_CURRENCY[locale];
}

export function isValidLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function resolveLocale(value: string | undefined | null): Locale {
  if (value && isValidLocale(value)) return value;
  return DEFAULT_LOCALE;
}

const DATE_LOCALE: Record<Locale, string> = {
  en: "en-GB",
  de: "de-DE",
  fr: "fr-FR",
  es: "es-ES",
};

export function formatDate(
  value: string | Date,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString(DATE_LOCALE[locale], options);
}

export function formatMoney(
  amount: number,
  currency: string,
  locale: Locale
): string {
  return new Intl.NumberFormat(DATE_LOCALE[locale], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
