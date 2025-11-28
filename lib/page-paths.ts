import { groq } from "next-sanity";
import { getClient } from "./sanity.client";
import { stegaClean } from "@sanity/client/stega";
import { pageBannersContentQuery } from "../_queries";
import { CookieBannerQueryResult } from "../studio/sanity.types";

// ============================================================================
// Articles Page
// ============================================================================

const fetchArticlesPageSlug = groq`
{
  "page": *[_type == "articles"] {
    "slug": slug.current,
  }[0]
}
`;

export const getArticlesPagePath = async () => {
  const { page } = await getClient().fetch<{ page: { slug: string } }>(fetchArticlesPageSlug);
  return page.slug.split("/");
};

// ============================================================================
// Results Page
// ============================================================================

const fetchResultsPageSlug = groq`
{
  "page": *[_type == "results"] {
    "slug": slug.current,
  }[0]
}
`;

export const getResultsPagePath = async () => {
  const { page } = await getClient().fetch<{ page: { slug: string } }>(fetchResultsPageSlug);
  return stegaClean(page.slug).split("/");
};

// ============================================================================
// Fundraiser Pages
// ============================================================================

const fetchFundraisersSlug = groq`
{
  "settings": *[_type == "site_settings"][0] {
    fundraiser_page_slug
  }
}
`;

export const getFundraisersPath = async () => {
  const { settings } = await getClient().fetch<{ settings: { fundraiser_page_slug: string } }>(
    fetchFundraisersSlug,
  );
  return stegaClean(settings.fundraiser_page_slug).split("/");
};

const fetchFundraisers = groq`
{
  "pages": *[_type == "fundraiser_page"] {
    slug { current }
  }
}
`;

export const getFundraiserPagePaths = async (fundraisersPagePath: string[]) => {
  const data = await getClient().fetch<{ pages: Array<{ slug: { current: string } }> }>(
    fetchFundraisers,
  );

  return data.pages.map((page) => [
    ...fundraisersPagePath.map((component) => stegaClean(component)),
    stegaClean(page.slug.current),
  ]);
};

// ============================================================================
// Vipps Agreement Page
// ============================================================================

type FetchVippsResult = {
  settings: Array<{
    title: string;
    cookie_banner_configuration: CookieBannerQueryResult;
  }>;
  vipps?: Array<{
    agreement_page: Record<string, any> & {
      slug: {
        current: string;
      };
    };
  }>;
};

const fetchVipps = groq`
{
  "settings": *[_type == "site_settings"] {
    title,
    ${pageBannersContentQuery}
  },
  "vipps": *[_id == "vipps"] {
    agreement_page->{
      slug
    }
  }
}
`;

export const getVippsAgreementPagePath = async () => {
  const result = await getClient().fetch<FetchVippsResult>(fetchVipps);
  const vipps = result.vipps?.[0];
  const slug = vipps?.agreement_page?.slug?.current;
  return slug?.split("/") || null;
};

// ============================================================================
// Dashboard Pages (Donations)
// ============================================================================

type FetchDonationsPageResult = {
  settings: {
    main_currency: string;
    main_locale: string;
    title: string;
  }[];
  dashboard?: Array<{ dashboard_slug?: { current?: string } }>;
  page: {
    slug?: { current?: string };
  } | null;
};

const fetchDonationsPage = groq`
{
  "settings": *[_type == "site_settings"] {
    main_currency,
    main_locale,
    title,
  },
  "dashboard": *[_id == "dashboard"] {
    dashboard_slug {
      current
    }
  },
  "page": *[_id == "donations"][0] {
    slug {
      current
    }
  }
}
`;

export async function getDashboardPagePath() {
  const result = await getClient().fetch<FetchDonationsPageResult>(fetchDonationsPage);

  const dashboardSlug = stegaClean(result?.dashboard?.[0]?.dashboard_slug?.current);

  if (!dashboardSlug) throw new Error("Dashboard slug not found");

  return dashboardSlug.split("/");
}

export async function getDonationsPagePath() {
  let result = await getClient().fetch<FetchDonationsPageResult>(fetchDonationsPage);

  const dashboardPath = await getDashboardPagePath();

  const donationsSlug = result.page?.slug?.current;

  if (!donationsSlug) return null;

  return [
    ...dashboardPath.map((component) => stegaClean(component)),
    ...donationsSlug.split("/").map((component) => stegaClean(component)),
  ];
}

// ============================================================================
// Agreements Page
// ============================================================================

type FetchAgreementsPageResult = {
  settings: Array<{
    title?: string;
    cookie_banner_configuration?: CookieBannerQueryResult;
  }>;
  dashboard: Array<{ dashboard_slug?: { current?: string } }>;
  page?: {
    slug?: { current?: string };
  };
};

const fetchAgreementsPage = groq`
{
  "settings": *[_type == "site_settings"] {
    title,
    ${pageBannersContentQuery}
  },
  "dashboard": *[_id == "dashboard"] {
    dashboard_slug {
      current
    },
  },
  "page": *[_id == "agreements"][0] {
    ...,
    slug {
      current
    }
  }
}
`;

export async function getAgreementsPagePath() {
  const result = await getClient().fetch<FetchAgreementsPageResult>(fetchAgreementsPage);

  const dashboardSlug = stegaClean(result?.dashboard?.[0]?.dashboard_slug?.current);
  const agreementsSlug = stegaClean(result?.page?.slug?.current);

  if (!dashboardSlug || !agreementsSlug) return null;

  return [dashboardSlug, agreementsSlug];
}

// ============================================================================
// Tax Page
// ============================================================================

type FetchTaxPageResult = {
  settings: Array<{
    main_currency?: string;
    title?: string;
  }>;
  page: {
    title?: string;
    slug?: {
      current?: string;
    };
  };
  dashboard: Array<{ dashboard_slug?: { current?: string } }>;
};

const fetchTaxPage = groq`
{
  "settings": *[_type == "site_settings"] {
    main_currency,
    title,
  },
  "dashboard": *[_id == "dashboard"] {
    dashboard_slug {
      current
    },
  },
  "page": *[_id == "tax"][0] {
    ...,
    slug {
      current
    }
  }
}
`;

export async function getTaxPagePath(): Promise<string[]> {
  const result = await getClient().fetch<FetchTaxPageResult>(fetchTaxPage);
  const dashboardPath = await getDashboardPagePath();

  const { dashboard: [dashboard] = [] } = result;

  const page = result.page;

  const taxSlug = stegaClean(page?.slug?.current);

  if (!taxSlug) return [];

  return [...dashboardPath, ...taxSlug.split("/")];
}

export async function getTaxPageSubPaths(): Promise<string[][]> {
  const result = await getClient().fetch<FetchTaxPageResult>(fetchTaxPage);
  const dashboardPath = await getDashboardPagePath();

  const { dashboard: [dashboard] = [] } = result;

  const page = result.page;

  const taxSlug = stegaClean(page?.slug?.current);

  if (!taxSlug) return [];

  const basePath = [...dashboardPath, ...taxSlug.split("/")];

  // Note: This function appears to be incomplete in the original source
  // Returning base path for now
  return [basePath];
}

// ============================================================================
// Profile Page
// ============================================================================

type FetchProfilePageResult = {
  settings: Array<{ title?: string }>;
  page: {
    slug?: { current?: string };
  };
  dashboard: Array<{ dashboard_slug?: { current?: string } }>;
};

const fetchProfilePage = groq`
{
  "settings": *[_type == "site_settings"] {
    title,
  },
  "dashboard": *[_id == "dashboard"] {
    dashboard_slug {
      current
    },
  },
  "page": *[_id == "profile"][0] {
    ...,
    slug {
      current
    }
  }
}
`;

export async function getProfilePagePath() {
  const result = await getClient().fetch<FetchProfilePageResult>(fetchProfilePage);

  const dashboardSlug = result?.dashboard?.[0]?.dashboard_slug?.current;
  const slug = result?.page?.slug?.current;

  if (!dashboardSlug || !slug) return null;

  return [dashboardSlug, slug];
}

// ============================================================================
// Vipps Anonymous Page
// ============================================================================

type FetchVippsAnonymousPageResult = {
  settings: Array<{
    title?: string;
  }>;
  dashboard: Array<{ dashboard_slug?: { current?: string } }>;
  vipps?: Array<{
    anonymous_page: Record<string, any> & {
      slug: {
        current: string;
      };
    };
  }>;
};

const fetchVippsAnonymousPage = groq`
{
  "settings": *[_type == "site_settings"] {
    title,
  },
  "dashboard": *[_id == "dashboard"] {
    dashboard_slug {
      current
    },
  },
  "vipps": *[_id == "vipps"] {
    anonymous_page->{
      slug
    }
  }
}
`;

export async function getVippsAnonymousPagePath() {
  const result = await getClient().fetch<FetchVippsAnonymousPageResult>(fetchVippsAnonymousPage);

  const dashboardSlug = stegaClean(result?.dashboard?.[0]?.dashboard_slug?.current);
  const slug = stegaClean(result?.vipps?.[0]?.anonymous_page?.slug.current);

  if (!dashboardSlug || !slug) return null;

  return [dashboardSlug, slug];
}
