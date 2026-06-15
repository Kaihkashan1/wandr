import { GraphQLClient } from "graphql-request";

const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN!;

function assertHygraphUrl(name: string, url: string): string {
  const clean = url.replace(/\/$/, "");
  if (clean.includes("vercel.app") || clean.includes("vercel.com")) {
    throw new Error(
      `${name} is set to a Vercel URL. It must be your Hygraph Content API endpoint.`
    );
  }
  return clean;
}

function resolveCdnEndpoint(endpoint: string): string {
  const clean = assertHygraphUrl("HYGRAPH_ENDPOINT", endpoint);

  if (clean.includes(".cdn.hygraph.com/content/")) {
    return clean;
  }

  const v2Match = clean.match(
    /^https:\/\/(.+)\.hygraph\.com\/v2\/([^/]+)\/([^/]+)$/
  );
  if (v2Match) {
    const [, region, projectId, environment] = v2Match;
    return `https://${region}.cdn.hygraph.com/content/${projectId}/${environment}`;
  }

  throw new Error("HYGRAPH_ENDPOINT is not a valid Hygraph URL");
}

function resolveDraftEndpoint(endpoint: string): string {
  const clean = assertHygraphUrl("HYGRAPH_ENDPOINT", endpoint);

  if (clean.includes(".hygraph.com/v2/")) {
    return clean;
  }

  const cdnMatch = clean.match(
    /^https:\/\/(.+)\.cdn\.hygraph\.com\/content\/([^/]+)\/([^/]+)$/
  );
  if (cdnMatch) {
    const [, region, projectId, environment] = cdnMatch;
    return `https://${region}.hygraph.com/v2/${projectId}/${environment}`;
  }

  throw new Error("Could not derive HYGRAPH_DRAFT_ENDPOINT from HYGRAPH_ENDPOINT");
}

const HYGRAPH_ENDPOINT = resolveCdnEndpoint(process.env.HYGRAPH_ENDPOINT ?? "");
const HYGRAPH_DRAFT_ENDPOINT = resolveDraftEndpoint(process.env.HYGRAPH_ENDPOINT ?? "");

if (!HYGRAPH_ENDPOINT) {
  throw new Error("HYGRAPH_ENDPOINT is not set");
}

// CDN client — serves published content, fast
export const hygraphClient = new GraphQLClient(HYGRAPH_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${HYGRAPH_TOKEN}`,
  },
});

// Draft client — bypasses CDN, returns all stages
export const hygraphDraftClient = new GraphQLClient(HYGRAPH_DRAFT_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${HYGRAPH_TOKEN}`,
  },
});

// Use this in pages/components — automatically selects CDN vs draft
export function getClient(preview = false): GraphQLClient {
  return preview ? hygraphDraftClient : hygraphClient;
}
