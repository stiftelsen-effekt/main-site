import { groq } from "next-sanity";
import { linksContentQuery, pageContentQuery } from "../_queries";
import { BlockContentRenderer } from "../components/main/blocks/BlockContentRenderer";
import { PageHeader } from "../components/main/layout/PageHeader/PageHeader";
import { Navbar } from "../components/shared/components/Navbar/Navbar";
import { CookieBanner } from "../components/shared/layout/CookieBanner/CookieBanner";
import { MainHeader } from "../components/shared/layout/Header/Header";
import { SEO } from "../components/shared/seo/Seo";
import { getClient } from "../lib/sanity.client";
import { withStaticProps } from "../util/withStaticProps";
import { filterPageToSingleItem, GeneralPageProps, getAppStaticProps } from "./_app.page";
import { token } from "../token";

export const getGenericPagePaths = async () => {
  const data = await getClient().fetch<{ pages: Array<{ slug: { current: string } }> }>(
    fetchGenericPages,
  );
  const slugs = data.pages.map((page) => page.slug.current);
  const paths = slugs.map((slug) => slug.split("/"));
  return paths;
};

export const GenericPage = withStaticProps(
  async ({ path, draftMode = false }: { path: string[]; draftMode: boolean }) => {
    const appStaticProps = await getAppStaticProps({ draftMode });

    const slug = path.join("/") || "/";

    const client = getClient(draftMode ? token : undefined);

    let result = await client.fetch(
      fetchGenericPage,
      { slug },
      { perspective: "previewDrafts", resultSourceMap: true },
    );

    if (result.page) {
      console.log(JSON.stringify(result.page.content, null, 2));
    }

    return {
      appStaticProps,
      draftMode,
      navbarData: await Navbar.getStaticProps({ dashboard: false, draftMode }),
      data: {
        result,
        query: fetchGenericPage,
        queryParams: { slug },
      },
    }; // satisfies GeneralPageProps (requires next@13);;
  },
)(({ data, draftMode, navbarData }) => {
  const page = data.result.page;

  if (!page) {
    return <div>404{draftMode ? " - Attempting to load preview" : null}</div>;
  }

  const header = page.header;
  const content = page.content;

  let cannonicalUrlDefault: string = `${process.env.NEXT_PUBLIC_SITE_URL}/${
    page.slug?.current ?? ""
  }`;
  if (page.slug?.current == "/") {
    cannonicalUrlDefault = `${process.env.NEXT_PUBLIC_SITE_URL}`;
  }

  return (
    <>
      <SEO
        title={header.seoTitle || header.title}
        description={header.seoDescription || header.inngress}
        imageAsset={header.seoImage ? header.seoImage.asset : undefined}
        canonicalurl={header.cannonicalUrl ?? cannonicalUrlDefault}
        titleTemplate={`${data.result.settings[0].title} | %s`}
        keywords={header.seoKeywords}
        siteName={data.result.settings[0].title}
      />

      <MainHeader hideOnScroll={true}>
        <CookieBanner configuration={data.result.settings[0].cookie_banner_configuration} />
        <Navbar {...navbarData} />
      </MainHeader>

      <PageHeader
        title={header.title}
        inngress={header.inngress}
        links={header.links}
        layout={header.layout}
        coverPhoto={header.coverPhoto}
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
    ...,
    title,
    cookie_banner_configuration {
      ...,
      privacy_policy_link {
        ...,
        "slug": page->slug.current
      }
    },
  },
  "page": *[_type == "generic_page" && slug.current == $slug][0] {
    ...,
    header {
      ...,
      seoImage{
        asset->{
          url
        },
      },
      pageHeader {
        asset->,
      },
      ${linksContentQuery}
    },
    ${pageContentQuery}
    slug { current },
  }
}
`;
