export const PREVIEW_QUERY_PARAM = "preview";

export function hasPreviewQueryParam(
  searchParams?: { preview?: string } | null
): boolean {
  return searchParams?.preview === "1";
}

export function withPreviewParams(
  path: string,
  params?: { locale?: string }
): string {
  const url = new URL(path, "http://local");
  url.searchParams.set(PREVIEW_QUERY_PARAM, "1");
  if (params?.locale) {
    url.searchParams.set("locale", params.locale);
  }
  return `${url.pathname}${url.search}`;
}
