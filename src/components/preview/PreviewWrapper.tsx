"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, type ReactNode } from "react";

const HygraphPreviewNextjs = dynamic(
  () =>
    import("@hygraph/preview-sdk/react").then((mod) => ({
      default: mod.HygraphPreviewNextjs,
    })),
  { ssr: false }
);

interface PreviewWrapperProps {
  children: ReactNode;
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

function normalizeStudioUrl(url: string | undefined): string | undefined {
  return url?.trim().replace(/\/$/, "") || undefined;
}

export function PreviewWrapper({ children }: PreviewWrapperProps) {
  const router = useRouter();
  const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT?.trim();
  const studioUrl = normalizeStudioUrl(
    process.env.NEXT_PUBLIC_HYGRAPH_STUDIO_URL
  );

  // Must be stable — HygraphPreview re-inits whenever onSave/refresh identity changes,
  // which tears down overlays and breaks standalone click-to-edit.
  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  const shell = useMemo(
    () => <div className="flex flex-col flex-1 w-full">{children}</div>,
    [children]
  );

  // Both are required — wrong/missing studioUrl breaks click-to-edit on regional Studio hosts.
  if (!endpoint || !studioUrl) {
    return shell;
  }

  return (
    <HygraphPreviewNextjs
      endpoint={endpoint}
      studioUrl={studioUrl}
      allowedOrigins={ALLOWED_ORIGINS}
      refresh={refresh}
      sync={SYNC}
      overlay={OVERLAY}
    >
      {shell}
    </HygraphPreviewNextjs>
  );
}
