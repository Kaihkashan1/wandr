"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PREVIEW_QUERY_PARAM } from "@/lib/preview-utils";

const SESSION_KEY = "wandr-preview";

/**
 * Soft navigations (Next.js <Link>) update the URL without ?preview=1.
 * Middleware only redirects full document GETs, so keep the query in sync
 * on the client while preview is active.
 */
export function PersistPreviewQuery({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (enabled || searchParams.get(PREVIEW_QUERY_PARAM) === "1") {
      sessionStorage.setItem(SESSION_KEY, "1");
      return;
    }
  }, [enabled, searchParams]);

  useEffect(() => {
    const sessionActive = sessionStorage.getItem(SESSION_KEY) === "1";
    const active = enabled || sessionActive;
    if (!active) return;
    if (searchParams.get(PREVIEW_QUERY_PARAM) === "1") return;

    const params = new URLSearchParams(searchParams.toString());
    params.set(PREVIEW_QUERY_PARAM, "1");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [enabled, pathname, router, searchParams]);

  return null;
}

/** Call from Exit preview so soft-nav persistence stops. */
export function clearPreviewSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}
