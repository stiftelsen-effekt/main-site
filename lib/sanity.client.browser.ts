import type { getClient as serverGetClient } from "./sanity.client";

// Stands in for ./sanity.client.ts in client bundles (see the "browser" field in
// package.json). getClient() is only called from getStaticProps, which
// withStaticProps keeps attached to components, so the import reaches the browser
// even though the function never runs there.
export const getClient: typeof serverGetClient = () => {
  throw new Error("getClient() is server-only. In the browser, create a client in a lazy chunk.");
};
