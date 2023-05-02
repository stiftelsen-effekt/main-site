import { createContext, useContext } from "react";
import { getArticlesPagePath } from "../pages/ArticlesPage";
import { getVippsAgreementPagePath } from "../pages/VippsAgreementPage";

export type RouterContextValue = Awaited<ReturnType<typeof fetchRouterContext>>;

export const RouterContext = createContext<RouterContextValue | null>(null);

export const useRouterContext = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("RouterContext not found. Did you forget to get app static props?");
  }
  return context;
};

export const fetchRouterContext = async () => {
  const [articlesPagePath, vippsAgreementPagePath] = await Promise.all([
    getArticlesPagePath(),
    getVippsAgreementPagePath(),
  ]);
  return {
    articlesPagePath,
    vippsAgreementPagePath,
  };
};
