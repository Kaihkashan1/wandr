import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { getTours } from "@/lib/fetchers";
import { resolveLocale } from "@/lib/locale";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tours",
  description: "Handpicked tours and experiences around the world.",
};

const DIFFICULTY_COLORS = {
  easy: "bg-green-100 text-green-700",
  moderate: "bg-blue-100 text-blue-700",
  challenging: "bg-amber-100 text-amber-700",
  expert: "bg-red-100 text-red-700",
};

export default async function ToursPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("locale")?.value);
  const tours = await getTours(locale);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Tours & experiences</h1>
      <p className="text-gray-500 mb-10">
        {tours.length} tours with live pricing and availability.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tours.map((tour) => (
          <Link
            key={tour.id}
            href={`/tours/${tour.slug}`}
            className="group block rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <div className="relative h-56">
              {tour.heroImage ? (
                <Image
                  src={tour.heroImage.url}
                  alt={tour.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[tour.difficulty]}`}
                >
                  {tour.difficulty}
                </span>
                <span className="text-xs text-gray-400">
                  {tour.durationDays}d
                </span>
                {tour.destination && (
                  <span className="text-xs text-gray-400">
                    · {tour.destination.name}
                  </span>
                )}
              </div>
              <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {tour.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {tour.summary}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
