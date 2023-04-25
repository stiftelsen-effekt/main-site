import { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";
import { LayoutPage, PageTypes } from "../types";
import { GenericPage, getGenericPagePaths } from "./GenericPage";
import { Layout } from "../components/main/layout/layout";
import { ArticlesPage, getArticlesPagePath } from "./ArticlesPage";

enum PageType {
  GenericPage = "generic",
  ArticlesPage = "articles",
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
  }
};

export async function getStaticProps({
  preview = false,
  params,
}: GetStaticPropsContext<{ slug?: string[] }>) {
  const slug = params?.slug?.[0] ?? "/";

  const isArticlePage = await getArticlesPagePath().then((path) => path === slug);

  const pageType = isArticlePage ? PageType.ArticlesPage : PageType.GenericPage;

  switch (pageType) {
    case PageType.GenericPage: {
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
  }
}

export async function getStaticPaths() {
  const paths = await Promise.all([getGenericPagePaths(), getArticlesPagePath()]).then(
    ([genericPagePaths, articlesPagePath]) => [...genericPagePaths, articlesPagePath],
  );

  return {
    paths: paths.map((slug) => {
      const slugParts = [slug === "/" ? "" : slug];
      return {
        params: { slug: slugParts },
      };
    }),
    fallback: false,
  };
}

Page.layout = Layout;
Page.filterPage = true;

export default Page;
