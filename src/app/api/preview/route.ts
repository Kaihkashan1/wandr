import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  const model = searchParams.get("model") ?? "destination";

  // Validate secret
  if (secret !== process.env.PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }

  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  // Enable Draft Mode
  const draft = await draftMode();
  draft.enable();

  // Redirect to the relevant page
  const routes: Record<string, string> = {
    destination: `/destinations/${slug}`,
    tour: `/tours/${slug}`,
    guide: `/guides/${slug}`,
  };

  const path = routes[model.toLowerCase()] ?? `/destinations/${slug}`;
  redirect(path);
}
