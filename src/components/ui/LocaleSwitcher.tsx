"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LOCALES, LOCALE_LABELS } from "@/lib/locale";
import { PREVIEW_QUERY_PARAM } from "@/lib/preview-utils";
import { t } from "@/lib/i18n";
import type { Locale } from "@/types";

interface LocaleSwitcherProps {
  locale: Locale;
  variant?: "nav" | "preview";
  /** URL-based locale switch for Hygraph preview (?preview=1&locale=) */
  previewMode?: boolean;
}

export function LocaleSwitcher({
  locale,
  variant = "nav",
  previewMode = false,
}: LocaleSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isPreviewStyle = variant === "preview";

  async function switchLocale(next: Locale) {
    if (next === locale) return;

    if (previewMode) {
      const params = new URLSearchParams(searchParams.toString());
      params.set(PREVIEW_QUERY_PARAM, "1");
      params.set("locale", next);
      window.location.assign(`${pathname}?${params.toString()}`);
      return;
    }

    await fetch("/api/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: next }),
    });

    router.refresh();
  }

  return (
    <div
      className={
        isPreviewStyle
          ? "flex items-center gap-1 p-1 rounded-full bg-gray-100 border border-gray-200 shadow-sm"
          : "flex items-center gap-1 p-1 rounded-full bg-white/10 border border-white/15"
      }
      role="group"
      aria-label={t(locale, "switchLanguage")}
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchLocale(l)}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors ${
            l === locale
              ? "bg-wandr-500 text-white shadow-sm"
              : isPreviewStyle
                ? "text-gray-500 hover:text-gray-900 hover:bg-gray-200"
                : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
          aria-current={l === locale ? "true" : undefined}
          title={LOCALE_LABELS[l]}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
