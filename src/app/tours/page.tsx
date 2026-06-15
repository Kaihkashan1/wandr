import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { getTours } from "@/lib/fetchers";
import { t } from "@/lib/i18n";
import { resolveLocale } from "@/lib/locale";
import type { Metadata } from "next";
import type { TourDifficulty } from "@/types";

export const metadata: Metadata = {
  title: "Tours",
  description: "Handpicked tours and experiences around the world.",
};

const DIFFICULTY_CLASS: Record<TourDifficulty, string> = {
  easy: "difficulty-easy",
  moderate: "difficulty-moderate",
  challenging: "difficulty-challenging",
  expert: "difficulty-expert",
};

export default async function ToursPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("locale")?.value);
  const tours = await getTours(locale);

  return (
    <div>
      <PageHeader
        label={t(locale, "toursPageLabel")}
        title={t(locale, "toursPageTitle")}
        description={t(locale, "toursPageDesc", { count: tours.length })}
      />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tours.map((tour) => (
            <Link
              key={tour.id}
              href={`/tours/${tour.slug}`}
              className="card group flex flex-col"
            >
              <div className="relative h-60 overflow-hidden">
                {tour.heroImage ? (
                  <Image
                    src={tour.heroImage.url}
                    alt={tour.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-navy-500 to-navy-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className={DIFFICULTY_CLASS[tour.difficulty]}>
                    {tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1)}
                  </span>
                  <span className="badge bg-black/40 text-white backdrop-blur-sm">
                    {tour.durationDays} days
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                {tour.destination && (
                  <p className="text-xs text-gray-400 mb-1">{tour.destination.name}</p>
                )}
                <h2 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-wandr-600 transition-colors">
                  {tour.title}
                </h2>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2 flex-1 leading-relaxed">
                  {tour.summary}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">{t(locale, "livePricing")}</span>
                  <span className="text-wandr-600 text-sm font-semibold group-hover:underline">
                    {t(locale, "viewDetails")} &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
