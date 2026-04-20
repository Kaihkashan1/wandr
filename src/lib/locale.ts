import type { Locale } from "@/types";

export const LOCALES: Locale[] = ["en", "de", "fr", "es"];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
};

export const DEFAULT_LOCALE: Locale = "en";

export function isValidLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function resolveLocale(value: string | undefined | null): Locale {
  if (value && isValidLocale(value)) return value;
  return DEFAULT_LOCALE;
}
