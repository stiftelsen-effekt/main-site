import { createClient } from "next-sanity";
import { projectConfig } from "./config";

// Set up the client for fetching data in the getProps page functions
export const sanityClient = createClient({
  ...projectConfig,
  apiVersion: "2022-01-25",
  useCdn: process.env.NODE_ENV === "production",
});

// Set up a preview client with serverless authentication for drafts
export const previewClient = createClient({
  ...projectConfig,
  apiVersion: "2022-01-25",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Helper function for easily switching between normal client and preview client
export const getClient = (usePreview: boolean) => (usePreview ? previewClient : sanityClient);
