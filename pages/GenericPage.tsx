import { groq } from "next-sanity";
import { BlockContentRenderer } from "../components/main/blocks/BlockContentRenderer";
import { PageHeader } from "../components/main/layout/PageHeader/PageHeader";
import { Navbar } from "../components/main/layout/navbar";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { SEO } from "../components/shared/seo/Seo";
import { getClient } from "../lib/sanity.server";
import { withStaticProps } from "../util/withStaticProps";
import { filterPageToSingleItem } from "./_app.page";
import { widgetQuery, linksContentQuery, pageContentQuery } from "../_queries";
import { footerQuery } from "../components/shared/layout/Footer/Footer";

export const getGenericPagePaths = async () => {
  const SKIP_GENERIC_PATHS = ["artikler", "om", "vippsavtale"];
  const data = await getClient(false).fetch<{ pages: Array<{ slug: { current: string } }> }>(
    fetchGenericPages,
  );
  const slugs = data.pages.map((page) => page.slug.current);

  return slugs.filter((slug) => !SKIP_GENERIC_PATHS.includes(slug));
};

export const GenericPage = withStaticProps(
  async ({ preview, slug }: { preview: boolean; slug: string }) => {
    let result = await getClient(preview).fetch(fetchGenericPage, { slug });
    result = { ...result, page: filterPageToSingleItem(result, preview) };

    return {
      preview: preview,
      data: {
        result: result,
        query: fetchGenericPage,
        queryParams: { slug },
      },
    };
  },
)(({ data, preview }) => {
  const page = data.result.page;

  if (!page) {
    return <div>404{preview ? " - Attempting to load preview" : null}</div>;
  }

  const header = page.header;
  const content = page.content;
  const settings = data.result.settings[0];

  return (
    <>
      <SEO
        title={header.seoTitle || header.title}
        description={header.seoDescription || header.inngress}
        imageAsset={header.seoImage ? header.seoImage.asset : undefined}
        canonicalurl={header.cannonicalUrl ?? `https://gieffektivt.no/${page.slug?.current ?? ""}`}
      />

      <MainHeader hideOnScroll={true}>
        <CookieBanner />
        <Navbar logo={settings.logo} elements={settings["main_navigation"]} />
      </MainHeader>

      <PageHeader
        title={header.title}
        inngress={header.inngress}
        links={header.links}
        layout={header.layout}
      />

      <BlockContentRenderer content={content} />
    </>
  );
});

const fetchGenericPages = groq`
{
  "pages": *[_type == "generic_page"] {
    slug { current }
  }
}
`;

const fetchGenericPage = groq`
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
  ${widgetQuery}
  ${footerQuery}
  "page": *[_type == "generic_page" && slug.current == $slug] {
    header {
      ...,
      seoImage{
        asset->,
      },
      ${linksContentQuery}
    },
    ${pageContentQuery}
    slug { current },
  },
}
`;
