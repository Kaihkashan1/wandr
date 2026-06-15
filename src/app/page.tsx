import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { CategoryPills } from "@/components/ui/CategoryPills";
import { getDestinations } from "@/lib/fetchers";
import { t } from "@/lib/i18n";
import { resolveLocale } from "@/lib/locale";

export default async function HomePage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("locale")?.value);
  const destinations = await getDestinations(locale);

  const features = [
    { icon: "✦", titleKey: "featureCuratedTitle" as const, descKey: "featureCuratedDesc" as const },
    { icon: "◆", titleKey: "featureLiveTitle" as const, descKey: "featureLiveDesc" as const },
    { icon: "◈", titleKey: "featureLocalTitle" as const, descKey: "featureLocalDesc" as const },
  ];

  return (
    <div>
      <section className="relative h-[72vh] min-h-[520px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-700 to-navy-500" />
        <div className="absolute inset-0 bg-hero-mesh" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-1/4 right-[10%] w-64 h-64 rounded-full bg-wandr-500/10 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-1/4 left-[5%] w-48 h-48 rounded-full bg-wandr-400/10 blur-3xl" aria-hidden="true" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
          <p className="section-label text-wandr-400/80 mb-4">{t(locale, "heroLabel")}</p>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.05] max-w-2xl tracking-tight">
            {t(locale, "heroTitle")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-wandr-400 to-wandr-200">
              {t(locale, "heroTitleAccent")}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/75 mb-10 max-w-lg leading-relaxed">
            {t(locale, "heroSubtitle")}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/destinations" className="btn-primary text-base px-8 py-3.5">
              {t(locale, "heroCtaDestinations")}
            </Link>
            <Link href="/tours" className="btn-secondary text-base px-8 py-3.5">
              {t(locale, "heroCtaTours")}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent pointer-events-none" />
      </section>

      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-4 pb-10">
        <CategoryPills locale={locale} />
      </section>

      <section className="max-w-6xl mx-auto px-6 py-8 pb-20">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="section-heading">{t(locale, "popularDestinations")}</h2>
            <p className="text-sm text-gray-500 mt-2">
              {t(locale, "destinationsCount", { count: destinations.length })}
            </p>
          </div>
          <Link
            href="/destinations"
            className="text-sm font-semibold text-wandr-600 hover:text-wandr-700 transition-colors shrink-0"
          >
            {t(locale, "viewAll")} &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.slice(0, 6).map((destination, idx) => (
            <Link
              key={destination.id}
              href={`/destinations/${destination.slug}`}
              className="card group block"
            >
              <div className="relative h-56 overflow-hidden">
                {destination.heroImage ? (
                  <Image
                    src={destination.heroImage.url}
                    alt={destination.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-navy-500 to-navy-900" />
                )}
                {idx === 0 && (
                  <span className="absolute top-3 left-3 bg-wandr-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-glow">
                    {t(locale, "popular")}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="text-white/90 text-xs font-medium bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {destination.region}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-wandr-600 transition-colors">
                  {destination.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1.5 leading-snug line-clamp-2">
                  {destination.tagline}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-gray-400">{destination.country}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-navy-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-mesh opacity-50" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="section-label text-white/40 mb-3">{t(locale, "whyWandrLabel")}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {t(locale, "whyWandrTitle")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((item) => (
              <div key={item.titleKey} className="feature-card">
                <div className="text-wandr-400 text-3xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-white mb-2">{t(locale, item.titleKey)}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{t(locale, item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
