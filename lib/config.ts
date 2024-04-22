import { ClientConfig } from "next-sanity";

export const projectConfig: ClientConfig = {
  /**
   * Find your project ID and dataset in `sanity.json` in your studio project.
   * These are considered “public”, but you can use environment variables
   * if you want differ between local dev and production.
   *
   * https://nextjs.org/docs/basic-features/environment-variables
   **/
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "dev",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
};
