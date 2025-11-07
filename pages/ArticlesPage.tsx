import { groq } from "next-sanity";
import { linksContentQuery, pageBannersContentQuery } from "../_queries";
import { PageHeader } from "../components/main/layout/PageHeader/PageHeader";
import { ArticlePreview } from "../components/main/layout/RelatedArticles/ArticlePreview";
import { SectionContainer } from "../components/main/layout/SectionContainer/sectionContainer";
import { Navbar, PreviewNavbar } from "../components/shared/components/Navbar/Navbar";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { SEO } from "../components/shared/seo/Seo";
import { getClient } from "../lib/sanity.client";
import styles from "../styles/Articles.module.css";
import { withStaticProps } from "../util/withStaticProps";
import { GeneralPageProps, getAppStaticProps } from "./_app.page";
import { token } from "../token";
import { ConsentState } from "../types/routing";

// Re-export path function from centralized location
export { getArticlesPagePath } from "../lib/page-paths";

export const ArticlesPage = withStaticProps(
  async ({
    draftMode = false,
    consentState,
  }: {
    draftMode: boolean;
    consentState: ConsentState;
  }) => {
    const appStaticProps = await getAppStaticProps({ draftMode, consentState });

    let result = await getClient(draftMode ? token : undefined).fetch(fetchArticlesPage);

    return {
      appStaticProps,
      navbar: await Navbar.getStaticProps({ dashboard: false, draftMode }),
      preview: draftMode,
      token: draftMode ? token ?? null : null,
      data: {
        result,
        query: fetchArticlesPage,
        queryParams: {},
      },
      draftMode,
    } satisfies GeneralPageProps;
  },
)(({ data, navbar, draftMode }) => {
  const page = data.result.page;

  const header = page.header;
  const articles = data.result.articles;

  return (
    <>
      <SEO
        title={header.seoTitle || header.title}
        description={header.seoDescription || header.inngress}
        imageAssetUrl={header.seoImage?.url ? header.seoImage.asset.url : undefined}
        canonicalurl={`${process.env.NEXT_PUBLIC_SITE_URL}/${page.slug}`}
        titleTemplate={`${data.result.settings[0].title} | %s`}
        keywords={header.seoKeywords}
        siteName={data.result.settings[0].title}
      />

      <div className={styles.inverted}>
        <MainHeader
          hideOnScroll={true}
          generalBannerConfig={data.result.settings[0].general_banner}
        >
          {draftMode ? (
            <PreviewNavbar {...navbar} useDashboardLogo />
          ) : (
            <Navbar {...navbar} useDashboardLogo />
          )}
        </MainHeader>

        <PageHeader
          title={header.title}
          inngress={header.inngress}
          links={header.links}
          layout={header.centered ? "centered" : "default"}
        />
      </div>

      <SectionContainer nodivider>
        <div className={styles.articles}>
          {articles &&
            articles.map((article: any, i: number) => {
              let inngress: string | undefined;
              if (i === 0) {
                if (article.header.inngress) {
                  inngress = article.header.inngress;
                } else if (article.preview) {
                  if (article.preview.length > 350) {
                    inngress = article.preview.substr(0, 350) + "...";
                  } else {
                    inngress = article.preview;
                  }
                }
              }

              return (
                <ArticlePreview
                  key={article._key}
                  header={article.header}
                  inngress={inngress}
                  slug={article.slug}
                />
              );
            })}
        </div>
      </SectionContainer>
    </>
  );
});

const fetchArticlesPage = groq`
{
  "settings": *[_type == "site_settings"] {
    title,
    ${pageBannersContentQuery}
  },
  "page": *[_type == "articles"][0] {
    "slug": slug.current,
    header {
      ...,
      seoImage{
        asset->
      },
      ${linksContentQuery}
    },
  },
  "articles": *[_type == "article_page" && hidden != true] | order(header.published desc) {
    header,
    "slug": slug.current,
    "preview": array::join(content[_type == "contentsection"][0].blocks[_type=="paragraph"][0].content[0..3].children[0...5].text, " "),
  }
}
`;
