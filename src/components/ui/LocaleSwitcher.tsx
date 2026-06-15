"use client";

import { useRouter } from "next/navigation";
import { LOCALES, LOCALE_LABELS } from "@/lib/locale";
import { t } from "@/lib/i18n";
import type { Locale } from "@/types";

interface LocaleSwitcherProps {
  locale: Locale;
}

export function LocaleSwitcher({ locale }: LocaleSwitcherProps) {
  const router = useRouter();

  async function switchLocale(next: Locale) {
    if (next === locale) return;
    await fetch("/api/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: next }),
    });
    router.refresh();
  }

  return (
    <div
      className="flex items-center gap-1 p-1 rounded-full bg-white/10 border border-white/15"
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
