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
      // Create a unique cache key based on the query, params, and options, using a hash
      let k = query + JSON.stringify(params || {}) + JSON.stringify(options || {});
      // Sha256 hash the key to ensure uniqueness
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
  // Check if we're in a Node.js environment with crypto module available
  if (typeof globalThis.crypto?.subtle === "undefined") {
    // Use dynamic import for Node.js crypto (works in Vercel builds)
    try {
      const { createHash } = await import("crypto");
      const nodeAlgo = algorithm.toLowerCase().replace("-", "");
      return createHash(nodeAlgo).update(message).digest("hex");
    } catch (error) {
      throw new Error("Crypto API not available in this environment");
    }
  }

  // Browser environment or modern Node.js with Web Crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
