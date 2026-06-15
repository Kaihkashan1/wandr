import { GraphQLClient } from "graphql-request";

function readEndpointEnv(): string {
  const endpoint =
    process.env.HYGRAPH_ENDPOINT?.trim() ||
    process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT?.trim() ||
    "";

  if (!endpoint) {
    throw new Error(
      "HYGRAPH_ENDPOINT is not set. Add your Hygraph Content API CDN URL in Vercel project settings."
    );
  }

  return endpoint;
}

function assertHygraphUrl(name: string, url: string): string {
  const clean = url.replace(/\/$/, "");
  if (clean.includes("vercel.app") || clean.includes("vercel.com")) {
    throw new Error(
      `${name} points to Vercel (${clean}). Set it to your Hygraph Content API URL, e.g. https://REGION.cdn.hygraph.com/content/PROJECT_ID/master`
    );
  }
  if (!clean.includes("hygraph.com")) {
    throw new Error(`${name} is not a Hygraph URL (${clean}).`);
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

  const v2Match = clean.match(
    /^https:\/\/(?:api-)?(.+)\.hygraph\.com\/v2\/([^/]+)\/([^/]+)$/
  );
  if (v2Match) {
    const [, region, projectId, environment] = v2Match;
    return `https://api-${region}.hygraph.com/v2/${projectId}/${environment}`;
  }

  const cdnMatch = clean.match(
    /^https:\/\/(.+)\.cdn\.hygraph\.com\/content\/([^/]+)\/([^/]+)$/
  );
  if (cdnMatch) {
    const [, region, projectId, environment] = cdnMatch;
    return `https://api-${region}.hygraph.com/v2/${projectId}/${environment}`;
  }

  throw new Error("Could not derive draft endpoint from HYGRAPH_ENDPOINT");
}

function createClient(url: string): GraphQLClient {
  const token = process.env.HYGRAPH_TOKEN;
  if (!token) {
    throw new Error("HYGRAPH_TOKEN is not set");
  }

  return new GraphQLClient(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Resolve at request time so runtime env on Vercel is used (not just build-time values).
export function getClient(preview = false): GraphQLClient {
  const endpoint = readEndpointEnv();
  const url = preview
    ? resolveDraftEndpoint(endpoint)
    : resolveCdnEndpoint(endpoint);
  return createClient(url);
}

// Kept for any direct imports; always uses current env.
export const hygraphClient = new Proxy({} as GraphQLClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(false), prop, receiver);
  },
});

export const hygraphDraftClient = new Proxy({} as GraphQLClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(true), prop, receiver);
  },
});
