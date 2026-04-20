import { GraphQLClient } from "graphql-request";

const HYGRAPH_ENDPOINT = process.env.HYGRAPH_ENDPOINT!;
const HYGRAPH_DRAFT_ENDPOINT = process.env.HYGRAPH_DRAFT_ENDPOINT!;
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN!;

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
