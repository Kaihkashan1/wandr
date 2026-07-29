"use client";

import { usePathname } from "next/navigation";

function safeReturnTo(pathname: string | null): string {
  if (!pathname || !pathname.startsWith("/") || pathname.startsWith("//")) {
    return "/";
  }
  return pathname;
}

export function PreviewBanner() {
  const pathname = usePathname();
  // Full document navigation (<a>, not Link) so Draft Mode cookies clear reliably.
  const exitHref = `/api/preview/disable?returnTo=${encodeURIComponent(
    safeReturnTo(pathname)
  )}`;

  return (
    <div className="bg-amber-500 text-amber-950 text-sm font-semibold">
      <div className="max-w-6xl mx-auto px-6 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <p>
          Preview mode — showing draft content from Hygraph. Stage badges may say
          Preview even for published entries.
        </p>
        <a
          href={exitHref}
          className="underline underline-offset-2 hover:text-amber-900 shrink-0"
        >
          Exit preview
        </a>
      </div>
    </div>
  );
}
