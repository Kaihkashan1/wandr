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
