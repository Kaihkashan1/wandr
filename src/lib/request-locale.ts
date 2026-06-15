import type { Locale } from "@/types";
import { cookies, headers } from "next/headers";
import { resolveLocale } from "@/lib/locale";

export async function resolveRequestLocale(
  searchParams?: { locale?: string } | null
): Promise<Locale> {
  if (searchParams?.locale) {
    return resolveLocale(searchParams.locale);
  }

  const headerStore = await headers();
  const headerLocale = headerStore.get("x-wandr-locale");
  if (headerLocale) {
    return resolveLocale(headerLocale);
  }

  const cookieStore = await cookies();
  return resolveLocale(cookieStore.get("locale")?.value);
}
