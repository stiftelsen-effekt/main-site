import { createContext, useContext } from "react";
import { getArticlesPagePath } from "../pages/ArticlesPage";
import { getVippsAgreementPagePath } from "../pages/VippsAgreementPage";
import { getDashboardPagePath, getDonationsPagePath } from "../pages/dashboard/DonationsPage";
import { getAgreementsPagePath } from "../pages/dashboard/AgreementsPage";
import { getTaxPagePath } from "../pages/dashboard/TaxPage";
import { getProfilePagePath } from "../pages/dashboard/ProfilePage";
import { getVippsAnonymousPagePath } from "../pages/dashboard/VippsAnonymousPage";
import { getResultsPagePath } from "../pages/ResultsPage";
import { getFundraisersPath } from "../pages/FundraiserPage";

export type RouterContextValue = {
  articlesPagePath: Awaited<ReturnType<typeof getArticlesPagePath>>;
  resultsPagePath: Awaited<ReturnType<typeof getResultsPagePath>>;
  vippsAgreementPagePath: Awaited<ReturnType<typeof getVippsAgreementPagePath>>;
  dashboardPath: Awaited<ReturnType<typeof getDashboardPagePath>>;
  donationsPagePath: Awaited<ReturnType<typeof getDonationsPagePath>>;
  agreementsPagePath: Awaited<ReturnType<typeof getAgreementsPagePath>>;
  taxPagePath: Awaited<ReturnType<typeof getTaxPagePath>>;
  profilePagePath: Awaited<ReturnType<typeof getProfilePagePath>>;
  vippsAnonymousPagePath: Awaited<ReturnType<typeof getVippsAnonymousPagePath>>;
  fundraisersPath: Awaited<ReturnType<typeof getFundraisersPath>>;
};

export const RouterContext = createContext<RouterContextValue | null>(null);

export const useRouterContext = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("RouterContext not found. Did you forget to get app static props?");
  }
  return context;
};

type AwaitedPromises<T extends Record<string, Promise<unknown>>> = {
  [K in keyof T]: T[K] extends Promise<infer U> ? U : never;
};

// Used for caching the router context when building static pages in CI
let cachedRouterContext: RouterContextValue | null = null;

export const fetchRouterContext = async (): Promise<RouterContextValue> => {
  if (cachedRouterContext) {
    return cachedRouterContext;
  }

  const promises = {
    articlesPagePath: getArticlesPagePath(),
    resultsPagePath: getResultsPagePath(),
    vippsAgreementPagePath: getVippsAgreementPagePath(),
    dashboardPath: getDashboardPagePath(),
    donationsPagePath: getDonationsPagePath(),
    agreementsPagePath: getAgreementsPagePath(),
    taxPagePath: getTaxPagePath(),
    profilePagePath: getProfilePagePath(),
    vippsAnonymousPagePath: getVippsAnonymousPagePath(),
    fundraisersPath: getFundraisersPath(),
  };

  cachedRouterContext = (await Promise.all(Object.values(promises))).reduce((acc, value, index) => {
    const key = Object.keys(promises)[index] as keyof typeof promises;
    return { ...acc, [key]: value };
  }, {} as AwaitedPromises<typeof promises>);

  return cachedRouterContext;
};
