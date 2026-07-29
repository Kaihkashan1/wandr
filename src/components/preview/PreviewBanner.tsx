"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function PreviewBanner() {
  const pathname = usePathname();
  const exitHref = `/api/preview/disable?returnTo=${encodeURIComponent(pathname || "/")}`;

  return (
    <div className="bg-amber-500 text-amber-950 text-sm font-semibold">
      <div className="max-w-6xl mx-auto px-6 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <p>
          Preview mode — showing draft content from Hygraph. Stage badges may say
          Draft even for published entries.
        </p>
        <Link
          href={exitHref}
          className="underline underline-offset-2 hover:text-amber-900 shrink-0"
        >
          Exit preview
        </Link>
      </div>
    </div>
  );
}
