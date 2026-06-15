import { notFound } from "next/navigation";
import { cookies, draftMode } from "next/headers";
import Image from "next/image";
import { getGuideBySlug, getAllGuideSlugs } from "@/lib/fetchers";
import { t } from "@/lib/i18n";
import { formatDate, resolveLocale } from "@/lib/locale";
import { StageBadge } from "@/components/ui/StageBadge";
import { PreviewBanner } from "@/components/preview/PreviewBanner";
import { EditableField } from "@/components/preview/EditableField";
import { RichText } from "@/components/ui/RichText";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllGuideSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("locale")?.value);
  const guide = await getGuideBySlug(slug, locale);
  if (!guide) return {};
  return { title: guide.title, description: guide.excerpt };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const { isEnabled: preview } = await draftMode();
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("locale")?.value);

  const guide = await getGuideBySlug(slug, locale, preview);
  if (!guide) notFound();

  return (
    <div>
      {preview && <PreviewBanner contentId={guide.id} model="TravelGuide" locale={locale} />}

      <article className="max-w-3xl mx-auto px-6 py-14">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {guide.tags?.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-navy-900 text-white/80 px-3 py-1 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
          {preview && <StageBadge stage={guide.stage} />}
          {guide.destination && (
            <span className="text-xs text-wandr-600 font-semibold">
              {guide.destination.name}
            </span>
          )}
        </div>

        <EditableField fieldId={guide.id} fieldName="title" enabled={preview}>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-5 leading-tight">
            {guide.title}
          </h1>
        </EditableField>

        <EditableField fieldId={guide.id} fieldName="excerpt" enabled={preview}>
          <p className="text-xl text-gray-500 mb-8 leading-relaxed">{guide.excerpt}</p>
        </EditableField>

        {guide.author && (
          <div className="flex items-center gap-4 mb-10 pb-8 border-b border-gray-200">
            {guide.author.avatar && (
              <Image
                src={guide.author.avatar.url}
                alt={guide.author.name}
                width={48}
                height={48}
                className="rounded-full object-cover ring-2 ring-gray-100"
              />
            )}
            <div>
              <p className="font-bold text-gray-900 text-sm">{guide.author.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatDate(guide.publishedAt, locale, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        )}

        {guide.coverImage && (
          <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-10 shadow-md">
            <Image
              src={guide.coverImage.url}
              alt={guide.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <EditableField fieldId={guide.id} fieldName="body" enabled={preview}>
          <div className="prose-wandr prose-lg">
            <RichText content={guide.body} />
          </div>
        </EditableField>
      </article>
    </div>
  );
}
