import { notFound } from "next/navigation";
import { cookies, draftMode } from "next/headers";
import Image from "next/image";
import { getTourBySlug, getAllTourSlugs } from "@/lib/fetchers";
import { resolveLocale } from "@/lib/locale";
import { StageBadge } from "@/components/ui/StageBadge";
import { PreviewBanner } from "@/components/preview/PreviewBanner";
import { RichText } from "@/components/ui/RichText";
import { TourPricingCard } from "@/components/ui/TourPricingCard";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllTourSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("locale")?.value);
  const tour = await getTourBySlug(slug, locale);
  if (!tour) return {};
  return { title: tour.title, description: tour.summary };
}

const DIFFICULTY_LABELS = {
  easy: "Easy",
  moderate: "Moderate",
  challenging: "Challenging",
  expert: "Expert",
};

const DIFFICULTY_COLORS = {
  easy: "bg-green-100 text-green-700",
  moderate: "bg-blue-100 text-blue-700",
  challenging: "bg-amber-100 text-amber-700",
  expert: "bg-red-100 text-red-700",
};

export default async function TourPage({ params }: Props) {
  const { slug } = await params;
  const { isEnabled: preview } = await draftMode();
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("locale")?.value);

  const tour = await getTourBySlug(slug, locale, preview);
  if (!tour) notFound();

  return (
    <div>
      {preview && <PreviewBanner contentId={tour.id} model="Tour" />}

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[360px]">
        {tour.heroImage ? (
          <Image
            src={tour.heroImage.url}
            alt={tour.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gray-300" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex items-end max-w-5xl mx-auto px-6 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${DIFFICULTY_COLORS[tour.difficulty]}`}
              >
                {DIFFICULTY_LABELS[tour.difficulty]}
              </span>
              <span className="text-white/80 text-sm">
                {tour.durationDays} days
              </span>
              {preview && <StageBadge stage={tour.stage} />}
            </div>
            <h1 className="text-4xl font-bold text-white">{tour.title}</h1>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <p className="text-lg text-gray-600">{tour.summary}</p>

            {tour.highlights?.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">Highlights</h2>
                <ul className="space-y-2">
                  {tour.highlights.map((h, i) => (
                    <li key={i} className="flex gap-3 text-gray-700">
                      <span className="text-green-500 mt-0.5">✓</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h2 className="text-xl font-bold mb-4">About this tour</h2>
              <div className="prose prose-gray max-w-none">
                <RichText content={tour.description} />
              </div>
            </section>

            <div className="grid grid-cols-2 gap-6">
              {tour.included?.length > 0 && (
                <section>
                  <h3 className="font-semibold mb-3 text-green-700">
                    Included
                  </h3>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    {tour.included.map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-green-500">+</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {tour.excluded?.length > 0 && (
                <section>
                  <h3 className="font-semibold mb-3 text-red-600">
                    Not included
                  </h3>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    {tour.excluded.map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-red-400">−</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>

          {/* Sidebar — federated pricing */}
          <aside>
            <TourPricingCard tourId={tour.id} pricing={tour.pricing} availability={tour.availability} />
          </aside>
        </div>
      </div>
    </div>
  );
}
