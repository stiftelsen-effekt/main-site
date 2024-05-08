import { createClient, SanityClient } from "@sanity/client";
import { projectConfig } from "./config";

export function getClient(previewToken?: string): SanityClient {
  console.log(previewToken ? "STEGA" : "Not stega");
  return createClient({
    ...projectConfig,
    useCdn: !previewToken,
    perspective: previewToken ? "previewDrafts" : "published",
    stega: {
      enabled: true, //previewToken ? true : false,
      studioUrl: "http://localhost:3333",
      logger: console,
    },
    token: previewToken,
  });
}
