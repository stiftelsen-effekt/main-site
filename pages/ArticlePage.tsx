import { groq } from "next-sanity";
import { pageBannersContentQuery, pageContentQuery } from "../_queries";
import { BlockContentRenderer } from "../components/main/blocks/BlockContentRenderer";
import { ArticleHeader } from "../components/main/layout/ArticleHeader/ArticleHeader";
import {
  RelatedArticle,
  RelatedArticles,
} from "../components/main/layout/RelatedArticles/RelatedArticles";
import { Navbar, NavLink, PreviewNavbar } from "../components/shared/components/Navbar/Navbar";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { SEO } from "../components/shared/seo/Seo";
import { useRouterContext } from "../context/RouterContext";
import { getClient } from "../lib/sanity.client";
import { withStaticProps } from "../util/withStaticProps";
import { GeneralPageProps, getAppStaticProps } from "./_app.page";
import { token } from "../token";
import { stegaClean } from "@sanity/client/stega";
import { GiveBlock } from "../components/main/blocks/GiveBlock/GiveBlock";
import { SectionContainer } from "../components/main/layout/SectionContainer/sectionContainer";
import { ConsentState } from "../middleware.page";
import { GeneralBannerQueryResult, CookieBannerQueryResult } from "../studio/sanity.types";

export const getArticlePaths = async (articlesPagePath: string[]) => {
  const data = await getClient().fetch<{ pages: Array<{ slug: { current: string } }> }>(
    fetchArticles,
  );

  return data.pages.map((page) => [
    ...articlesPagePath.map((component) => stegaClean(component)),
    stegaClean(page.slug.current),
  ]);
};

export const ArticlePage = withStaticProps(
  async ({
    slug,
    draftMode = false,
    consentState,
  }: {
    slug: string;
    draftMode: boolean;
    consentState: ConsentState;
  }) => {
    const appStaticProps = await getAppStaticProps({ draftMode, consentState });

    let result = await getClient(draftMode ? token : undefined).fetch<{
      page: any;
      relatedArticles: RelatedArticle[];
      settings: {
        title: string;
        cookie_banner_configuration: CookieBannerQueryResult;
        general_banner: GeneralBannerQueryResult;
        donate_label: string;
        accent_color?: string;
      }[];
    }>(fetchArticle, { slug });

    return {
      appStaticProps,
      navbar: await Navbar.getStaticProps({ dashboard: false, draftMode }),
      draftMode,
      preview: draftMode,
      token: draftMode ? token ?? null : null,
      data: {
        result,
        query: fetchArticle,
        queryParams: { slug },
      },
    } satisfies GeneralPageProps;
  },
)(({ data, navbar, draftMode }) => {
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
        imageAssetUrl={header.seoImage.url ? header.seoImage.url : undefined}
        canonicalurl={
          header.cannonicalUrl ??
          `${process.env.NEXT_PUBLIC_SITE_URL}/${[...articlesPagePath, page.slug.current].join(
            "/",
          )}`
        }
        keywords={header.seoKeywords}
        siteName={data.result.settings[0].title}
      />

      <MainHeader
        hideOnScroll={true}
        cookieBannerConfig={data.result.settings[0].cookie_banner_configuration}
        generalBannerConfig={data.result.settings[0].general_banner}
      >
        {draftMode ? <PreviewNavbar {...navbar} /> : <Navbar {...navbar} />}
      </MainHeader>

      <ArticleHeader title={header.title} inngress={header.inngress} published={header.published} />

      <BlockContentRenderer content={content} />

      <SectionContainer>
        <GiveBlock
          heading={page.default_give_block.heading}
          paragraph={page.default_give_block.paragraph}
          donateLabel={data.result.settings[0].donate_label}
          accentColor={data.result.settings[0].accent_color}
        ></GiveBlock>
      </SectionContainer>

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
    ${pageBannersContentQuery},
    donate_label,
    accent_color
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
    "default_give_block": *[_id=="articles"][0].default_give_block,
    slug { current },
  },
  "relatedArticles": *[_type == "article_page" && slug.current != $slug] | order(header.published desc) [0..3] {
    header,
    "slug": slug.current,
  }
}
`;
