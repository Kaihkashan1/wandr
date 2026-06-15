import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { localeCookieOptions } from "@/lib/cookies";
import { isValidLocale } from "@/lib/locale";
import { PREVIEW_QUERY_PARAM } from "@/lib/preview-utils";

const HYGRAPH_ORIGINS = [
  "https://app.hygraph.com",
  "https://studio.hygraph.com",
];

function isHygraphOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return (
    HYGRAPH_ORIGINS.includes(origin) ||
    /^https:\/\/([a-z0-9-]+\.)*hygraph\.com$/.test(origin)
  );
}

function applyPreviewHeaders(
  response: NextResponse,
  request: NextRequest
): NextResponse {
  response.headers.set(
    "Content-Security-Policy",
    "frame-ancestors 'self' https://*.hygraph.com https://hygraph.com"
  );

  const origin = request.headers.get("Origin");
  if (origin && isHygraphOrigin(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Vary", "Origin");
  }

  // Required for Chrome Local Network Access when Hygraph Studio embeds localhost.
  response.headers.set("Access-Control-Allow-Private-Network", "true");

  return response;
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get("Origin");

  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });
    if (origin && isHygraphOrigin(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, HEAD"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, RSC, Next-Router-State-Tree, Next-Router-Prefetch"
      );
      response.headers.set("Access-Control-Max-Age", "86400");
    }
    response.headers.set("Access-Control-Allow-Private-Network", "true");
    return response;
  }

  const requestHeaders = new Headers(request.headers);
  const isPreview =
    request.nextUrl.searchParams.get(PREVIEW_QUERY_PARAM) === "1";

  if (isPreview) {
    requestHeaders.set("x-wandr-preview", "1");
  }

  const localeParam = request.nextUrl.searchParams.get("locale");
  if (localeParam && isValidLocale(localeParam)) {
    requestHeaders.set("x-wandr-locale", localeParam);
  }

  const response = applyPreviewHeaders(
    NextResponse.next({ request: { headers: requestHeaders } }),
    request
  );

  if (isPreview || localeParam) {
    response.headers.set(
      "Cache-Control",
      "private, no-store, no-cache, must-revalidate"
    );
  }

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
