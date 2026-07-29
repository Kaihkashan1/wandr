import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

function safeReturnTo(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  // Never bounce back into preview via ?preview=1
  const url = new URL(value, "http://local");
  url.searchParams.delete("preview");
  const qs = url.searchParams.toString();
  return qs ? `${url.pathname}?${qs}` : url.pathname;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const draft = await draftMode();
  draft.disable();
  redirect(safeReturnTo(searchParams.get("returnTo")));
}
