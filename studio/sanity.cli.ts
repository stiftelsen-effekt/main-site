import { defineCliConfig } from "sanity/cli";

/**
 * Vercel only provides these values under their Next.js / Vercel names. When
 * the Studio variable is not set itself, expose the corresponding value to the
 * Studio bundle under the SANITY_STUDIO_* name the Studio code reads.
 */
const studioEnvFallbacks = {
  SANITY_STUDIO_PLAUSIBLE_SITE: "NEXT_PUBLIC_SANITY_STUDIO_PLAUSIBLE_SITE",
  SANITY_STUDIO_PLAUSIBLE_TOKEN: "NEXT_PUBLIC_SANITY_STUDIO_PLAUSIBLE_TOKEN",
  SANITY_STUDIO_SITE_URL: "NEXT_PUBLIC_SITE_URL",
  SANITY_STUDIO_VERCEL_ENV: "VERCEL_ENV",
  SANITY_STUDIO_VERCEL_URL: "VERCEL_URL",
  SANITY_STUDIO_EFFEKT_API_URL: "NEXT_PUBLIC_SANITY_STUDIO_EFFEKT_API_URL",
};

const getStudioEnvFallbackDefines = () =>
  Object.fromEntries(
    Object.entries(studioEnvFallbacks)
      .filter(([name, source]) => !process.env[name] && process.env[source])
      .map(([name, source]) => [`process.env.${name}`, JSON.stringify(process.env[source])]),
  );

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_API_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_API_DATASET,
  },
  project: {
    basePath: "/studio",
  },
  vite: (config) => ({
    ...config,
    define: {
      ...config.define,
      ...getStudioEnvFallbackDefines(),
    },
  }),
});
