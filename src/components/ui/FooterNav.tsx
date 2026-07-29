"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { hrefWithPreview, PREVIEW_QUERY_PARAM } from "@/lib/preview-utils";
import { t } from "@/lib/i18n";
import type { Locale } from "@/types";

const FOOTER_LINKS = [
  { href: "/destinations", key: "navDestinations" as const },
  { href: "/tours", key: "navTours" as const },
  { href: "/guides", key: "navGuides" as const },
];

function FooterNavInner({ locale }: { locale: Locale }) {
  const searchParams = useSearchParams();
  const preview = searchParams.get(PREVIEW_QUERY_PARAM) === "1";
  const localeParam = searchParams.get("locale");

  return (
    <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
      {FOOTER_LINKS.map((link) => (
        <Link
          key={link.href}
          href={hrefWithPreview(link.href, {
            preview,
            locale: preview ? localeParam : undefined,
          })}
          className="text-white/60 hover:text-wandr-400 transition-colors"
        >
          {t(locale, link.key)}
        </Link>
      ))}
    </nav>
  );
}

export function FooterNav({ locale }: { locale: Locale }) {
  return (
    <Suspense
      fallback={
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/60 hover:text-wandr-400 transition-colors"
            >
              {t(locale, link.key)}
            </Link>
          ))}
        </nav>
      }
    >
      <FooterNavInner locale={locale} />
    </Suspense>
  );
}

function FooterHomeInner() {
  const searchParams = useSearchParams();
  const preview = searchParams.get(PREVIEW_QUERY_PARAM) === "1";
  const localeParam = searchParams.get("locale");
  return (
    <Link
      href={hrefWithPreview("/", {
        preview,
        locale: preview ? localeParam : undefined,
      })}
      className="text-wandr-500 font-black text-2xl tracking-tight inline-block"
    >
      wandr
    </Link>
  );
}

export function FooterHomeLink() {
  return (
    <Suspense
      fallback={
        <Link
          href="/"
          className="text-wandr-500 font-black text-2xl tracking-tight inline-block"
        >
          wandr
        </Link>
      }
    >
      <FooterHomeInner />
    </Suspense>
  );
}
