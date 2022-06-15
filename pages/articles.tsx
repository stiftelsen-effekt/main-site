import { groq } from "next-sanity";
import Head from "next/head";
import { ArticlePreview } from "../components/elements/articlepreview";
import { CookieBanner } from "../components/elements/cookiebanner";
import { PageHeader } from "../components/elements/pageheader";
import { footerQuery } from "../components/footer";
import { MainHeader } from "../components/main/header";
import { Layout } from "../components/main/layout";
import { Navbar } from "../components/main/navbar";
import { SectionContainer } from "../components/sectionContainer";
import { getClient } from "../lib/sanity.server";
import { LayoutPage } from "../types";
import styles from "../styles/Articles.module.css";

const ArticlesPage: LayoutPage<{ data: any }> = ({ data }) => {
  const settings = data.settings[0];
  const header = data.page[0].header;
  const articles = data.articles;

  return (
    <>
      <Head>
        <title>Konduit.</title>
        <meta name="description" content="Effektiv bistand" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.inverted}>
        <MainHeader hideOnScroll={true}>
          {/*<CookieBanner />*/}
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
  const data = await getClient(preview).fetch(fethcArticles);

  return {
    props: {
      preview,
      data,
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
    header,
  },
  "articles": *[_type == "article_page"] | order(date desc) {
    header,
    "slug": slug.current,
  }
}
`;

ArticlesPage.layout = Layout;
export default ArticlesPage;
