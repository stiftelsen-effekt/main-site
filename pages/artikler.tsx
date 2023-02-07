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
import { filterPageToSingleItem } from "./_app";
import { widgetQuery } from "../_queries";

const ArticlesPage: LayoutPage<{ data: any; preview: boolean }> = ({ data, preview }) => {
  const page = data.result.page;

  const settings = data.result.settings[0];
  const header = page.header;
  const articles = data.result.articles;

  return (
    <>
      <SEO
        title={header.seoTitle || header.title}
        description={header.seoDescription || header.inngress}
        imageAsset={header.seoImage ? header.seoImage.asset : undefined}
        canonicalurl={`https://gieffektivt.no/artikler`}
      />

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
            articles.map((article: any, i: number) => (
              <ArticlePreview
                key={article._key}
                header={article.header}
                inngress={
                  i === 0
                    ? article.header.inngress ||
                      (article.preview.length > 350
                        ? article.preview.substr(0, 350) + "..."
                        : article.preview)
                    : undefined
                }
                slug={article.slug}
              />
            ))}
        </div>
      </SectionContainer>
    </>
  );
};

export async function getStaticProps({ preview = false }) {
  let result = await getClient(preview).fetch(fethcArticles);
  result = { ...result, page: filterPageToSingleItem(result, preview) };

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
  ${widgetQuery}
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
  "articles": *[_type == "article_page"] | order(header.published desc) {
    header,
    "slug": slug.current,
    "preview": array::join(content[_type == "contentsection"][0].blocks[_type=="paragraph"][0].content[0..3].children[0...3].text, "\n"),
  }
}
`;

ArticlesPage.layout = Layout;
ArticlesPage.filterPage = true;
export default ArticlesPage;
