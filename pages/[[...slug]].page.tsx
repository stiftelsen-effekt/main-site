import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { fetchRouterContext } from "../context/RouterContext";
import ArticlePage, { getArticlePaths } from "./ArticlePage";
import { ArticlesPage } from "./ArticlesPage";
import { GenericPage, getGenericPagePaths } from "./GenericPage";
import { getAppStaticProps } from "./_app.page";

enum PageType {
  GenericPage = "generic",
  ArticlesPage = "articles",
  ArticlePage = "article",
}

const Page: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
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
  const { articlesPageSlug } = await fetchRouterContext();

  const isArticle = path?.[0] === articlesPageSlug && path?.length > 1;
  if (isArticle) return PageType.ArticlePage;

  const isArticlesPage = path?.[0] === articlesPageSlug && path?.length === 1;
  if (isArticlesPage) return PageType.ArticlesPage;

  return PageType.GenericPage;
};

export const getStaticProps = async ({
  preview = false,
  params,
}: GetStaticPropsContext<{ slug: string[] }>) => {
  const appStaticProps = await getAppStaticProps();

  const path = params?.slug ?? [];

  const pageType = await inferPageTypeFromPath(path);

  switch (pageType) {
    case PageType.GenericPage: {
      const slug = path[0] ?? "/";
      const props = await GenericPage.getStaticProps({ preview, slug });
      return {
        props: {
          ...props,
          appStaticProps,
          pageType,
        },
      } as const;
    }
    case PageType.ArticlesPage: {
      const props = await ArticlesPage.getStaticProps({ preview });
      return {
        props: {
          ...props,
          appStaticProps,
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
          appStaticProps,
          pageType,
        },
      } as const;
    }
  }
};

export async function getStaticPaths() {
  const { articlesPageSlug } = await fetchRouterContext();

  const paths = await Promise.all([getGenericPagePaths(), getArticlePaths(articlesPageSlug)]).then(
    ([genericPagePaths, articlePaths]) => [
      ...genericPagePaths,
      ...articlePaths,
      [articlesPageSlug],
    ],
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

export default Page;
