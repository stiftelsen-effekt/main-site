import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { fetchRouterContext } from "../context/RouterContext";
import ArticlePage, { getArticlePaths } from "./ArticlePage";
import { GenericPage, getGenericPagePaths } from "./GenericPage";
import { getAppStaticProps } from "./_app.page";
import { ArticlesPage } from "./ArticlesPage";
import VippsAgreementPage, { getVippsAgreementPagePath } from "./VippsAgreementPage";

enum PageType {
  GenericPage = "generic",
  ArticlesPage = "articles",
  ArticlePage = "article",
  VippsAgreementPage = "vipps-agreement",
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
    case PageType.VippsAgreementPage:
      return <VippsAgreementPage data={data} preview={preview} />;
  }
};

function compareArrays<T>(a: T[], b: T[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

const inferPageTypeFromPath = async (path: string[]) => {
  const { articlesPagePath, vippsAgreementPagePath } = await fetchRouterContext();

  const isVippsAgreementPage =
    vippsAgreementPagePath &&
    compareArrays(path.slice(0, vippsAgreementPagePath.length), vippsAgreementPagePath);
  if (isVippsAgreementPage) return PageType.VippsAgreementPage;

  const isArticle =
    compareArrays(path.slice(0, articlesPagePath.length), articlesPagePath) &&
    path.length > articlesPagePath.length;
  if (isArticle) return PageType.ArticlePage;

  const isArticlesPage = compareArrays(path.slice(0, articlesPagePath.length), articlesPagePath);
  if (isArticlesPage) return PageType.ArticlesPage;

  return PageType.GenericPage;
};

export const getStaticProps = async ({
  preview = false,
  params,
}: GetStaticPropsContext<{ slug: string[] }>) => {
  const appStaticProps = await getAppStaticProps({
    filterPage: true,
  });

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
    case PageType.VippsAgreementPage: {
      const props = await VippsAgreementPage.getStaticProps({ preview });
      return {
        props: {
          ...props,
          pageType,
        },
      } as const;
    }
  }
};

export async function getStaticPaths() {
  const { articlesPagePath, vippsAgreementPagePath } = await fetchRouterContext();

  const paths = await Promise.all([getGenericPagePaths(), getArticlePaths(articlesPagePath)]).then(
    ([genericPagePaths, articlePaths]) => [
      ...genericPagePaths,
      ...articlePaths,
      articlesPagePath,
      ...(vippsAgreementPagePath ? [vippsAgreementPagePath] : []),
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
