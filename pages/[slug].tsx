import React from "react";
import { getClient } from "../lib/sanity.server";
import { groq } from "next-sanity";
import { LayoutPage, PageTypes } from "../types";
import { Navbar } from "../components/main/layout/navbar";
import { PageHeader } from "../components/main/layout/PageHeader/PageHeader";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { footerQuery } from "../components/shared/layout/Footer/Footer";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { SEO } from "../components/shared/seo/Seo";
import { Layout } from "../components/main/layout/layout";
import { BlockContentRenderer } from "../components/main/blocks/BlockContentRenderer";
import { linksContentQuery, pageContentQuery, widgetQuery } from "../_queries";
import { filterPageToSingleItem } from "./_app";

const GenericPage: LayoutPage<{
  data: { result: { [key: string]: any; page: PageTypes["generic_page"] } };
  preview: boolean;
}> = ({ data, preview }) => {
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
        canonicalurl={header.cannonicalUrl ?? `https://gieffektivt.no/${page.slug.current}`}
      />

      <MainHeader hideOnScroll={true} inverted={header.inverted}>
        <CookieBanner />
        <Navbar logo={settings.logo} elements={settings["main_navigation"]} />
      </MainHeader>

      <PageHeader
        title={header.title}
        inngress={header.inngress}
        links={header.links}
        centered={header.centered}
        inverted={header.inverted}
      />

      <BlockContentRenderer content={content} />
    </>
  );
};

export async function getStaticProps({ preview = false, params = { slug: "" } }) {
  const { slug } = params;
  let result = await getClient(preview).fetch(fetchGenericPage, { slug });
  result = { ...result, page: filterPageToSingleItem(result, preview) };

  return {
    props: {
      preview: preview,
      data: {
        result: result,
        query: fetchGenericPage,
        queryParams: { slug },
      },
    },
  };
}

export async function getStaticPaths() {
  const SKIP_GENERIC_PATHS = ["/", "om", "ofte-stilte-sporsmal", "vippsavtale"];
  const data = await getClient(false).fetch<{ pages: Array<{ slug: { current: string } }> }>(
    fetchGenericPages,
  );
  const slugs = data.pages.map((page) => page.slug.current);

  return {
    paths: slugs
      .filter((slug) => !SKIP_GENERIC_PATHS.includes(slug))
      .map((slug) => ({
        params: { slug },
      })),
    fallback: false,
  };
}

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

GenericPage.layout = Layout;
GenericPage.filterPage = true;
export default GenericPage;
