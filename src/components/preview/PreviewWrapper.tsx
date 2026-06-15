"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

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

function normalizeStudioUrl(url: string | undefined): string | undefined {
  return url?.trim().replace(/\/$/, "") || undefined;
}

export function PreviewWrapper({ children }: PreviewWrapperProps) {
  const router = useRouter();
  const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT?.trim();
  const studioUrl = normalizeStudioUrl(
    process.env.NEXT_PUBLIC_HYGRAPH_STUDIO_URL
  );

  // Both are required — wrong/missing studioUrl breaks click-to-edit on regional Studio hosts.
  if (!endpoint || !studioUrl) {
    return <>{children}</>;
  }

  return (
    <HygraphPreviewNextjs
      endpoint={endpoint}
      studioUrl={studioUrl}
      allowedOrigins={[
        "https://app.hygraph.com",
        "https://studio.hygraph.com",
        "https://*.hygraph.com",
        "https://*.hygraph.dev",
      ]}
      refresh={() => router.refresh()}
      sync={{ fieldFocus: true, fieldUpdate: false }}
      overlay={{
        style: { borderColor: "#f97316", borderWidth: "2px" },
        button: { backgroundColor: "#f97316", color: "white" },
      }}
    >
      {children}
    </HygraphPreviewNextjs>
  );
}
