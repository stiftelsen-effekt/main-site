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
import { getClient } from "../lib/sanity.client";
import { withStaticProps } from "../util/withStaticProps";
import { getAppStaticProps } from "./_app.page";
import { token } from "../token";
import { TOC } from "../components/main/layout/TOC/TOC";

export const getArticlePaths = async (articlesPagePath: string[]) => {
  const data = await getClient().fetch<{ pages: Array<{ slug: { current: string } }> }>(
    fetchArticles,
  );

  return data.pages.map((page) => [...articlesPagePath, page.slug.current]);
};

// Get TOC by traversing every property of the content object recursively and look for title. Return a flat array of titles, and the key path of the object with a title.
const getTOC = (
  content: any & { _key: string; _type: string },
): Array<{ title: string; _key: string }> => {
  if (!content) return [];
  if (content._type === "citation" && content._type !== "link") return [];

  const result = Object.entries(content as object).reduce(
    (acc: Array<{ title: string; _key: string }>, [key, value]) => {
      if (key === "title") {
        return [{ title: value, _key: content._key || "toc" }, ...acc];
      }

      if (typeof value === "object") {
        return [...acc, ...getTOC(value)];
      }

      return acc;
    },
    [],
  );

  return result;
};

const ArticlePage = withStaticProps(
  async ({ slug, draftMode = false }: { slug: string; draftMode: boolean }) => {
    const appStaticProps = await getAppStaticProps({ draftMode });

    let result = await getClient(draftMode ? token : undefined).fetch<{
      page: any;
      relatedArticles: RelatedArticle[];
      settings: { title: string; cookie_banner_configuration: CookieBannerConfiguration }[];
    }>(fetchArticle, { slug });

    const toc = getTOC(result.page.content).filter(
      (el) => el.title !== undefined && el.title.trim() !== "",
    );

    return {
      appStaticProps,
      navbarData: await Navbar.getStaticProps({ dashboard: false, draftMode }),
      draftMode,
      data: {
        result,
        toc,
        query: fetchArticle,
        queryParams: { slug },
      },
    }; // satisfies GeneralPageProps (requires next@13);;
  },
)(({ data, navbarData, draftMode }) => {
  console.log(data.toc);

  const { articlesPagePath } = useRouterContext();
  const page = data.result.page;

  if (!page) {
    return <div>404{draftMode ? " - Attempting to load preview" : null}</div>;
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
        siteName={data.result.settings[0].title}
      />

      <MainHeader hideOnScroll={true}>
        <CookieBanner configuration={data.result.settings[0].cookie_banner_configuration} />
        <Navbar {...navbarData} />
      </MainHeader>

      <ArticleHeader title={header.title} inngress={header.inngress} published={header.published} />

      {data.toc && <TOC items={data.toc}></TOC>}

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
    cookie_banner_configuration {
      ...,
      privacy_policy_link {
        ...,
        "slug": page->slug.current
      }
    },
  },
  "page": *[_type == "article_page"  && slug.current == $slug][0] {
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
