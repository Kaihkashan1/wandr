import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { resolveLocale } from "@/lib/locale";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const cookieStore = await cookies();

  if (body.locale) {
    const locale = resolveLocale(body.locale);
    cookieStore.set("locale", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }

  return Response.json({ ok: true });
}
