import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const draft = await draftMode();
  draft.disable();
  const returnTo = searchParams.get("returnTo") ?? "/";
  redirect(returnTo);
}
