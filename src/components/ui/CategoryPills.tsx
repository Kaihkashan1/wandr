import clsx from "clsx";
import Link from "next/link";
import { CATEGORY_KEYS, t } from "@/lib/i18n";
import {
  CATEGORY_SLUGS,
  type CategorySlug,
} from "@/lib/categories";
import type { Locale } from "@/types";

interface CategoryPillsProps {
  locale: Locale;
  activeCategory?: CategorySlug | null;
}

export function CategoryPills({ locale, activeCategory = null }: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {CATEGORY_KEYS.map((key) => {
        const slug = CATEGORY_SLUGS[key];
        const isActive = activeCategory === slug;

        return (
          <Link
            key={key}
            href={`/destinations?category=${slug}`}
            className={clsx("category-pill", isActive && "category-pill--active")}
            aria-current={isActive ? "true" : undefined}
          >
            {t(locale, key)}
          </Link>
        );
      })}
    </div>
  );
}
