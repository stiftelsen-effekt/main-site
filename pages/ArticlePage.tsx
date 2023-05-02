import React from "react";
import { getClient } from "../lib/sanity.server";
import { groq } from "next-sanity";
import { ArticleHeader } from "../components/main/layout/ArticleHeader/ArticleHeader";
import { Navbar } from "../components/main/layout/navbar";
import {
  RelatedArticle,
  RelatedArticles,
} from "../components/main/layout/RelatedArticles/RelatedArticles";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { footerQuery } from "../components/shared/layout/Footer/Footer";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { SEO } from "../components/shared/seo/Seo";
import { BlockContentRenderer } from "../components/main/blocks/BlockContentRenderer";
import { pageContentQuery, widgetQuery } from "../_queries";
import { filterPageToSingleItem } from "./_app.page";
import { withStaticProps } from "../util/withStaticProps";
import { useRouterContext } from "../context/RouterContext";

export const getArticlePaths = async (articlesPageSlug: string) => {
  const data = await getClient(false).fetch<{ pages: Array<{ slug: { current: string } }> }>(
    fetchArticles,
  );

  return data.pages.map((page) => [articlesPageSlug, page.slug.current]);
};

const ArticlePage = withStaticProps(
  async ({ slug, preview }: { slug: string; preview: boolean }) => {
    let result = await getClient(preview).fetch<{
      page: any;
      settings: any[];
      relatedArticles: RelatedArticle[];
    }>(fetchArticle, { slug });
    result = { ...result, page: filterPageToSingleItem(result, preview) };

    return {
      preview: preview,
      data: {
        result: result,
        query: fetchArticle,
        queryParams: { slug },
      },
    };
  },
)(({ data, preview }) => {
  const { articlesPageSlug } = useRouterContext();
  const page = data.result.page;

  if (!page) {
    return <div>404{preview ? " - Attempting to load preview" : null}</div>;
  }

  const header = page.header;
  const content = page.content;
  const settings = data.result.settings[0];
  const relatedArticles = data.result.relatedArticles;

  return (
    <>
      <SEO
        title={header.seoTitle || header.title}
        titleTemplate={"%s | Gi Effektivt."}
        description={header.seoDescription || header.inngress}
        imageAsset={header.seoImage ? header.seoImage.asset : undefined}
        canonicalurl={
          header.cannonicalUrl ?? `https://gieffektivt.no/${articlesPageSlug}/${page.slug.current}`
        }
      />

      <MainHeader hideOnScroll={true}>
        <CookieBanner />
        <Navbar logo={settings.logo} elements={settings["main_navigation"]} />
      </MainHeader>

      <ArticleHeader title={header.title} inngress={header.inngress} published={header.published} />

      <BlockContentRenderer content={content} />
      <RelatedArticles relatedArticles={relatedArticles} />
    </>
  );
});

const fetchArticles = groq`
{
  "pages": *[_type == "article_page"] {
    slug { current }
  }
}
`;

const fetchArticle = groq`
{
  "settings": *[_type == "site_settings"] {
    logo,
    main_navigation[] {
      _type == 'navgroup' => {
        _type,
        _key,
        title,
        items[]->{
          title,
          "slug": page->slug.current
        },
      },
      _type != 'navgroup' => @ {
        _type,
        _key,
        title,
        "slug": page->slug.current
      },
    }
  },
  ${footerQuery}
  ${widgetQuery}
  "page": *[_type == "article_page"  && slug.current == $slug] {
    header {
      ...,
      seoImage{
        asset->
      },
    },
    ${pageContentQuery}
    slug { current },
  },
  "relatedArticles": *[_type == "article_page" && slug.current != $slug] | order(header.published desc) [0..3] {
    header,
    "slug": slug.current,
  }
}
`;

export default ArticlePage;
