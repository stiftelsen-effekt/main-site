import { groq } from "next-sanity";
import { stegaClean } from "@sanity/client/stega";
import { getClient } from "../../lib/sanity.client";

/**
 * Path helpers for the dashboard (Min side) pages.
 *
 * These live apart from the page components so that the router context, which
 * every page imports, does not pull the dashboard component graph (and Auth0)
 * into the client bundle of ordinary content pages.
 */

const fetchDashboardSlug = groq`*[_id == "dashboard"][0].dashboard_slug.current`;

export async function getDashboardPagePath() {
  const dashboardSlug = stegaClean(await getClient().fetch<string | null>(fetchDashboardSlug));

  if (!dashboardSlug) throw new Error("Dashboard slug not found");

  return dashboardSlug.split("/");
}

const fetchDonationsSlug = groq`*[_id == "donations"][0].slug.current`;

export async function getDonationsPagePath() {
  const donationsSlug = await getClient().fetch<string | null>(fetchDonationsSlug);

  const dashboardPath = await getDashboardPagePath();

  if (!donationsSlug) return null;

  return [
    ...dashboardPath.map((component) => stegaClean(component)),
    ...donationsSlug.split("/").map((component) => stegaClean(component)),
  ];
}

export async function getDonationsPageSubpaths() {
  const donationsPagePath = await getDonationsPagePath();

  if (!donationsPagePath) return [];

  const years = getYearPaths();

  return years.map((year) => [
    ...donationsPagePath.map((component) => stegaClean(component)),
    stegaClean(year),
  ]);
}

const getYearPaths = () => {
  const currentYear = new Date().getFullYear();
  const yearPaths = [];
  for (let year = 2016; year <= currentYear + 1; year++) {
    yearPaths.push(year.toString());
  }

  return yearPaths;
};

const fetchAgreementsPaths = groq`
{
  "dashboardSlug": *[_id == "dashboard"][0].dashboard_slug.current,
  "slug": *[_id == "agreements"][0].slug.current,
}
`;

export async function getAgreementsPagePath() {
  const result = await getClient().fetch<{ dashboardSlug?: string; slug?: string }>(
    fetchAgreementsPaths,
  );

  const dashboardSlug = stegaClean(result?.dashboardSlug);
  const agreementsSlug = stegaClean(result?.slug);

  if (!dashboardSlug || !agreementsSlug) return null;

  return [dashboardSlug, agreementsSlug];
}

const fetchTaxPaths = groq`
*[_type == "tax"][0] {
  slug {
    current
  },
  features[] {
    slug {
      current
    }
  }
}
`;

type FetchTaxPathsResult = {
  slug?: { current?: string };
  features?: Array<{ slug: { current: string } }>;
} | null;

export async function getTaxPagePath(): Promise<string[]> {
  const page = await getClient().fetch<FetchTaxPathsResult>(fetchTaxPaths);
  const dashboardPath = await getDashboardPagePath();

  const taxSlug = stegaClean(page?.slug?.current);

  if (!taxSlug) return [];

  return [...dashboardPath, ...taxSlug.split("/")];
}

export async function getTaxPageSubPaths(): Promise<string[][]> {
  const page = await getClient().fetch<FetchTaxPathsResult>(fetchTaxPaths);
  const dashboardPath = await getDashboardPagePath();

  const taxSlug = stegaClean(page?.slug?.current);

  if (!taxSlug) return [];
  if (!page?.features) return [];

  return page.features.map((f) => [
    ...dashboardPath.map((component) => stegaClean(component)),
    ...taxSlug.split("/").map((component) => stegaClean(component)),
    f.slug.current,
  ]);
}

const fetchProfilePaths = groq`
{
  "dashboardSlug": *[_id == "dashboard"][0].dashboard_slug.current,
  "slug": *[_id == "profile"][0].slug.current,
}
`;

export async function getProfilePagePath() {
  const result = await getClient().fetch<{ dashboardSlug?: string; slug?: string }>(
    fetchProfilePaths,
  );

  const dashboardSlug = result?.dashboardSlug;
  const slug = result?.slug;

  if (!dashboardSlug || !slug) return null;

  return [dashboardSlug, slug];
}

const fetchVippsAnonymousPaths = groq`
{
  "dashboardSlug": *[_id == "dashboard"][0].dashboard_slug.current,
  "slug": *[_id == "vipps"][0].anonymous_page->slug.current,
}
`;

export async function getVippsAnonymousPagePath() {
  const result = await getClient().fetch<{ dashboardSlug?: string; slug?: string }>(
    fetchVippsAnonymousPaths,
  );

  const dashboardSlug = stegaClean(result?.dashboardSlug);
  const slug = stegaClean(result?.slug);

  if (!dashboardSlug || !slug) return null;

  return [dashboardSlug, slug];
}
