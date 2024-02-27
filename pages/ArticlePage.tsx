import { groq } from "next-sanity";
import { pageContentQuery } from "../_queries";
import { BlockContentRenderer } from "../components/main/blocks/BlockContentRenderer";
import { ArticleHeader } from "../components/main/layout/ArticleHeader/ArticleHeader";
import {
  RelatedArticle,
  RelatedArticles,
} from "../components/main/layout/RelatedArticles/RelatedArticles";
import { Navbar } from "../components/shared/components/Navbar/Navbar";
import {
  CookieBanner,
  CookieBannerConfiguration,
} from "../components/shared/layout/CookieBanner/CookieBanner";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { SEO } from "../components/shared/seo/Seo";
import { useRouterContext } from "../context/RouterContext";
import { getClient } from "../lib/sanity.server";
import { withStaticProps } from "../util/withStaticProps";
import { filterPageToSingleItem, GeneralPageProps, getAppStaticProps } from "./_app.page";

export const getArticlePaths = async (articlesPagePath: string[]) => {
  const data = await getClient(false).fetch<{ pages: Array<{ slug: { current: string } }> }>(
    fetchArticles,
  );

  return data.pages.map((page) => [...articlesPagePath, page.slug.current]);
};

const ArticlePage = withStaticProps(
  async ({ slug, preview }: { slug: string; preview: boolean }) => {
    const appStaticProps = await getAppStaticProps({ preview });

    let result = await getClient(preview).fetch<{
      page: any;
      relatedArticles: RelatedArticle[];
      settings: { title: string; cookie_banner_configuration: CookieBannerConfiguration }[];
    }>(fetchArticle, { slug });

    result = { ...result, page: filterPageToSingleItem(result, preview) };

    return {
      appStaticProps,
      navbarData: await Navbar.getStaticProps({ dashboard: false, preview }),
      preview: preview,
      data: {
        result,
        query: fetchArticle,
        queryParams: { slug },
      },
    }; // satisfies GeneralPageProps (requires next@13);;
  },
)(({ data, navbarData, preview }) => {
  const { articlesPagePath } = useRouterContext();
  const page = data.result.page;

  if (!page) {
    return <div>404{preview ? " - Attempting to load preview" : null}</div>;
  }

  const header = page.header;
  const content = page.content;
  const relatedArticles = data.result.relatedArticles;

  return (
    <>
      <SEO
        title={header.seoTitle || header.title}
        titleTemplate={`%s | ${data.result.settings[0].title}`}
        description={header.seoDescription || header.inngress}
        imageAsset={header.seoImage ? header.seoImage.asset : undefined}
        canonicalurl={
          header.cannonicalUrl ??
          `https://gieffektivt.no/${[...articlesPagePath, page.slug.current].join("/")}`
        }
        keywords={header.seoKeywords}
      />

      <MainHeader hideOnScroll={true}>
        <CookieBanner configuration={data.result.settings[0].cookie_banner_configuration} />
        <Navbar {...navbarData} />
      </MainHeader>

      <ArticleHeader title={header.title} inngress={header.inngress} published={header.published} />

      <BlockContentRenderer content={content} />
      <RelatedArticles
        relatedArticles={relatedArticles}
        relatedArticlesLabel={page.related_articles_label}
        seeAllArticlesLabel={page.see_all_articles_label}
      />
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
    title,
    cookie_banner_configuration,
  },
  "page": *[_type == "article_page"  && slug.current == $slug] {
    header {
      ...,
      seoImage{
        asset->
      },
    },
    ${pageContentQuery}
    "related_articles_label": *[_id=="articles"][0].related_articles_label,
    "see_all_articles_label": *[_id=="articles"][0].see_all_articles_label,
    slug { current },
  },
  "relatedArticles": *[_type == "article_page" && slug.current != $slug] | order(header.published desc) [0..3] {
    header,
    "slug": slug.current,
  }
}
`;

export default ArticlePage;
