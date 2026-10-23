import { Redis } from "@upstash/redis";

/**
 * Redis client for the cache previously accessed through the deprecated `@vercel/kv`.
 *
 * Vercel KV stores were moved to Upstash Redis, and `@vercel/kv` was a thin wrapper around
 * `@upstash/redis`. This reproduces its client setup so behaviour stays the same:
 * - credentials from `KV_REST_API_URL` / `KV_REST_API_TOKEN` (falling back to
 *   `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`), so no env changes are needed
 * - `cache: "default"` for fetch (upstash defaults to `no-store`) and auto pipelining
 * - telemetry disabled
 * - JSON (de)serialization uses the upstash default (`automaticDeserialization: true`),
 *   which `@vercel/kv` did not override
 * - the client is created lazily and throws if credentials are missing
 */
let client: Redis | null = null;

export const getKv = (): Redis => {
  if (!client) {
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error(
        "KV: Missing required environment variables KV_REST_API_URL and KV_REST_API_TOKEN",
      );
    }
    client = new Redis({
      url,
      token,
      cache: "default",
      enableAutoPipelining: true,
      enableTelemetry: false,
    });
  }
  return client;
};
