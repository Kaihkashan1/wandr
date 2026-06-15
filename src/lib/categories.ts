import { CATEGORY_KEYS, type UiKey } from "@/lib/i18n";
import type { Destination, DestinationCategory } from "@/types";

export const CATEGORY_SLUGS = {
  categoryAdventure: "adventure",
  categoryCultural: "cultural",
  categoryBeach: "beach",
  categoryCity: "city",
  categoryNature: "nature",
  categoryFood: "food",
} as const satisfies Record<(typeof CATEGORY_KEYS)[number], string>;

export type CategorySlug = (typeof CATEGORY_SLUGS)[keyof typeof CATEGORY_SLUGS];

const CATEGORY_SLUG_SET = new Set<string>(Object.values(CATEGORY_SLUGS));

const SLUG_TO_ENUM: Record<CategorySlug, DestinationCategory> = {
  adventure: "ADVENTURE",
  cultural: "CULTURAL",
  beach: "BEACH",
  city: "CITY",
  nature: "NATURE",
  food: "FOOD",
};

export function isValidCategory(value: string | undefined | null): value is CategorySlug {
  return value != null && CATEGORY_SLUG_SET.has(value);
}

export function categoryKeyForSlug(slug: CategorySlug): UiKey {
  const entry = Object.entries(CATEGORY_SLUGS).find(([, s]) => s === slug);
  return (entry?.[0] ?? "categoryAdventure") as UiKey;
}

export function categorySlugToEnum(slug: CategorySlug): DestinationCategory {
  return SLUG_TO_ENUM[slug];
}

export function destinationMatchesCategory(
  destination: Pick<Destination, "categories">,
  category: CategorySlug
): boolean {
  return destination.categories?.includes(categorySlugToEnum(category)) ?? false;
}

export function filterDestinationsByCategory(
  destinations: Destination[],
  category: CategorySlug | null
): Destination[] {
  if (!category) return destinations;
  return destinations.filter((d) => destinationMatchesCategory(d, category));
}
