import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { localeCookieOptions } from "@/lib/cookies";
import { resolveLocale } from "@/lib/locale";
import { withPreviewParams } from "@/lib/preview-utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  const model = searchParams.get("model") ?? "destination";
  const localeParam = searchParams.get("locale");

  const previewSecret = process.env.PREVIEW_SECRET;
  if (previewSecret && secret !== previewSecret) {
    return new Response("Invalid token", { status: 401 });
  }

  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  const secure =
    process.env.NODE_ENV === "production" ||
    request.nextUrl.protocol === "https:";
  const cookieOpts = localeCookieOptions({ secure });

  if (localeParam) {
    const cookieStore = await cookies();
    cookieStore.set("locale", resolveLocale(localeParam), cookieOpts);
  }

  const draft = await draftMode();
  draft.enable();

  const routes: Record<string, string> = {
    destination: `/destinations/${slug}`,
    tour: `/tours/${slug}`,
    guide: `/guides/${slug}`,
  };

  const path = routes[model.toLowerCase()] ?? `/destinations/${slug}`;
  redirect(
    withPreviewParams(path, {
      locale: localeParam ? resolveLocale(localeParam) : undefined,
    })
  );
}
