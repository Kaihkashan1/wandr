export function localeCookieOptions(options?: { secure?: boolean }) {
  const isProduction = process.env.NODE_ENV === "production";
  const secure = options?.secure ?? isProduction;

  return {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: secure ? ("none" as const) : ("lax" as const),
    secure,
  };
}
