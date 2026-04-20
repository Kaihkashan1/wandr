import { notFound } from "next/navigation";
import { cookies, draftMode } from "next/headers";
import Image from "next/image";
import { getGuideBySlug, getAllGuideSlugs } from "@/lib/fetchers";
import { resolveLocale } from "@/lib/locale";
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
      {preview && <PreviewBanner contentId={guide.id} model="TravelGuide" />}

      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Tags + stage */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {guide.tags?.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
          {preview && <StageBadge stage={guide.stage} />}
        </div>

        <EditableField
          fieldId={guide.id}
          fieldName="title"
          enabled={preview}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {guide.title}
          </h1>
        </EditableField>

        <EditableField
          fieldId={guide.id}
          fieldName="excerpt"
          enabled={preview}
        >
          <p className="text-xl text-gray-500 mb-8">{guide.excerpt}</p>
        </EditableField>

        {/* Author + date */}
        {guide.author && (
          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
            {guide.author.avatar && (
              <Image
                src={guide.author.avatar.url}
                alt={guide.author.name}
                width={44}
                height={44}
                className="rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-medium text-gray-900 text-sm">
                {guide.author.name}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(guide.publishedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        )}

        {/* Cover image */}
        {guide.coverImage && (
          <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-10">
            <Image
              src={guide.coverImage.url}
              alt={guide.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Body */}
        <EditableField
          fieldId={guide.id}
          fieldName="body"
          enabled={preview}
        >
          <div className="prose prose-gray prose-lg max-w-none">
            <RichText content={guide.body} />
          </div>
        </EditableField>
      </article>
    </div>
  );
}
