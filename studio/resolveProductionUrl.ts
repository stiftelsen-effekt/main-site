import { env } from "./env";

export default function resolveProductionUrl(doc: any) {
  const baseUrl = env.VERCEL_ENV === "preview" ? `https://${env.VERCEL_URL}` : env.SITE_URL;

  if (!baseUrl) throw new Error("No SITE_URL or VERCEL_URL env var provided");
  const previewUrl = new URL(baseUrl);

  previewUrl.pathname = `/api/preview`;
  previewUrl.searchParams.append(
    `secret`,
    "480acccd7c2623ffa09e9363feccf9fb356d3e12fecbcae9261fa2cd3f9e0521",
  );
  previewUrl.searchParams.append(`slug`, doc?.slug?.current ?? "");
  previewUrl.searchParams.append(`type`, doc?._type);

  if (doc?._type === "article_page") {
    let articleSlug;

    // Temporary work-around until sanity 3 upgrade and async callback
    // Checking which project we are in to determine the article slug, this is the NO project
    if (process.env.SANITY_STUDIO_API_PROJECT_ID === "vf0df6h3") {
      articleSlug = "artikler";
    }
    // Checking which project we are in to determine the article slug, this is the SE project
    else if (process.env.SANITY_STUDIO_API_PROJECT_ID === "9reyurp9") {
      articleSlug = "artiklar";
    } else {
      throw new Error("Unknown project ID");
    }

    previewUrl.searchParams.append(`articleSlug`, articleSlug);
  }

  return previewUrl.toString();
}
