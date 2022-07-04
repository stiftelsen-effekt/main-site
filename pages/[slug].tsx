import React from "react";
import { getClient } from "../lib/sanity.server";
import { groq } from "next-sanity";
import { LayoutPage } from "../types";
import { Navbar } from "../components/main/layout/navbar";
import { PageHeader } from "../components/main/layout/PageHeader/PageHeader";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { footerQuery } from "../components/shared/layout/Footer/Footer";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { SEO } from "../components/shared/seo/Seo";
import { Layout } from "../components/main/layout/layout";
import { usePreviewSubscription } from "../lib/sanity";
import { BlockContentRenderer } from "../components/main/blocks/BlockContentRenderer";

const GenericPage: LayoutPage<{ data: any; preview: boolean }> = ({ data, preview }) => {
  const { data: previewData } = usePreviewSubscription(data?.query, {
    params: data?.queryParams ?? {},
    initialData: data?.result,
    enabled: preview,
  });

  const page = filterPageToSingleItem(previewData, preview);

  const header = page.header;
  const content = page.content;
  const settings = previewData.settings[0];

  return (
    <>
      <SEO
        title={header.seoTitle || header.title}
        description={header.seoDescription || header.inngress}
        imageAsset={header.seoImage ? header.seoImage.asset : undefined}
        canonicalurl={`https://gieffektivt.no/about`}
      />

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

      <BlockContentRenderer content={content} />
    </>
  );
};

export async function getStaticProps({ preview = false, params = { slug: "" } }) {
  const { slug } = params;
  let result = await getClient(preview).fetch(fetchGenericPage, { slug });
  result = { ...result, page: filterPageToSingleItem(result.page, preview) };

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
  const data = await getClient(false).fetch(fetchGenericPages);

  return {
    paths: data.pages.map((page: { slug: { current: string } }) => ({
      params: { slug: page.slug.current },
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
  ${footerQuery}
  "page": *[_type == "generic_page" && slug.current == $slug] {
    header {
      ...,
      seoImage{
        asset->,
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
    content[] {
      ...,
      blocks[] {
        _type == 'reference' => @->,
        _type == 'testimonials' =>  {
          ...,
          testimonials[]->,
        },
        _type == 'fullvideo' =>  {
          ...,
          video{
            asset->,
          },
        },
        _type != 'reference' && _type != 'testimonials' && _type != 'fullvideo' => @,
      }
    }
  },
}
`;

const filterPageToSingleItem = (data: any, preview: boolean) => {
  if (!Array.isArray(data.page)) {
    return data;
  }

  if (data.page.length === 1) {
    return data.page[0];
  }

  if (preview) {
    return data.page.find((item: any) => item._id.startsWith("drafts.")) || data.page[0];
  }

  return data.page[0];
};

GenericPage.layout = Layout;
export default GenericPage;
