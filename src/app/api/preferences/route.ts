import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { localeCookieOptions } from "@/lib/cookies";
import { resolveLocale } from "@/lib/locale";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const cookieStore = await cookies();

  if (body.locale) {
    const locale = resolveLocale(body.locale);
    const secure =
      process.env.NODE_ENV === "production" ||
      request.nextUrl.protocol === "https:";
    cookieStore.set("locale", locale, localeCookieOptions({ secure }));
  }

  return Response.json({ ok: true });
}
