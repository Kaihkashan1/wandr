"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { LOCALES, LOCALE_LABELS } from "@/lib/locale";
import type { Locale } from "@/types";

interface NavProps {
  locale: Locale;
}

export function Nav({ locale }: NavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function setPreference(key: "locale", value: string) {
    await fetch("/api/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: value }),
    });
    router.refresh();
  }

  const navLinks = [
    { href: "/destinations", label: "Destinations" },
    { href: "/tours", label: "Tours & Experiences" },
    { href: "/guides", label: "Travel Guides" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur-md border-b border-white/5 shadow-lg shadow-navy-900/20">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-wandr-500 font-black text-2xl tracking-tight">
            wandr
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  isActive
                    ? "bg-wandr-500/20 text-wandr-400"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <select
            value={locale}
            onChange={(e) => setPreference("locale", e.target.value)}
            className="text-xs border border-white/20 rounded-full px-3 py-1.5 bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-wandr-500 cursor-pointer"
            aria-label="Switch language"
          >
            {LOCALES.map((l) => (
              <option key={l} value={l} className="bg-navy-900 text-white">
                {LOCALE_LABELS[l]}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-white/10 bg-navy-900/98 backdrop-blur-md px-6 py-4 space-y-1">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive
                    ? "bg-wandr-500/20 text-wandr-400"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
