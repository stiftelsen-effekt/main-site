import { groq } from "next-sanity";
import { getClient } from "../lib/sanity.server";
import { LayoutPage } from "../types";
import styles from "../styles/Articles.module.css";
import { SEO } from "../components/shared/seo/Seo";
import { Navbar } from "../components/main/layout/navbar";
import { PageHeader } from "../components/main/layout/PageHeader/PageHeader";
import { ArticlePreview } from "../components/main/layout/RelatedArticles/ArticlePreview";
import { SectionContainer } from "../components/main/layout/SectionContainer/sectionContainer";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { footerQuery } from "../components/shared/layout/Footer/Footer";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { Layout } from "../components/main/layout/layout";

const ArticlesPage: LayoutPage<{ data: any }> = ({ data }) => {
  const settings = data.result.settings[0];
  const header = data.result.page[0].header;
  const articles = data.result.articles;

  return (
    <>
      <SEO
        title={header.seoTitle || header.title}
        description={header.seoDescription || header.inngress}
        imageAsset={header.seoImage ? header.seoImage.asset : undefined}
        canonicalurl={`https://gieffektivt.no/articles`}
      />
      {/**
     *       <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
     */}

      <div className={styles.inverted}>
        <MainHeader hideOnScroll={true}>
          <CookieBanner />
          <Navbar logo={settings.logo} elements={settings["main_navigation"]} />
        </MainHeader>

        <PageHeader
          title={header.title}
          inngress={header.inngress}
          links={header.links}
          centered={header.centered}
        />
      </div>

      <SectionContainer nodivider>
        <div className={styles.articles}>
          {articles &&
            articles.map((article: any) => (
              <ArticlePreview key={article._key} header={article.header} slug={article.slug} />
            ))}
        </div>
      </SectionContainer>
    </>
  );
};

export async function getStaticProps({ preview = false }) {
  const result = await getClient(preview).fetch(fethcArticles);

  return {
    props: {
      preview: preview,
      data: {
        result: result,
        query: fethcArticles,
        queryParams: {},
      },
    },
  };
}

const fethcArticles = groq`
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
    },
  },
  ${footerQuery}
  "page": *[_type == "articles"] {
    header {
      ...,
      seoImage{
        asset->
      },
      links[] {
        _type == 'navitem' => @ {
          ...,
          "slug": page->slug.current
        },
        _type == 'link' => @ {
          ...
        },
      }
    },
  },
  "articles": *[_type == "article_page"] | order(date desc) {
    header,
    "slug": slug.current,
  }
}
`;

ArticlesPage.layout = Layout;
export default ArticlesPage;
