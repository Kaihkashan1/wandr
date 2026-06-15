import { notFound } from "next/navigation";
import { cookies, draftMode } from "next/headers";
import Image from "next/image";
import { getTourBySlug, getAllTourSlugs } from "@/lib/fetchers";
import { difficultyLabel, t } from "@/lib/i18n";
import { resolveLocale } from "@/lib/locale";
import { StageBadge } from "@/components/ui/StageBadge";
import { PreviewBanner } from "@/components/preview/PreviewBanner";
import { RichText } from "@/components/ui/RichText";
import { TourPricingCard } from "@/components/ui/TourPricingCard";
import type { Metadata } from "next";
import type { TourDifficulty } from "@/types";

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

const DIFFICULTY_CLASS: Record<TourDifficulty, string> = {
  easy: "difficulty-easy",
  moderate: "difficulty-moderate",
  challenging: "difficulty-challenging",
  expert: "difficulty-expert",
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
      {preview && <PreviewBanner contentId={tour.id} model="Tour" locale={locale} />}

      <section className="relative h-[55vh] min-h-[380px]">
        {tour.heroImage ? (
          <Image
            src={tour.heroImage.url}
            alt={tour.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy-500 to-navy-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="relative z-10 h-full flex items-end max-w-6xl mx-auto px-6 pb-12">
          <div>
            <div className="flex items-center flex-wrap gap-2 mb-4">
              <span className={DIFFICULTY_CLASS[tour.difficulty]}>
                {difficultyLabel(locale, tour.difficulty)}
              </span>
              <span className="badge bg-white/20 text-white backdrop-blur-sm">
                {t(locale, "days", { count: tour.durationDays })}
              </span>
              {tour.destination && (
                <span className="badge bg-white/20 text-white backdrop-blur-sm">
                  {tour.destination.name}
                </span>
              )}
              {preview && <StageBadge stage={tour.stage} />}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight max-w-2xl">
              {tour.title}
            </h1>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <p className="text-lg text-gray-600 leading-relaxed">{tour.summary}</p>

            {tour.highlights?.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4 text-gray-900">{t(locale, "highlights")}</h2>
                <ul className="space-y-2.5">
                  {tour.highlights.map((h, i) => (
                    <li key={i} className="flex gap-3 text-gray-700">
                      <span className="text-wandr-500 font-bold mt-0.5 shrink-0">&#10003;</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h2 className="text-xl font-bold mb-4 text-gray-900">{t(locale, "aboutTour")}</h2>
              <div className="prose-wandr">
                <RichText content={tour.description} />
              </div>
            </section>

            <div className="grid grid-cols-2 gap-6">
              {tour.included?.length > 0 && (
                <section className="bg-emerald-50 rounded-2xl p-5">
                  <h3 className="font-bold mb-3 text-emerald-800">{t(locale, "included")}</h3>
                  <ul className="space-y-2 text-sm text-emerald-900">
                    {tour.included.map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-emerald-500 font-bold shrink-0">+</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {tour.excluded?.length > 0 && (
                <section className="bg-red-50 rounded-2xl p-5">
                  <h3 className="font-bold mb-3 text-red-800">{t(locale, "notIncluded")}</h3>
                  <ul className="space-y-2 text-sm text-red-900">
                    {tour.excluded.map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-red-400 font-bold shrink-0">&#8722;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>

          <aside>
            <TourPricingCard
              locale={locale}
              pricing={tour.pricing}
              availability={tour.availability}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
