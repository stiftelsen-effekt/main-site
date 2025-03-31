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

export type RouterContextValue = Awaited<ReturnType<typeof fetchRouterContext>>;

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

export const fetchRouterContext = async () => {
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

  return (await Promise.all(Object.values(promises))).reduce((acc, value, index) => {
    const key = Object.keys(promises)[index] as keyof typeof promises;
    return { ...acc, [key]: value };
  }, {} as AwaitedPromises<typeof promises>);
};
