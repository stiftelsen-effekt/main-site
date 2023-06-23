import { groq } from "next-sanity";
import { pageContentQuery } from "../_queries";
import { BlockContentRenderer } from "../components/main/blocks/BlockContentRenderer";
import { ArticleHeader } from "../components/main/layout/ArticleHeader/ArticleHeader";
import {
  RelatedArticle,
  RelatedArticles,
} from "../components/main/layout/RelatedArticles/RelatedArticles";
import { Navbar } from "../components/main/layout/navbar";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { SEO } from "../components/shared/seo/Seo";
import { useRouterContext } from "../context/RouterContext";
import { getClient } from "../lib/sanity.server";
import { withStaticProps } from "../util/withStaticProps";
import { filterPageToSingleItem, getAppStaticProps } from "./_app.page";

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
      settings: any[];
      relatedArticles: RelatedArticle[];
    }>(fetchArticle, { slug });
    result = { ...result, page: filterPageToSingleItem(result, preview) };

    return {
      appStaticProps,
      preview: preview,
      data: {
        result,
        query: fetchArticle,
        queryParams: { slug },
      },
    };
  },
)(({ data, preview }) => {
  const { articlesPagePath } = useRouterContext();
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
          header.cannonicalUrl ??
          `https://gieffektivt.no/${[...articlesPagePath, page.slug.current].join("/")}`
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
