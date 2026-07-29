"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  type ComponentProps,
  type ReactNode,
} from "react";
import { hrefWithPreview, PREVIEW_QUERY_PARAM } from "@/lib/preview-utils";

type LinkProps = ComponentProps<typeof Link>;

function PreviewLinkInner({ href, ...rest }: LinkProps) {
  const searchParams = useSearchParams();
  const preview = searchParams.get(PREVIEW_QUERY_PARAM) === "1";
  const locale = searchParams.get("locale");
  const nextHref =
    typeof href === "string"
      ? hrefWithPreview(href, {
          preview,
          locale: preview ? locale : undefined,
        })
      : href;

  return <Link href={nextHref} {...rest} />;
}

/** Drop-in Link that keeps ?preview=1 (and locale) during preview. */
export function PreviewLink(props: LinkProps) {
  return (
    <Suspense fallback={<Link {...props} />}>
      <PreviewLinkInner {...props} />
    </Suspense>
  );
}

export function PreviewLinkList({
  children,
}: {
  children: ReactNode;
}) {
  return <Suspense fallback={children}>{children}</Suspense>;
}
