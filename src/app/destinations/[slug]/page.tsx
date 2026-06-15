import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getDestinationBySlug,
  getAllDestinationSlugs,
  getToursForDestination,
  getGuidesForDestination,
} from "@/lib/fetchers";
import { t } from "@/lib/i18n";
import { isPreviewEnabled } from "@/lib/preview";
import { resolveRequestLocale } from "@/lib/request-locale";
import { StageBadge } from "@/components/ui/StageBadge";
import { EditableField } from "@/components/preview/EditableField";
import { QuickFactsCard } from "@/components/ui/QuickFactsCard";
import { RichText } from "@/components/ui/RichText";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string; locale?: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllDestinationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const locale = await resolveRequestLocale(sp);
  const preview = await isPreviewEnabled(sp);
  const destination = await getDestinationBySlug(slug, locale, preview);
  if (!destination) return {};
  return {
    title: destination.name,
    description: destination.tagline,
  };
}

export default async function DestinationPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const preview = await isPreviewEnabled(sp);
  const locale = await resolveRequestLocale(sp);

  const [destination, tours, guides] = await Promise.all([
    getDestinationBySlug(slug, locale, preview),
    preview
      ? Promise.resolve([])
      : getToursForDestination(slug, locale, false),
    preview
      ? Promise.resolve([])
      : getGuidesForDestination(slug, locale, false),
  ]);

  if (!destination) notFound();

  const quickFacts = destination.quickFacts ?? {
    region: destination.region,
    country: destination.country,
    climate: destination.climate,
    bestTimeToVisit: destination.bestTimeToVisit,
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[65vh] min-h-[440px]">
        {destination.heroImage ? (
          <Image
            src={destination.heroImage.url}
            alt={destination.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy-500 to-navy-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="relative z-10 h-full flex items-end max-w-6xl mx-auto px-6 pb-14">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white/70 text-sm font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                {quickFacts.region} &middot; {quickFacts.country}
              </span>
              {preview && <StageBadge stage={destination.stage} />}
            </div>
            <EditableField fieldId={destination.id} fieldName="name" enabled={preview}>
              <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
                {destination.name}
              </h1>
            </EditableField>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main */}
          <div className="lg:col-span-2 space-y-12">
            <EditableField fieldId={destination.id} fieldName="tagline" enabled={preview}>
              <p className="text-xl text-gray-600 leading-relaxed font-medium">
                {destination.tagline}
              </p>
            </EditableField>

            <EditableField fieldId={destination.id} fieldName="description" enabled={preview}>
              <div className="prose-wandr">
                <RichText content={destination.description} />
              </div>
            </EditableField>

            {destination.gallery?.length > 0 && (
              <section>
                <h2 className="section-heading mb-6">{t(locale, "photoGallery")}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {destination.gallery.map((image, idx) => (
                    <div
                      key={image.id}
                      className={`relative overflow-hidden rounded-xl ${
                        idx === 0 ? "col-span-2 row-span-2 aspect-[4/3]" : "aspect-square"
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={`${destination.name} — photo ${idx + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <QuickFactsCard
              facts={quickFacts}
              locale={locale}
              contentId={destination.id}
              preview={preview}
            />
          </aside>
        </div>

        {/* Related tours */}
        {tours.length > 0 && (
          <section className="mt-20 pt-14 border-t border-gray-200">
            <div className="flex items-baseline justify-between mb-8">
              <div>
                <p className="section-label mb-2">{t(locale, "experiences")}</p>
                <h2 className="section-heading">{t(locale, "toursIn", { name: destination.name })}</h2>
              </div>
              <Link
                href="/tours"
                className="text-sm font-semibold text-wandr-600 hover:text-wandr-700 transition-colors"
              >
                {t(locale, "allTours")} &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tours.map((tour) => (
                <Link
                  key={tour.id}
                  href={`/tours/${tour.slug}`}
                  className="card group flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute bottom-3 left-3 badge bg-black/40 text-white backdrop-blur-sm">
                      {t(locale, "days", { count: tour.durationDays })}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 group-hover:text-wandr-600 transition-colors">
                      {tour.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                      {tour.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related guides */}
        {guides.length > 0 && (
          <section className="mt-16">
            <div className="flex items-baseline justify-between mb-8">
              <div>
                <p className="section-label mb-2">{t(locale, "travelGuides")}</p>
                <h2 className="section-heading">{t(locale, "planYourTrip")}</h2>
              </div>
              <Link
                href="/guides"
                className="text-sm font-semibold text-wandr-600 hover:text-wandr-700 transition-colors"
              >
                {t(locale, "allGuides")} &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/guides/${guide.slug}`}
                  className="card group flex flex-col"
                >
                  <div className="relative h-44 overflow-hidden">
                    {guide.coverImage ? (
                      <Image
                        src={guide.coverImage.url}
                        alt={guide.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-navy-500 to-navy-900" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900 group-hover:text-wandr-600 transition-colors line-clamp-2 leading-snug">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2 flex-1 leading-relaxed">
                      {guide.excerpt}
                    </p>
                    {guide.author && (
                      <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
                        {t(locale, "byAuthor", { name: guide.author.name })}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
