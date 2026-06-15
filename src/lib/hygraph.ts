import { GraphQLClient } from "graphql-request";

const HYGRAPH_ENDPOINT = process.env.HYGRAPH_ENDPOINT!;
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN!;

if (!HYGRAPH_ENDPOINT) {
  throw new Error("HYGRAPH_ENDPOINT is not set");
}

function deriveDraftEndpoint(cdnEndpoint: string): string {
  const match = cdnEndpoint.match(
    /^https:\/\/([^.]+)\.cdn\.hygraph\.com\/content\/([^/]+)\/([^/]+)$/
  );
  if (!match) {
    throw new Error("HYGRAPH_DRAFT_ENDPOINT is not set and could not be derived");
  }
  const [, region, projectId, environment] = match;
  return `https://${region}.hygraph.com/v2/${projectId}/${environment}`;
}

const configuredDraftEndpoint = process.env.HYGRAPH_DRAFT_ENDPOINT;
const HYGRAPH_DRAFT_ENDPOINT =
  configuredDraftEndpoint && !configuredDraftEndpoint.includes("vercel.app")
    ? configuredDraftEndpoint
    : deriveDraftEndpoint(HYGRAPH_ENDPOINT);

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
