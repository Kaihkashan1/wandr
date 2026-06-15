import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Nav } from "@/components/ui/Nav";
import { PreviewLocaleBar } from "@/components/ui/PreviewLocaleBar";
import { t } from "@/lib/i18n";
import { resolveRequestLocale } from "@/lib/request-locale";
import { isPreviewEnabled } from "@/lib/preview";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveRequestLocale();
  return {
    title: {
      default: t(locale, "metaSiteTitle"),
      template: `%s | Wandr`,
    },
    description: t(locale, "metaSiteDescription"),
  };
}

const footerLinkKeys = [
  { href: "/destinations", key: "navDestinations" as const },
  { href: "/tours", key: "navTours" as const },
  { href: "/guides", key: "navGuides" as const },
];

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await resolveRequestLocale();
  const preview = await isPreviewEnabled();

  return (
    <html lang={locale} className={inter.variable}>
      <body className="bg-gray-50 text-gray-900 antialiased min-h-screen flex flex-col">
        <Nav locale={locale} />
        {preview && <PreviewLocaleBar locale={locale} />}
        <main className="flex-1">{children}</main>
        <footer className="bg-navy-900 text-white/60 mt-auto border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-14">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
              <div className="space-y-4">
                <Link href="/" className="text-wandr-500 font-black text-2xl tracking-tight inline-block">
                  wandr
                </Link>
                <p className="text-sm leading-relaxed max-w-xs text-white/50">
                  {t(locale, "footerTagline")}
                </p>
              </div>
              <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
                {footerLinkKeys.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white/60 hover:text-wandr-400 transition-colors"
                  >
                    {t(locale, link.key)}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
              <p>&copy; {new Date().getFullYear()} Wandr. {t(locale, "footerRights")}</p>
              <p>{t(locale, "footerMotto")}</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
