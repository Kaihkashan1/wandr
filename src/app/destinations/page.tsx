import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { getDestinations } from "@/lib/fetchers";
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

  // Group by region
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
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Destinations</h1>
      <p className="text-gray-500 mb-10">
        {destinations.length} destinations across{" "}
        {Object.keys(byRegion).length} regions.
      </p>

      {Object.entries(byRegion).map(([region, items]) => (
        <section key={region} className="mb-14">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-6">
            {region}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((destination) => (
              <Link
                key={destination.id}
                href={`/destinations/${destination.slug}`}
                className="group block rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="relative h-52">
                  {destination.heroImage ? (
                    <Image
                      src={destination.heroImage.url}
                      alt={destination.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1">
                    {destination.country}
                  </p>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {destination.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {destination.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
