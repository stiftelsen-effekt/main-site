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
import { usePreviewSubscription } from "../lib/sanity";

const ArticlesPage: LayoutPage<{ data: any; preview: boolean }> = ({ data, preview }) => {
  const { data: previewData } = usePreviewSubscription(data?.query, {
    params: data?.queryParams ?? {},
    initialData: data?.result,
    enabled: preview,
  });

  const page = filterPageToSingleItem(previewData, preview);

  const settings = data.result.settings[0];
  const header = page.header;
  const articles = data.result.articles;

  return (
    <>
      <SEO
        title={header.seoTitle || header.title}
        description={header.seoDescription || header.inngress}
        imageAsset={header.seoImage ? header.seoImage.asset : undefined}
        canonicalurl={`https://gieffektivt.no/articles`}
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
                inngress={i === 0 ? article.header.inngress : undefined}
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

ArticlesPage.layout = Layout;
export default ArticlesPage;
