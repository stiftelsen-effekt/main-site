import { createClient, SanityClient } from "@sanity/client";
import { projectConfig } from "./config";

const cachedFetch: Map<string, any> = new Map();
const ACTIVATE_CACHE = process.env.CI === "1";

export function getClient(previewToken?: string): SanityClient {
  const client = createClient({
    ...projectConfig,
    useCdn: !previewToken,
    perspective: previewToken ? "previewDrafts" : "published",
    stega: {
      enabled: previewToken ? true : false,
      studioUrl: "http://localhost:3333",
    },
    token: previewToken,
  });

  // Wrap the fetch method to add caching functionality
  const originalFetch = client.fetch.bind(client);

  client.fetch = async function instrumentedFetch(query: string, params?: any, options?: any) {
    if (ACTIVATE_CACHE) {
      let k = query + JSON.stringify(params || {}) + JSON.stringify(options || {});
      const cacheKey = await hash(k, "SHA-256");
      if (cachedFetch.has(cacheKey)) {
        return cachedFetch.get(cacheKey);
      }
    }

    try {
      const result = await originalFetch(query, params, options);

      if (ACTIVATE_CACHE) {
        const k = query + JSON.stringify(params || {}) + JSON.stringify(options || {});
        const cacheKey = await hash(k, "SHA-256");
        cachedFetch.set(cacheKey, result);
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  return client;
}

async function hash(message: string, algorithm = "SHA-256") {
  // Node.js environment
  if (typeof globalThis.crypto?.subtle === "undefined" && typeof require !== "undefined") {
    const crypto = require("crypto");
    const nodeAlgo = algorithm.toLowerCase().replace("-", "");
    return crypto.createHash(nodeAlgo).update(message).digest("hex");
  }
  // Caching should only be used in CI, so a non-Node.js environment is unexpected
  throw new Error(
    "Hashing is not supported in this environment. Please use a Node.js environment or a compatible browser when caching sanity queries.",
  );
}
