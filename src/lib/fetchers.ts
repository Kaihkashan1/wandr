import { getClient } from "./hygraph";
import {
  GET_DESTINATIONS,
  GET_DESTINATION_BY_SLUG,
  GET_ALL_DESTINATION_SLUGS,
  GET_TOURS,
  GET_TOUR_BY_SLUG,
  GET_ALL_TOUR_SLUGS,
  GET_GUIDES,
  GET_GUIDE_BY_SLUG,
  GET_ALL_GUIDE_SLUGS,
} from "./queries";
import { enrichTourWithFederation } from "./federation";
import type {
  Destination,
  Tour,
  TravelGuide,
  Locale,
} from "@/types";

type Stage = "PUBLISHED" | "DRAFT";

function stage(preview: boolean): Stage {
  return preview ? "DRAFT" : "PUBLISHED";
}

// ─── Destinations ─────────────────────────────────────────────────────────────

export async function getDestinations(
  locale: Locale = "en",
  preview = false
): Promise<Destination[]> {
  const client = getClient(preview);
  const data = await client.request<{ destinations: Destination[] }>(
    GET_DESTINATIONS,
    { locale, stage: stage(preview) }
  );
  return data.destinations;
}

export async function getDestinationBySlug(
  slug: string,
  locale: Locale = "en",
  preview = false
): Promise<Destination | null> {
  const client = getClient(preview);
  const data = await client.request<{ destination: Destination | null }>(
    GET_DESTINATION_BY_SLUG,
    { slug, locale, stage: stage(preview) }
  );
  return data.destination;
}

export async function getAllDestinationSlugs(): Promise<string[]> {
  const data = await getClient().request<{
    destinations: Array<{ slug: string }>;
  }>(GET_ALL_DESTINATION_SLUGS);
  return data.destinations.map((d) => d.slug);
}

export async function getToursForDestination(
  destinationSlug: string,
  locale: Locale = "en",
  preview = false
): Promise<Tour[]> {
  const tours = await getTours(locale, preview);
  return tours.filter((t) => t.destination?.slug === destinationSlug);
}

export async function getGuidesForDestination(
  destinationSlug: string,
  locale: Locale = "en",
  preview = false
): Promise<TravelGuide[]> {
  const guides = await getGuides(locale, preview);
  return guides.filter((g) => g.destination?.slug === destinationSlug);
}

// ─── Tours ────────────────────────────────────────────────────────────────────

export async function getTours(
  locale: Locale = "en",
  preview = false
): Promise<Tour[]> {
  const client = getClient(preview);
  const data = await client.request<{ tours: Tour[] }>(GET_TOURS, {
    locale,
    stage: stage(preview),
  });
  return data.tours;
}

export async function getTourBySlug(
  slug: string,
  locale: Locale = "en",
  preview = false
): Promise<Tour | null> {
  const client = getClient(preview);
  const data = await client.request<{ tour: Tour | null }>(GET_TOUR_BY_SLUG, {
    slug,
    locale,
    stage: stage(preview),
  });
  if (!data.tour) return null;
  return enrichTourWithFederation(data.tour, locale);
}

export async function getAllTourSlugs(): Promise<string[]> {
  const data = await getClient().request<{ tours: Array<{ slug: string }> }>(
    GET_ALL_TOUR_SLUGS
  );
  return data.tours.map((t) => t.slug);
}

// ─── Travel Guides ────────────────────────────────────────────────────────────

export async function getGuides(
  locale: Locale = "en",
  preview = false
): Promise<TravelGuide[]> {
  const client = getClient(preview);
  const data = await client.request<{ travelGuides: TravelGuide[] }>(
    GET_GUIDES,
    { locale, stage: stage(preview) }
  );
  return data.travelGuides;
}

export async function getGuideBySlug(
  slug: string,
  locale: Locale = "en",
  preview = false
): Promise<TravelGuide | null> {
  const client = getClient(preview);
  const data = await client.request<{ travelGuide: TravelGuide | null }>(
    GET_GUIDE_BY_SLUG,
    { slug, locale, stage: stage(preview) }
  );
  return data.travelGuide;
}

export async function getAllGuideSlugs(): Promise<string[]> {
  const data = await getClient().request<{
    travelGuides: Array<{ slug: string }>;
  }>(GET_ALL_GUIDE_SLUGS);
  return data.travelGuides.map((g) => g.slug);
}
