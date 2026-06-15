// ─── Shared ───────────────────────────────────────────────────────────────────

export type Locale = "en" | "de" | "fr" | "es";

export interface Asset {
  id: string;
  url: string;
  width: number;
  height: number;
  fileName?: string;
}

export interface RichTextContent {
  raw: Record<string, unknown>;
  html?: string;
}

export interface QuickFacts {
  region?: string;
  country?: string;
  climate?: string;
  bestTimeToVisit?: string;
}

// ─── Destination ──────────────────────────────────────────────────────────────

export interface Destination {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: RichTextContent;
  region: string;
  country: string;
  heroImage: Asset;
  gallery: Asset[];
  climate: string;
  bestTimeToVisit: string;
  quickFacts?: QuickFacts;
  stage: ContentStage;
  localizations: Array<{
    locale: Locale;
    name: string;
    tagline: string;
  }>;
  // Federated — from weather remote source
  weather?: WeatherData;
}

// ─── Tour ─────────────────────────────────────────────────────────────────────

export type TourDifficulty = "easy" | "moderate" | "challenging" | "expert";

export interface Tour {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: RichTextContent;
  destination: Pick<Destination, "id" | "slug" | "name" | "heroImage">;
  durationDays: number;
  difficulty: TourDifficulty;
  included: string[];
  excluded: string[];
  highlights: string[];
  heroImage: Asset;
  stage: ContentStage;
  // Federated — from PIM remote source
  pricing?: TourPricing;
  availability?: TourAvailability[];
}

// ─── Travel Guide ─────────────────────────────────────────────────────────────

export interface TravelGuide {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: RichTextContent;
  coverImage: Asset;
  author: Author;
  tags: string[];
  publishedAt: string;
  destination?: Pick<Destination, "id" | "slug" | "name">;
  stage: ContentStage;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: Asset;
}

// ─── Content Stages ───────────────────────────────────────────────────────────

export type ContentStage = "DRAFT" | "IN_REVIEW" | "PUBLISHED";

// ─── Federation: PIM ──────────────────────────────────────────────────────────

export interface TourPricing {
  tourId: string;
  basePrice: number;
  currency: string;
  discountedPrice?: number;
  pricePerPerson: boolean;
}

export interface TourAvailability {
  tourId: string;
  date: string;
  spotsTotal: number;
  spotsRemaining: number;
  status: "available" | "limited" | "sold_out";
}

// ─── Federation: Weather ──────────────────────────────────────────────────────

export interface WeatherData {
  destinationSlug: string;
  condition: string;
  tempCelsius: number;
  humidity: number;
  updatedAt: string;
}

// ─── Page props helpers ───────────────────────────────────────────────────────

export interface LocaleParams {
  locale: Locale;
}

export interface SlugParams {
  slug: string;
  locale?: Locale;
}
