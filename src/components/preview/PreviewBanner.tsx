import Link from "next/link";
import { t } from "@/lib/i18n";
import type { Locale } from "@/types";

interface PreviewBannerProps {
  contentId: string;
  model: string;
  locale: Locale;
}

export function PreviewBanner({ contentId, model, locale }: PreviewBannerProps) {
  const hygraphAppUrl = `https://app.hygraph.com`;

  return (
    <div className="preview-banner flex items-center justify-between px-6">
      <span>{t(locale, "previewActive", { model })}</span>
      <div className="flex items-center gap-4 text-xs">
        <a
          href={`${hygraphAppUrl}/content/${contentId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:no-underline"
        >
          {t(locale, "openInHygraph")}
        </a>
        <Link
          href={`/api/preview/disable?returnTo=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/")}`}
          className="underline hover:no-underline"
        >
          {t(locale, "exitPreview")}
        </Link>
      </div>
    </div>
  );
}
