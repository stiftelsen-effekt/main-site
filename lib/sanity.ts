// lib/sanity.js
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { createPreviewSubscriptionHook, createCurrentUserHook } from "next-sanity";
import { config } from "./config";
import imageUrlBuilder from "@sanity/image-url";

/**
 * Set up a helper function for generating Image URLs with only the asset reference data in your documents.
 * Read more: https://www.sanity.io/docs/image-url
 **/
export const urlFor = (source: SanityImageSource) => imageUrlBuilder(config).image(source);

// Set up the live preview subscription hook
export const usePreviewSubscription = createPreviewSubscriptionHook(config);

// Helper function for using the current logged in user account
export const useCurrentUser = createCurrentUserHook(config);
