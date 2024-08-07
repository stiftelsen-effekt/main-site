import { groq } from "next-sanity";
import { linksContentQuery } from "../_queries";
import { PageHeader } from "../components/main/layout/PageHeader/PageHeader";
import { ArticlePreview } from "../components/main/layout/RelatedArticles/ArticlePreview";
import { SectionContainer } from "../components/main/layout/SectionContainer/sectionContainer";
import { Navbar } from "../components/shared/components/Navbar/Navbar";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { SEO } from "../components/shared/seo/Seo";
import { getClient } from "../lib/sanity.client";
import styles from "../styles/Articles.module.css";
import { withStaticProps } from "../util/withStaticProps";
import { GeneralPageProps, getAppStaticProps } from "./_app.page";
import { token } from "../token";

const fetchArticlesPageSlug = groq`
{
  "page": *[_type == "articles"] {
    "slug": slug.current,
  }[0]
}
`;

export const getArticlesPagePath = async () => {
  const { page } = await getClient().fetch<{ page: { slug: string } }>(fetchArticlesPageSlug);
  return page.slug.split("/");
};

export const ArticlesPage = withStaticProps(
  async ({ draftMode = false }: { draftMode: boolean }) => {
    const appStaticProps = await getAppStaticProps({ draftMode });

    let result = await getClient(draftMode ? token : undefined).fetch(fetchArticles);

    return {
      appStaticProps,
      navbarData: await Navbar.getStaticProps({ dashboard: false, draftMode }),
      preview: draftMode,
      token: draftMode ? token ?? null : null,
      data: {
        result,
        query: fetchArticles,
        queryParams: {},
      },
      draftMode,
    } satisfies GeneralPageProps;
  },
)(({ data, navbarData, draftMode }) => {
  const page = data.result.page;

  const header = page.header;
  const articles = data.result.articles;

  return (
    <>
      <SEO
        title={header.seoTitle || header.title}
        description={header.seoDescription || header.inngress}
        imageAsset={header.seoImage ? header.seoImage.asset : undefined}
        canonicalurl={`${process.env.NEXT_PUBLIC_SITE_URL}/${page.slug}`}
        titleTemplate={`${data.result.settings[0].title} | %s`}
        keywords={header.seoKeywords}
        siteName={data.result.settings[0].title}
      />

      <div className={styles.inverted}>
        <MainHeader hideOnScroll={true}>
          <CookieBanner configuration={data.result.settings[0].cookie_banner_configuration} />
          <Navbar {...navbarData} useDashboardLogo />
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

const fetchArticles = groq`
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
