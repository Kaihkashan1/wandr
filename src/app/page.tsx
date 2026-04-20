import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { getDestinations } from "@/lib/fetchers";
import { resolveLocale } from "@/lib/locale";
import { StageBadge } from "@/components/ui/StageBadge";

export default async function HomePage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("locale")?.value);
  const destinations = await getDestinations(locale);

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[480px] flex items-end">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-600" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-16 w-full">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Discover the world, your way
          </h1>
          <p className="text-lg text-white/90 mb-8 max-w-xl">
            Handpicked destinations, immersive tours, and expert travel guides.
          </p>
          <Link
            href="/destinations"
            className="inline-block bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            Explore destinations
          </Link>
        </div>
      </section>

      {/* ── Destinations grid ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-2xl font-bold">Popular destinations</h2>
          <Link
            href="/destinations"
            className="text-sm text-blue-600 hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.slice(0, 6).map((destination) => (
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
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {destination.region}
                    </p>
                    <h3 className="font-semibold text-gray-900">
                      {destination.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {destination.tagline}
                    </p>
                  </div>
                  <StageBadge stage={destination.stage} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
