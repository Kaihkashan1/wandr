import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { localeCookieOptions } from "@/lib/cookies";
import { isValidLocale } from "@/lib/locale";
import { PREVIEW_QUERY_PARAM } from "@/lib/preview-utils";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const isPreview = request.nextUrl.searchParams.get(PREVIEW_QUERY_PARAM) === "1";

  if (isPreview) {
    requestHeaders.set("x-wandr-preview", "1");
  }

  const localeParam = request.nextUrl.searchParams.get("locale");
  if (localeParam && isValidLocale(localeParam)) {
    requestHeaders.set("x-wandr-locale", localeParam);
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (localeParam && isValidLocale(localeParam)) {
    const secure =
      process.env.NODE_ENV === "production" ||
      request.nextUrl.protocol === "https:";
    response.cookies.set(
      "locale",
      localeParam,
      localeCookieOptions({ secure })
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
