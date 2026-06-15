import { unstable_noStore as noStore } from "next/cache";
import { draftMode } from "next/headers";
import { headers } from "next/headers";
import { hasPreviewQueryParam } from "@/lib/preview-utils";

export async function isPreviewEnabled(
  searchParams?: { preview?: string } | null
): Promise<boolean> {
  if (hasPreviewQueryParam(searchParams)) return true;

  const { isEnabled } = await draftMode();
  if (isEnabled) return true;

  const headerStore = await headers();
  return headerStore.get("x-wandr-preview") === "1";
}

/** Opt out of static caching when preview or locale is driven by the URL. */
export function markLocalePreviewDynamic(
  searchParams?: { preview?: string; locale?: string } | null
): void {
  if (hasPreviewQueryParam(searchParams) || searchParams?.locale) {
    noStore();
  }
}

/** Also opts out when middleware marks the request as preview (reliable on Vercel). */
export async function markPreviewDynamic(
  searchParams?: { preview?: string; locale?: string } | null
): Promise<void> {
  markLocalePreviewDynamic(searchParams);
  const headerStore = await headers();
  if (headerStore.get("x-wandr-preview") === "1") {
    noStore();
  }
}
