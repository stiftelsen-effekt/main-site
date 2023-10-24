import { groq } from "next-sanity";
import { linksContentQuery, pageContentQuery } from "../_queries";
import { BlockContentRenderer } from "../components/main/blocks/BlockContentRenderer";
import { PageHeader } from "../components/main/layout/PageHeader/PageHeader";
import { Navbar } from "../components/main/layout/navbar";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { SEO } from "../components/shared/seo/Seo";
import { getClient } from "../lib/sanity.server";
import { withStaticProps } from "../util/withStaticProps";
import { filterPageToSingleItem, getAppStaticProps } from "./_app.page";

export const getGenericPagePaths = async () => {
  const data = await getClient(false).fetch<{ pages: Array<{ slug: { current: string } }> }>(
    fetchGenericPages,
  );
  const slugs = data.pages.map((page) => page.slug.current);
  const paths = slugs.map((slug) => slug.split("/"));
  return paths;
};

export const GenericPage = withStaticProps(
  async ({ preview, path }: { preview: boolean; path: string[] }) => {
    const appStaticProps = await getAppStaticProps({ preview });

    const slug = path.join("/") || "/";

    let result = await getClient(preview).fetch(fetchGenericPage, { slug });
    result = { ...result, page: filterPageToSingleItem(result, preview) };

    return {
      appStaticProps,
      preview: preview,
      data: {
        result,
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

  let cannonicalUrlDefault: string = `https://gieffektivt.no/${page.slug?.current ?? ""}`;
  if (page.slug?.current == "/") {
    cannonicalUrlDefault = "https://gieffektivt.no/";
  }

  return (
    <>
      <SEO
        title={header.seoTitle || header.title}
        titleTemplate={`${settings.title} | %s`}
        description={header.seoDescription || header.inngress}
        imageAsset={header.seoImage ? header.seoImage.asset : undefined}
        canonicalurl={header.cannonicalUrl ?? cannonicalUrlDefault}
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
    title,
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
  }
}
`;
