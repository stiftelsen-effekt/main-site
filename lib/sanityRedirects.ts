import { createClient } from "@sanity/client";
import type { Redirect } from "next/dist/lib/load-custom-routes";

export const SANITY_REDIRECTS_QUERY = `*[_type == "redirect" && enabled != false]{
  source,
  destination,
  permanent,
  hosts
}`;

export type SanityRedirect = {
  source?: string;
  destination?: string;
  permanent?: boolean;
  hosts?: string[];
};

export function mapSanityRedirects(redirects: SanityRedirect[]): Redirect[] {
  return redirects.flatMap((redirect) => {
    if (!redirect.source || !redirect.destination) {
      return [];
    }

    const base: Redirect = {
      source: redirect.source,
      destination: redirect.destination,
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
    const redirects = await client.fetch<SanityRedirect[]>(SANITY_REDIRECTS_QUERY);
    return mapSanityRedirects(redirects ?? []);
  } catch (error) {
    console.warn("Failed to fetch Sanity redirects, continuing without them", error);
    return [];
  }
}
