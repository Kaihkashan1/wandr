import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Nav } from "@/components/ui/Nav";
import { resolveLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: {
    default: "Wandr — Discover the world",
    template: "%s | Wandr",
  },
  description:
    "Discover handpicked destinations, tours, and travel guides from around the world.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("locale")?.value);

  return (
    <html lang={locale}>
      <body className="bg-white text-gray-900 antialiased">
        <Nav locale={locale} />
        <main>{children}</main>
      </body>
    </html>
  );
}
