import { createClient } from "@sanity/client";
import type { Redirect } from "next/dist/lib/load-custom-routes";
import { appendQueryAndHash, resolveNavitemHref } from "./pageHref";

export const SANITY_REDIRECTS_QUERY = `{
  "redirects": *[_type == "redirect" && enabled != false]{
    source,
    destination,
    query,
    hash,
    permanent,
    hosts,
    "slug": page->slug.current,
    "pagetype": page->_type
  },
  "articlesSlug": *[_type == "articles"][0].slug.current,
  "fundraiserSlug": *[_type == "site_settings"][0].fundraiser_page_slug
}`;

export type SanityRedirect = {
  source?: string;
  destination?: string;
  query?: string;
  hash?: string;
  permanent?: boolean;
  hosts?: string[];
  slug?: string;
  pagetype?: string;
};

export type SanityRedirectsPayload = {
  redirects?: SanityRedirect[];
  articlesSlug?: string;
  fundraiserSlug?: string;
};

export function mapSanityRedirects(
  redirects: SanityRedirect[],
  prefixes: { articlesSlug?: string; fundraiserSlug?: string } = {},
): Redirect[] {
  const articlesPagePath = (prefixes.articlesSlug ?? "").split("/");
  const fundraisersPath = (prefixes.fundraiserSlug ?? "").split("/");

  return redirects.flatMap((redirect) => {
    if (!redirect.source) {
      return [];
    }

    const destination = resolveRedirectDestination(redirect, articlesPagePath, fundraisersPath);
    if (!destination) {
      return [];
    }

    const base: Redirect = {
      source: redirect.source,
      destination,
      permanent: redirect.permanent !== false,
    };

    const hosts = redirect.hosts?.filter(Boolean) ?? [];
    if (hosts.length === 0) {
      return [base];
    }

    // Next.js `has` conditions are AND, so one host per rule.
    return hosts.map((host) => ({
      ...base,
      has: [{ type: "host" as const, value: host }],
    }));
  });
}

export function resolveRedirectDestination(
  redirect: SanityRedirect,
  articlesPagePath: string[],
  fundraisersPath: string[],
): string | null {
  let path: string | undefined;

  if (redirect.slug) {
    path = resolveNavitemHref(redirect.pagetype, redirect.slug, articlesPagePath, fundraisersPath);
  } else if (redirect.destination) {
    path = redirect.destination;
  }

  if (!path) {
    return null;
  }

  return appendQueryAndHash(path, redirect.query, redirect.hash);
}

export async function getSanityRedirects(): Promise<Redirect[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "dev";

  if (!projectId) {
    console.warn("Skipping Sanity redirects: NEXT_PUBLIC_SANITY_PROJECT_ID is not set");
    return [];
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2024-05-05",
    useCdn: false,
    perspective: "published",
  });

  try {
    const payload = await client.fetch<SanityRedirectsPayload>(SANITY_REDIRECTS_QUERY);
    return mapSanityRedirects(payload?.redirects ?? [], {
      articlesSlug: payload?.articlesSlug,
      fundraiserSlug: payload?.fundraiserSlug,
    });
  } catch (error) {
    console.warn("Failed to fetch Sanity redirects, continuing without them", error);
    return [];
  }
}
