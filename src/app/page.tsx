import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { getDestinations } from "@/lib/fetchers";
import { resolveLocale } from "@/lib/locale";

export default async function HomePage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("locale")?.value);
  const destinations = await getDestinations(locale);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative h-[72vh] min-h-[520px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-700 to-navy-500" />
        <div className="absolute inset-0 bg-hero-mesh" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Decorative orbs */}
        <div className="absolute top-1/4 right-[10%] w-64 h-64 rounded-full bg-wandr-500/10 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-1/4 left-[5%] w-48 h-48 rounded-full bg-wandr-400/10 blur-3xl" aria-hidden="true" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
          <p className="section-label text-wandr-400/80 mb-4">Discover the world</p>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.05] max-w-2xl tracking-tight">
            Find your next{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-wandr-400 to-wandr-200">
              adventure
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/75 mb-10 max-w-lg leading-relaxed">
            Handpicked destinations, immersive tours, and expert travel guides
            crafted for curious explorers.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/destinations" className="btn-primary text-base px-8 py-3.5">
              Explore destinations
            </Link>
            <Link href="/tours" className="btn-secondary text-base px-8 py-3.5">
              Browse tours
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* ── Category pills ── */}
      <section className="max-w-6xl mx-auto px-6 -mt-4 mb-12">
        <div className="flex flex-wrap gap-3">
          {["Adventure", "Cultural", "Beach & Island", "City Break", "Nature & Wildlife", "Food & Wine"].map((cat) => (
            <span key={cat} className="category-pill">
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* ── Featured destinations ── */}
      <section className="max-w-6xl mx-auto px-6 py-8 pb-20">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="section-heading">Popular destinations</h2>
            <p className="text-sm text-gray-500 mt-2">
              {destinations.length} destinations to explore
            </p>
          </div>
          <Link
            href="/destinations"
            className="text-sm font-semibold text-wandr-600 hover:text-wandr-700 transition-colors shrink-0"
          >
            View all &rarr;
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
                    Popular
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

      {/* ── Why Wandr ── */}
      <section className="bg-navy-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-mesh opacity-50" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="section-label text-white/40 mb-3">Why Wandr</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Travel with confidence
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "✦",
                title: "Curated experiences",
                desc: "Every destination and tour is hand-selected by our expert team of travel writers.",
              },
              {
                icon: "◆",
                title: "Live availability",
                desc: "Real-time pricing and availability pulled directly from our booking system.",
              },
              {
                icon: "◈",
                title: "Local expertise",
                desc: "Guides written in multiple languages by local experts who know their regions.",
              },
            ].map((item) => (
              <div key={item.title} className="feature-card">
                <div className="text-wandr-400 text-3xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
