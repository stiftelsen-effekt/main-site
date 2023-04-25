import { createContext, useContext } from "react";
import { getClient } from "../lib/sanity.server";
import { groq } from "next-sanity";

export type RouterContextValue = {
  articlesPageSlug: string;
};

export const RouterContext = createContext<RouterContextValue | null>(null);

export const useRouterContext = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("RouterContext not found");
  }
  return context;
};

const fetchArticlesPageSlug = groq`
{
  "page": *[_type == "articles"] {
    "slug": slug.current,
  }[0]
}
`;

export const fetchRouterContext = async (): Promise<RouterContextValue> => {
  const { page } = await getClient(false).fetch<{ page: { slug: string } }>(fetchArticlesPageSlug);
  return {
    articlesPageSlug: page.slug,
  };
};
