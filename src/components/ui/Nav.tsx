"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LOCALES, LOCALE_LABELS } from "@/lib/locale";
import type { Locale } from "@/types";

interface NavProps {
  locale: Locale;
}

export function Nav({ locale }: NavProps) {
  const router = useRouter();
  const pathname = usePathname();

  async function setPreference(key: "locale", value: string) {
    await fetch("/api/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: value }),
    });
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="font-bold text-lg tracking-tight text-gray-900">
          Wandr
        </Link>

        {/* Primary nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <Link href="/destinations" className="hover:text-gray-900 transition-colors">
            Destinations
          </Link>
          <Link href="/tours" className="hover:text-gray-900 transition-colors">
            Tours
          </Link>
          <Link href="/guides" className="hover:text-gray-900 transition-colors">
            Guides
          </Link>
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Locale switcher */}
          <select
            value={locale}
            onChange={(e) => setPreference("locale", e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Switch language"
          >
            {LOCALES.map((l) => (
              <option key={l} value={l}>
                {LOCALE_LABELS[l]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
