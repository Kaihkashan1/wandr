import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { getDestinations } from "@/lib/fetchers";
import { t } from "@/lib/i18n";
import { resolveLocale } from "@/lib/locale";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Explore handpicked destinations around the world.",
};

export default async function DestinationsPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("locale")?.value);
  const destinations = await getDestinations(locale);

  const byRegion = destinations.reduce<Record<string, typeof destinations>>(
    (acc, d) => {
      const key = d.region ?? "Other";
      if (!acc[key]) acc[key] = [];
      acc[key].push(d);
      return acc;
    },
    {}
  );

  return (
    <div>
      <PageHeader
        label={t(locale, "destinationsPageLabel")}
        title={t(locale, "destinationsPageTitle")}
        description={t(locale, "destinationsPageDesc", {
          count: destinations.length,
          regions: Object.keys(byRegion).length,
        })}
      />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {Object.entries(byRegion).map(([region, items]) => (
          <section key={region} className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="section-label">{region}</h2>
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">{items.length} destinations</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((destination) => (
                <Link
                  key={destination.id}
                  href={`/destinations/${destination.slug}`}
                  className="card group block"
                >
                  <div className="relative h-52 overflow-hidden">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="text-white/80 text-xs font-medium bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {destination.country}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 group-hover:text-wandr-600 transition-colors">
                      {destination.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-snug">
                      {destination.tagline}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
