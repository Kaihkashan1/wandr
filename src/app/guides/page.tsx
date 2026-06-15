import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
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
    <div>
      <PageHeader
        label="Inspiration & advice"
        title="Travel guides"
        description="Expert advice, local tips, and insider knowledge"
      />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <Link
              key={guide.id}
              href={`/guides/${guide.slug}`}
              className="card group flex flex-col"
            >
              <div className="relative h-52 overflow-hidden">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex flex-wrap gap-1.5 mb-2">
                {guide.tags?.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
                <StageBadge stage={guide.stage} />
              </div>

              <h2 className="font-bold text-gray-900 group-hover:text-wandr-600 transition-colors line-clamp-2 text-base leading-snug">
                {guide.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                {guide.excerpt}
              </p>

              {guide.author && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  {guide.author.avatar && (
                    <Image
                      src={guide.author.avatar.url}
                      alt={guide.author.name}
                      width={28}
                      height={28}
                      className="rounded-full object-cover ring-2 ring-white"
                    />
                  )}
                  <div>
                    <p className="text-xs font-semibold text-gray-700">{guide.author.name}</p>
                    {guide.publishedAt && (
                      <p className="text-xs text-gray-400">
                        {new Date(guide.publishedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
