# Wandr — Hygraph reference project

A production-grade travel discovery platform built to showcase advanced Hygraph capabilities.

## Capabilities demonstrated

| Capability | Status | Where |
|---|---|---|
| Localization | ✓ Ready | All pages — locale switcher in nav |
| Live preview + click-to-edit | ✓ Ready | `/destinations/[slug]`, `/guides/[slug]` |
| Personalization | ✓ Ready | Homepage hero swaps by persona |
| Content stages | ✓ Ready | Stage badges in preview mode |
| Federation (PIM) | ✓ Ready | Tour pricing/availability via `/api/pim` |

## Getting started

### 1. Clone and install

```bash
git clone <repo>
cd wandr
npm install
```

### 2. Set up Hygraph

1. Create a new project at [hygraph.com](https://hygraph.com)
2. Follow `hygraph/SCHEMA_SETUP.md` to create all models
3. Add locales: EN (default), DE, FR, ES
4. Create content following `hygraph/SEED_DATA.md`
5. Copy your API endpoint and auth token

### 3. Configure environment

```bash
cp .env.local.example .env.local
# Fill in your Hygraph endpoint, token, and preview secret
```

### 4. Run locally

```bash
npm run dev
# http://localhost:3000
```

## Demonstrating each capability

### Localization
Use the **language switcher** in the top nav. Content switches locale in real time (page refresh). The GraphQL query passes `locales: [$locale, en]` so untranslated content falls back to English.

### Personalization
Use the **persona switcher** in the nav. The homepage hero — headline, subheadline, CTA, and background image — changes based on the active persona. This reads from the `ContentVariant` model filtered by the selected `Audience` slug.

### Live preview
Set up the preview URL in Hygraph (see `SCHEMA_SETUP.md`). Open any `Destination` or `TravelGuide` in the Hygraph editor and click the preview button. The frontend activates Draft Mode and renders the unpublished version.

### Click-to-edit
In preview mode, hover over any field wrapped in `<EditableField>` (name, tagline, description, body). Clicking sends a `postMessage` to the Hygraph editor sidebar, which jumps to that field.

### Content stages
When preview mode is active, a `<StageBadge>` appears on all content showing its current stage (Draft, In review, Approved, Published).

### Federation
Tour pages (`/tours/[slug]`) pull pricing and availability from `/api/pim` — a mock PIM service. In a real setup, this would be a separate GraphQL service stitched in via Hygraph's remote source federation.

## Project structure

```
src/
  app/
    page.tsx                    # Homepage — personalized hero
    destinations/
      page.tsx                  # Destination list
      [slug]/page.tsx           # Destination detail — preview + click-to-edit
    tours/
      page.tsx                  # Tour list
      [slug]/page.tsx           # Tour detail — federated pricing
    guides/
      page.tsx                  # Guide list
      [slug]/page.tsx           # Guide detail — preview + click-to-edit
    api/
      preview/route.ts          # Activates Next.js Draft Mode
      preview/disable/route.ts  # Deactivates Draft Mode
      preferences/route.ts      # Sets locale + persona cookies
      pim/route.ts              # Mock PIM (federated pricing data)
  components/
    ui/
      Nav.tsx                   # Locale + persona switchers
      StageBadge.tsx            # Content stage indicator
      RichText.tsx              # Hygraph rich text renderer
      TourPricingCard.tsx       # Federated pricing display
    preview/
      PreviewBanner.tsx         # "You are in preview mode" bar
      EditableField.tsx         # Click-to-edit postMessage wrapper
  lib/
    hygraph.ts                  # GraphQL client (CDN + draft)
    queries.ts                  # All GraphQL query definitions
    fetchers.ts                 # Data fetching functions
    locale.ts                   # Locale resolution utilities
    persona.ts                  # Persona/audience utilities
  types/
    index.ts                    # TypeScript types for all models
hygraph/
  SCHEMA_SETUP.md               # Step-by-step Hygraph model setup
  SEED_DATA.md                  # Content to create in Hygraph
```
