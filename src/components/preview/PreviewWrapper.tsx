"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState, type ReactNode } from "react";
import { PREVIEW_QUERY_PARAM } from "@/lib/preview-utils";

const HygraphPreviewNextjs = dynamic(
  () =>
    import("@hygraph/preview-sdk/react").then((mod) => ({
      default: mod.HygraphPreviewNextjs,
    })),
  { ssr: false }
);

interface PreviewWrapperProps {
  children: ReactNode;
  /** Server-detected preview (Draft Mode / middleware). */
  enabled?: boolean;
}

const ALLOWED_ORIGINS = [
  "https://app.hygraph.com",
  "https://studio.hygraph.com",
  "https://*.hygraph.com",
  "https://*.hygraph.dev",
];

const OVERLAY = {
  style: { borderColor: "#f97316", borderWidth: "2px" },
  button: { backgroundColor: "#f97316", color: "white" },
};

const SYNC = { fieldFocus: true, fieldUpdate: false };

const SESSION_KEY = "wandr-preview";

function normalizeStudioUrl(url: string | undefined): string | undefined {
  return url?.trim().replace(/\/$/, "") || undefined;
}

function PreviewSdk({ children }: { children: ReactNode }) {
  const router = useRouter();
  const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT?.trim();
  const studioUrl = normalizeStudioUrl(
    process.env.NEXT_PUBLIC_HYGRAPH_STUDIO_URL
  );

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  if (!endpoint || !studioUrl) {
    return <>{children}</>;
  }

  return (
    <HygraphPreviewNextjs
      endpoint={endpoint}
      studioUrl={studioUrl}
      mode="auto"
      allowedOrigins={ALLOWED_ORIGINS}
      refresh={refresh}
      sync={SYNC}
      overlay={OVERLAY}
    >
      {children}
    </HygraphPreviewNextjs>
  );
}

function PreviewWrapperInner({
  children,
  enabled: serverEnabled = false,
}: PreviewWrapperProps) {
  const searchParams = useSearchParams();
  const urlEnabled = searchParams.get(PREVIEW_QUERY_PARAM) === "1";
  const [sessionEnabled, setSessionEnabled] = useState(false);

  useEffect(() => {
    try {
      if (serverEnabled || urlEnabled) {
        sessionStorage.setItem(SESSION_KEY, "1");
        setSessionEnabled(true);
        return;
      }
      setSessionEnabled(sessionStorage.getItem(SESSION_KEY) === "1");
    } catch {
      setSessionEnabled(false);
    }
  }, [serverEnabled, urlEnabled]);

  const enabled = serverEnabled || urlEnabled || sessionEnabled;
  const shell = <div className="flex flex-col flex-1 w-full">{children}</div>;

  if (!enabled) {
    return shell;
  }

  return <PreviewSdk>{shell}</PreviewSdk>;
}

export function PreviewWrapper(props: PreviewWrapperProps) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col flex-1 w-full">{props.children}</div>
      }
    >
      <PreviewWrapperInner {...props} />
    </Suspense>
  );
}
