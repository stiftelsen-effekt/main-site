import { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";
import { LayoutPage, PageTypes } from "../types";
import { GenericPage, getGenericPagePaths } from "./GenericPage";
import { Layout } from "../components/main/layout/layout";
import { ArticlesPage, getArticlesPagePath } from "./ArticlesPage";
import ArticlePage, { getArticlePaths } from "./ArticlePage";

enum PageType {
  GenericPage = "generic",
  ArticlesPage = "articles",
  ArticlePage = "article",
}

const Page: LayoutPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  data,
  preview,
  pageType,
}) => {
  switch (pageType) {
    case PageType.GenericPage:
      return <GenericPage data={data} preview={preview} />;
    case PageType.ArticlesPage:
      return <ArticlesPage data={data} preview={preview} />;
    case PageType.ArticlePage:
      return <ArticlePage data={data} preview={preview} />;
  }
};

const inferPageTypeFromPath = async (path: string[]) => {
  const articlesPagePath = await getArticlesPagePath();

  const isArticle = path?.[0] === articlesPagePath?.[0] && path?.length > 1;
  if (isArticle) return PageType.ArticlePage;

  const isArticlesPage = path?.[0] === articlesPagePath?.[0] && path?.length === 1;
  if (isArticlesPage) return PageType.ArticlesPage;

  return PageType.GenericPage;
};

export async function getStaticProps({
  preview = false,
  params,
}: GetStaticPropsContext<{ slug?: string[] }>) {
  const path = params?.slug ?? [];

  const pageType = await inferPageTypeFromPath(path);

  switch (pageType) {
    case PageType.GenericPage: {
      const slug = path[0] ?? "/";
      const props = await GenericPage.getStaticProps({ preview, slug });
      return {
        props: {
          ...props,
          pageType,
        },
      } as const;
    }
    case PageType.ArticlesPage: {
      const props = await ArticlesPage.getStaticProps({ preview });
      return {
        props: {
          ...props,
          pageType,
        },
      } as const;
    }
    case PageType.ArticlePage: {
      const slug = path.slice(1).join("/");
      const props = await ArticlePage.getStaticProps({ preview, slug });
      return {
        props: {
          ...props,
          pageType,
        },
      } as const;
    }
  }
}

export async function getStaticPaths() {
  const articlesPagePath = await getArticlesPagePath();
  const paths = await Promise.all([getGenericPagePaths(), getArticlePaths(articlesPagePath)]).then(
    ([genericPagePaths, articlePaths]) => [...genericPagePaths, articlesPagePath, ...articlePaths],
  );

  return {
    paths: paths.map((path) => {
      return {
        params: { slug: path },
      };
    }),
    fallback: false,
  };
}

Page.layout = Layout;
Page.filterPage = true;

export default Page;
