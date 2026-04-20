import Link from "next/link";

interface PreviewBannerProps {
  contentId: string;
  model: string;
}

export function PreviewBanner({ contentId, model }: PreviewBannerProps) {
  const hygraphAppUrl = `https://app.hygraph.com`;

  return (
    <div className="preview-banner flex items-center justify-between px-6">
      <span>
        Preview mode active — you are viewing unpublished content ({model})
      </span>
      <div className="flex items-center gap-4 text-xs">
        <a
          href={`${hygraphAppUrl}/content/${contentId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:no-underline"
        >
          Open in Hygraph
        </a>
        <Link
          href={`/api/preview/disable?returnTo=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/")}`}
          className="underline hover:no-underline"
        >
          Exit preview
        </Link>
      </div>
    </div>
  );
}
