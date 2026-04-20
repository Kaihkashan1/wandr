import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { getGuides } from "@/lib/fetchers";
import { resolveLocale } from "@/lib/locale";
import { StageBadge } from "@/components/ui/StageBadge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel guides",
  description: "Expert travel guides from our team of writers.",
};

export default async function GuidesPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("locale")?.value);
  const guides = await getGuides(locale);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Travel guides</h1>
      <p className="text-gray-500 mb-10">
        Expert advice, local tips, and insider knowledge.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {guides.map((guide) => (
          <Link
            key={guide.id}
            href={`/guides/${guide.slug}`}
            className="group block"
          >
            <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
              {guide.coverImage ? (
                <Image
                  src={guide.coverImage.url}
                  alt={guide.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {guide.tags?.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
              <StageBadge stage={guide.stage} />
            </div>
            <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {guide.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {guide.excerpt}
            </p>
            {guide.author && (
              <div className="flex items-center gap-2 mt-3">
                {guide.author.avatar && (
                  <Image
                    src={guide.author.avatar.url}
                    alt={guide.author.name}
                    width={24}
                    height={24}
                    className="rounded-full object-cover"
                  />
                )}
                <span className="text-xs text-gray-500">{guide.author.name}</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
