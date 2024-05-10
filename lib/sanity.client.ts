import { createClient, SanityClient } from "@sanity/client";
import { projectConfig } from "./config";

export function getClient(previewToken?: string): SanityClient {
  return createClient({
    ...projectConfig,
    useCdn: false, // !previewToken,
    perspective: "previewDrafts",
    stega: {
      enabled: true, //previewToken ? true : false,
      studioUrl: "http://localhost:3333",
    },
    token: previewToken,
  });
}
