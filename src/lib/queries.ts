import { gql } from "graphql-request";

// ─── Fragments ────────────────────────────────────────────────────────────────

const ASSET_FRAGMENT = gql`
  fragment AssetFields on Asset {
    id
    url
    width
    height
    fileName
  }
`;

const AUTHOR_FRAGMENT = gql`
  fragment AuthorFields on Author {
    id
    name
    bio
    avatar {
      ...AssetFields
    }
  }
  ${ASSET_FRAGMENT}
`;

// ─── Destinations ─────────────────────────────────────────────────────────────

export const GET_DESTINATIONS = gql`
  query GetDestinations($locale: Locale!, $stage: Stage!) {
    destinations(locales: [$locale, en], stage: $stage, orderBy: name_ASC) {
      id
      slug
      name
      tagline
      region
      country
      stage
      heroImage {
        ...AssetFields
      }
    }
  }
  ${ASSET_FRAGMENT}
`;

export const GET_DESTINATION_BY_SLUG = gql`
  query GetDestinationBySlug($slug: String!, $locale: Locale!, $stage: Stage!) {
    destination(where: { slug: $slug }, locales: [$locale, en], stage: $stage) {
      id
      slug
      name
      tagline
      description {
        raw
      }
      region
      country
      climate
      bestTimeToVisit
      stage
      heroImage {
        ...AssetFields
      }
      gallery {
        ...AssetFields
      }
      localizations {
        locale
        name
        tagline
      }
    }
  }
  ${ASSET_FRAGMENT}
`;

export const GET_ALL_DESTINATION_SLUGS = gql`
  query GetAllDestinationSlugs {
    destinations(stage: PUBLISHED) {
      slug
    }
  }
`;

// ─── Tours ────────────────────────────────────────────────────────────────────

export const GET_TOURS = gql`
  query GetTours($locale: Locale!, $stage: Stage!) {
    tours(locales: [$locale, en], stage: $stage) {
      id
      slug
      title
      summary
      durationDays
      difficulty
      stage
      heroImage {
        ...AssetFields
      }
      destination {
        id
        slug
        name
      }
    }
  }
  ${ASSET_FRAGMENT}
`;

export const GET_TOUR_BY_SLUG = gql`
  query GetTourBySlug($slug: String!, $locale: Locale!, $stage: Stage!) {
    tour(where: { slug: $slug }, locales: [$locale, en], stage: $stage) {
      id
      slug
      title
      summary
      description {
        raw
      }
      durationDays
      difficulty
      included
      excluded
      highlights
      stage
      heroImage {
        ...AssetFields
      }
      destination {
        id
        slug
        name
        heroImage {
          ...AssetFields
        }
      }
    }
  }
  ${ASSET_FRAGMENT}
`;

export const GET_ALL_TOUR_SLUGS = gql`
  query GetAllTourSlugs {
    tours(stage: PUBLISHED) {
      slug
    }
  }
`;

// ─── Travel Guides ────────────────────────────────────────────────────────────

export const GET_GUIDES = gql`
  query GetGuides($locale: Locale!, $stage: Stage!) {
    travelGuides(locales: [$locale, en], stage: $stage, orderBy: publishedAt_DESC) {
      id
      slug
      title
      excerpt
      tags
      publishedAt
      stage
      coverImage {
        ...AssetFields
      }
      author {
        ...AuthorFields
      }
      destination {
        id
        slug
        name
      }
    }
  }
  ${AUTHOR_FRAGMENT}
`;

export const GET_GUIDE_BY_SLUG = gql`
  query GetGuideBySlug($slug: String!, $locale: Locale!, $stage: Stage!) {
    travelGuide(
      where: { slug: $slug }
      locales: [$locale, en]
      stage: $stage
    ) {
      id
      slug
      title
      excerpt
      body {
        raw
      }
      tags
      publishedAt
      stage
      coverImage {
        ...AssetFields
      }
      author {
        ...AuthorFields
      }
      destination {
        id
        slug
        name
      }
    }
  }
  ${AUTHOR_FRAGMENT}
`;

export const GET_ALL_GUIDE_SLUGS = gql`
  query GetAllGuideSlugs {
    travelGuides(stage: PUBLISHED) {
      slug
    }
  }
`;

