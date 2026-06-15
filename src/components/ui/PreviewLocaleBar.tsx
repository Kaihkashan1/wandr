import { Suspense } from "react";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { t } from "@/lib/i18n";
import type { Locale } from "@/types";

interface PreviewLocaleBarProps {
  locale: Locale;
}

export function PreviewLocaleBar({ locale }: PreviewLocaleBarProps) {
  return (
    <div className="sticky top-16 z-40 flex items-center justify-between gap-4 px-4 py-2 bg-white/95 border-b border-gray-200 backdrop-blur-sm shadow-sm">
      <span className="text-xs font-medium text-gray-500">
        {t(locale, "switchLanguage")}
      </span>
      <Suspense fallback={null}>
        <LocaleSwitcher locale={locale} variant="preview" />
      </Suspense>
    </div>
  );
}
