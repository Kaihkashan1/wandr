import { notFound } from "next/navigation";
import { cookies, draftMode } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import {
  getDestinationBySlug,
  getAllDestinationSlugs,
  getToursForDestination,
  getGuidesForDestination,
} from "@/lib/fetchers";
import { resolveLocale, LOCALE_LABELS } from "@/lib/locale";
import { StageBadge } from "@/components/ui/StageBadge";
import { EditableField } from "@/components/preview/EditableField";
import { PreviewBanner } from "@/components/preview/PreviewBanner";
import { RichText } from "@/components/ui/RichText";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllDestinationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("locale")?.value);
  const destination = await getDestinationBySlug(slug, locale);
  if (!destination) return {};
  return {
    title: destination.name,
    description: destination.tagline,
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const { isEnabled: preview } = await draftMode();
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("locale")?.value);

  const [destination, tours, guides] = await Promise.all([
    getDestinationBySlug(slug, locale, preview),
    getToursForDestination(slug, locale, preview),
    getGuidesForDestination(slug, locale, preview),
  ]);

  if (!destination) notFound();

  return (
    <div>
      {preview && <PreviewBanner contentId={destination.id} model="Destination" />}

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
                {destination.region} &middot; {destination.country}
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
                <h2 className="section-heading mb-6">Photo gallery</h2>
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
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4 sticky top-20">
              <h3 className="font-bold text-gray-900">Quick facts</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Region</dt>
                  <dd className="font-semibold text-right">{destination.region}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Country</dt>
                  <dd className="font-semibold text-right">{destination.country}</dd>
                </div>
                {destination.climate && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500 shrink-0">Climate</dt>
                    <dd className="font-semibold text-right">{destination.climate}</dd>
                  </div>
                )}
                {destination.bestTimeToVisit && (
                  <div className="pt-3 border-t border-gray-100">
                    <dt className="text-gray-500 mb-1">Best time to visit</dt>
                    <dd className="font-semibold text-wandr-600">{destination.bestTimeToVisit}</dd>
                  </div>
                )}
              </dl>
            </div>

            {destination.localizations?.length > 1 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1 text-sm">Localized content</h3>
                <p className="text-xs text-gray-400 mb-4">
                  This destination is available in {destination.localizations.length} languages
                </p>
                <div className="space-y-3">
                  {destination.localizations.map((l) => (
                    <div
                      key={l.locale}
                      className={`rounded-xl p-3 border text-sm ${
                        l.locale === locale
                          ? "border-wandr-500 bg-wandr-50"
                          : "border-gray-100 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs font-bold uppercase tracking-wide ${
                            l.locale === locale ? "text-wandr-600" : "text-gray-400"
                          }`}
                        >
                          {LOCALE_LABELS[l.locale as keyof typeof LOCALE_LABELS] ?? l.locale}
                          {l.locale === locale && (
                            <span className="ml-2 normal-case text-wandr-500">&bull; current</span>
                          )}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 leading-snug">{l.name}</p>
                      {l.tagline && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{l.tagline}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Related tours */}
        {tours.length > 0 && (
          <section className="mt-20 pt-14 border-t border-gray-200">
            <div className="flex items-baseline justify-between mb-8">
              <div>
                <p className="section-label mb-2">Experiences</p>
                <h2 className="section-heading">Tours in {destination.name}</h2>
              </div>
              <Link
                href="/tours"
                className="text-sm font-semibold text-wandr-600 hover:text-wandr-700 transition-colors"
              >
                All tours &rarr;
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
                      {tour.durationDays} days
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
                <p className="section-label mb-2">Travel guides</p>
                <h2 className="section-heading">Plan your trip</h2>
              </div>
              <Link
                href="/guides"
                className="text-sm font-semibold text-wandr-600 hover:text-wandr-700 transition-colors"
              >
                All guides &rarr;
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
                        By {guide.author.name}
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
