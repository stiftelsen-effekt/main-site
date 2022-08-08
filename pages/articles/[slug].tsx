import React from "react";
import { getClient } from "../../lib/sanity.server";
import { groq } from "next-sanity";
import { LayoutPage } from "../../types";
import { ArticleHeader } from "../../components/main/layout/ArticleHeader/ArticleHeader";
import { Navbar } from "../../components/main/layout/navbar";
import { RelatedArticles } from "../../components/main/layout/RelatedArticles/RelatedArticles";
import { CookieBanner } from "../../components/shared/layout/CookieBanner/CookieBanner";
import { footerQuery } from "../../components/shared/layout/Footer/Footer";
import { MainHeader } from "../../components/shared/layout/Header/Header";
import { SEO } from "../../components/shared/seo/Seo";
import { Layout } from "../../components/main/layout/layout";
import { BlockContentRenderer } from "../../components/main/blocks/BlockContentRenderer";
import { usePreviewSubscription } from "../../lib/sanity";

const ArticlePage: LayoutPage<{ data: any; preview: boolean }> = ({ data, preview }) => {
  const { data: previewData } = usePreviewSubscription(data?.query, {
    params: data?.queryParams ?? {},
    initialData: data?.result,
    enabled: preview,
  });

  const page = filterPageToSingleItem(previewData, preview);

  const header = page.header;
  const content = page.content;
  const settings = data.result.settings[0];
  const relatedArticles = data.result.relatedArticles;

  return (
    <>
      <SEO
        title={header.seoTitle || header.title}
        titleTemplate={"%s | GiEffektivt."}
        description={header.seoDescription || header.inngress}
        imageAsset={header.seoImage ? header.seoImage.asset : undefined}
        canonicalurl={`https://gieffektivt.no/articles`}
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
};

export async function getStaticProps({ preview = false, params = { slug: "" } }) {
  const { slug } = params;
  let result = await getClient(preview).fetch(fetchArticle, { slug });
  result = { ...result, page: filterPageToSingleItem(result, preview) };

  return {
    props: {
      preview: preview,
      data: {
        result: result,
        query: fetchArticle,
        queryParams: { slug },
      },
    },
  };
}

export async function getStaticPaths() {
  const data = await getClient(false).fetch(fetchArticles);

  return {
    paths: data.pages.map((page: { slug: { current: string } }) => ({
      params: { slug: page.slug.current },
    })),
    fallback: false,
  };
}

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
  "page": *[_type == "article_page"  && slug.current == $slug] {
    header {
      ...,
      seoImage{
        asset->
      },
    },
    content[] {
      ...,
      blocks[] {
        _type == 'reference' => @->,
        _type == 'testimonials' =>  {
          ...,
          testimonials[]->,
        },
        _type != 'reference' && _type != 'testimonials' => @,
      }
    }
  },
  "relatedArticles": *[_type == "article_page" && slug.current != $slug] | order(date desc) [0..3] {
    header,
    "slug": slug.current,
  }
}
`;

const filterPageToSingleItem = (data: any, preview: boolean) => {
  if (!Array.isArray(data.page)) {
    return data.page;
  }

  if (data.page.length === 1) {
    return data.page[0];
  }

  if (preview) {
    return data.page.find((item: any) => item._id.startsWith("drafts.")) || data.page[0];
  }

  return data.page[0];
};

ArticlePage.layout = Layout;
export default ArticlePage;
