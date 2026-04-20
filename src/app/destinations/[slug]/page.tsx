import { notFound } from "next/navigation";
import { cookies, draftMode } from "next/headers";
import Image from "next/image";
import { getDestinationBySlug, getAllDestinationSlugs } from "@/lib/fetchers";
import { resolveLocale } from "@/lib/locale";
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

  const destination = await getDestinationBySlug(slug, locale, preview);
  if (!destination) notFound();

  return (
    <div>
      {preview && <PreviewBanner contentId={destination.id} model="Destination" />}

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px]">
        {destination.heroImage ? (
          <Image
            src={destination.heroImage.url}
            alt={destination.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gray-300" />
        )}
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 h-full flex items-end max-w-5xl mx-auto px-6 pb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-white/80 text-sm">
                {destination.region} · {destination.country}
              </span>
              {preview && <StageBadge stage={destination.stage} />}
            </div>
            <EditableField
              fieldId={destination.id}
              fieldName="name"
              enabled={preview}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {destination.name}
              </h1>
            </EditableField>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main */}
          <div className="lg:col-span-2">
            <EditableField
              fieldId={destination.id}
              fieldName="tagline"
              enabled={preview}
            >
              <p className="text-xl text-gray-600 mb-8">{destination.tagline}</p>
            </EditableField>

            <EditableField
              fieldId={destination.id}
              fieldName="description"
              enabled={preview}
            >
              <div className="prose prose-gray max-w-none">
                <RichText content={destination.description} />
              </div>
            </EditableField>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-gray-200 p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Quick facts</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-500">Region</dt>
                  <dd className="font-medium">{destination.region}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Climate</dt>
                  <dd className="font-medium">{destination.climate}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Best time to visit</dt>
                  <dd className="font-medium">{destination.bestTimeToVisit}</dd>
                </div>
              </dl>
            </div>

            {/* Locale info */}
            {destination.localizations?.length > 1 && (
              <div className="rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                  Available in
                </h3>
                <div className="flex flex-wrap gap-2">
                  {destination.localizations.map((l) => (
                    <span
                      key={l.locale}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full uppercase"
                    >
                      {l.locale}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
