import { createClient, SanityClient } from "@sanity/client";
import { projectConfig } from "./config";

export function getClient(previewToken?: string): SanityClient {
  return createClient({
    ...projectConfig,
    useCdn: !previewToken,
    perspective: "previewDrafts",
    stega: {
      enabled: previewToken ? true : false,
      studioUrl: "http://localhost:3333",
    },
    token: previewToken,
  });
}
