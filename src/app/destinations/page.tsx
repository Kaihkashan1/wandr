import { cookies } from "next/headers";
import Image from "next/image";
import { PreviewLink } from "@/components/preview/PreviewLink";
import { CategoryPills } from "@/components/ui/CategoryPills";
import {
  categoryKeyForSlug,
  filterDestinationsByCategory,
  isValidCategory,
} from "@/lib/categories";
import { getDestinations } from "@/lib/fetchers";
import { t } from "@/lib/i18n";
import { resolveLocale } from "@/lib/locale";
import type { Metadata } from "next";

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("locale")?.value);
  const sp = await searchParams;
  const category = isValidCategory(sp.category) ? sp.category : null;

  const title = category
    ? `${t(locale, categoryKeyForSlug(category))} — ${t(locale, "metaDestinationsTitle")}`
    : t(locale, "metaDestinationsTitle");

  return {
    title,
    description: t(locale, "metaDestinationsDescription"),
  };
}

export default async function DestinationsPage({ searchParams }: Props) {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("locale")?.value);
  const sp = await searchParams;
  const category = isValidCategory(sp.category) ? sp.category : null;

  const allDestinations = await getDestinations(locale);
  const destinations = filterDestinationsByCategory(allDestinations, category);

  const pageTitle = category
    ? t(locale, categoryKeyForSlug(category))
    : t(locale, "destinationsPageTitle");

  return (
    <div className="bg-gray-50">
      <header className="relative bg-navy-900 overflow-hidden">
        <div className="page-header-glow" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-6 py-5 md:py-6">
          <p className="section-label text-white/40 mb-1.5">
            {t(locale, "destinationsPageLabel")}
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 md:gap-8">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              {pageTitle}
            </h1>
            <p className="text-white/55 text-sm md:text-base max-w-xl leading-snug md:text-right">
              {t(locale, "destinationsPageDesc")}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-4">
        <CategoryPills locale={locale} activeCategory={category} />
        {category && (
          <p className="mt-2">
            <PreviewLink
              href="/destinations"
              className="text-sm font-semibold text-wandr-600 hover:text-wandr-700 transition-colors"
            >
              {t(locale, "clearCategoryFilter")} &rarr;
            </PreviewLink>
          </p>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-6">
        {destinations.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            {t(locale, "noDestinationsInCategory")}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {destinations.map((destination) => (
              <PreviewLink
                key={destination.id}
                href={`/destinations/${destination.slug}`}
                className="card group block"
              >
                <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden">
                  {destination.heroImage ? (
                    <Image
                      src={destination.heroImage.url}
                      alt={destination.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-navy-500 to-navy-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {destination.region && (
                      <span className="text-white/90 text-[10px] font-semibold uppercase tracking-wider bg-black/35 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {destination.region}
                      </span>
                    )}
                    {destination.country && (
                      <span className="text-white/80 text-[10px] font-medium bg-black/25 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {destination.country}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 pt-12">
                    <h2 className="font-bold text-white text-xl leading-tight group-hover:text-wandr-200 transition-colors">
                      {destination.name}
                    </h2>
                    <p className="text-sm text-white/80 mt-1.5 line-clamp-2 leading-snug">
                      {destination.tagline}
                    </p>
                  </div>
                </div>
              </PreviewLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
