import { groq } from "next-sanity";
import { linksContentQuery } from "../_queries";
import { PageHeader } from "../components/main/layout/PageHeader/PageHeader";
import { ArticlePreview } from "../components/main/layout/RelatedArticles/ArticlePreview";
import { SectionContainer } from "../components/main/layout/SectionContainer/sectionContainer";
import { Navbar } from "../components/shared/components/Navbar/Navbar";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { SEO } from "../components/shared/seo/Seo";
import { getClient } from "../lib/sanity.server";
import styles from "../styles/Articles.module.css";
import { withStaticProps } from "../util/withStaticProps";
import { filterPageToSingleItem, GeneralPageProps, getAppStaticProps } from "./_app.page";

const fetchArticlesPageSlug = groq`
{
  "page": *[_type == "articles"] {
    "slug": slug.current,
  }[0]
}
`;

export const getArticlesPagePath = async () => {
  const { page } = await getClient(false).fetch<{ page: { slug: string } }>(fetchArticlesPageSlug);
  return page.slug.split("/");
};

export const ArticlesPage = withStaticProps(async ({ preview }: { preview: boolean }) => {
  const appStaticProps = await getAppStaticProps({ preview });

  let result = await getClient(preview).fetch(fetchArticles);
  result = { ...result, page: filterPageToSingleItem(result, preview) };

  return {
    appStaticProps,
    preview: preview,
    navbarData: await Navbar.getStaticProps({ dashboard: false, preview }),
    data: {
      result,
      query: fetchArticles,
      queryParams: {},
    },
  }; // satisfies GeneralPageProps (requires next@13);;
})(({ data, navbarData, preview }) => {
  const page = data.result.page;

  const header = page.header;
  const articles = data.result.articles;

  return (
    <>
      <SEO
        title={header.seoTitle || header.title}
        description={header.seoDescription || header.inngress}
        imageAsset={header.seoImage ? header.seoImage.asset : undefined}
        canonicalurl={`https://gieffektivt.no/${page.slug}`}
        titleTemplate={`${data.result.settings[0].title} | %s`}
      />

      <div className={styles.inverted}>
        <MainHeader hideOnScroll={true}>
          <CookieBanner />
          <Navbar {...navbarData} />
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
  },
  "page": *[_type == "articles"] {
    "slug": slug.current,
    header {
      ...,
      seoImage{
        asset->
      },
      ${linksContentQuery}
    },
  },
  "articles": *[_type == "article_page"] | order(header.published desc) {
    header,
    "slug": slug.current,
    "preview": array::join(content[_type == "contentsection"][0].blocks[_type=="paragraph"][0].content[0..3].children[0...3].text, "\n"),
  }
}
`;
