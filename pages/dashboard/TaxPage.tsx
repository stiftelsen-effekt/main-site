import Head from "next/head";
import style from "../../styles/Tax.module.css";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { getClient } from "../../lib/sanity.server";
import { groq } from "next-sanity";
import { PageContent } from "../../components/profile/layout/PageContent/PageContent";
import { Navbar } from "../../components/profile/layout/navbar";
import { footerQuery } from "../../components/shared/layout/Footer/Footer";
import { MainHeader } from "../../components/shared/layout/Header/Header";
import { useContext } from "react";
import { DonorContext } from "../../components/profile/layout/donorProvider";
import { linksContentQuery, linksSelectorQuery, widgetQuery } from "../../_queries";
import TaxMenu from "../../components/profile/tax/TaxMenu/TaxMenu";
import { withStaticProps } from "../../util/withStaticProps";
import { getDashboardPagePath } from "./DonationsPage";
import { LayoutType, filterPageToSingleItem, getAppStaticProps } from "../_app.page";
import { ErrorMessage } from "../../components/profile/shared/ErrorMessage/ErrorMessage";
import { TaxUnitsTab } from "../../components/profile/tax/TaxUnitsTab/TaxUnitsTab";
import { YearlyReportsTab } from "../../components/profile/tax/YearlyReportsTab/YearlyReportsTab";
import { FacebookTab } from "../../components/profile/tax/FacebookTab/FacebookTab";
import { TaxDeductionsTab } from "../../components/profile/tax/TaxDeductionsTab/TaxDeductionsTab";
import { LinksProps } from "../../components/main/blocks/Links/Links";

export async function getTaxPagePath(): Promise<string[]> {
  const result = await getClient(false).fetch<FetchTaxPageResult>(fetchTaxPage);
  const dashboardPath = await getDashboardPagePath();

  const { dashboard: [dashboard] = [] } = result;

  const page = filterPageToSingleItem(result, false);

  const taxSlug = page?.slug?.current;

  if (!taxSlug) return [];

  return [...dashboardPath, ...taxSlug.split("/")];
}

export async function getTaxPageSubPaths(): Promise<string[][]> {
  const result = await getClient(false).fetch<FetchTaxPageResult>(fetchTaxPage);
  const dashboardPath = await getDashboardPagePath();

  const { dashboard: [dashboard] = [] } = result;

  const page = filterPageToSingleItem(result, false);

  const taxSlug = page?.slug?.current;

  if (!taxSlug) return [];
  if (!page.features) return [];

  return page.features.map((f) => [...dashboardPath, ...taxSlug.split("/"), f.slug.current]);
}

export const TaxPage = withStaticProps(
  async ({ preview, path }: { preview: boolean; path: string[] }) => {
    const appStaticProps = await getAppStaticProps({
      layout: LayoutType.Profile,
    });
    const result = await getClient(preview).fetch<FetchTaxPageResult>(fetchTaxPage);

    const taxPath = await getTaxPagePath();

    const subpath = (taxPath && taxPath.length < path.length && path[taxPath.length]) || "";

    return {
      appStaticProps,
      preview: preview,
      subpath,
      data: {
        result: result,
        query: fetchTaxPage,
        queryParams: {},
      },
    };
  },
)(({ data, subpath, preview }) => {
  const settings = data.result.settings[0];
  const dashboard = data.result.dashboard[0];
  const page = filterPageToSingleItem(data.result, preview);

  if (!page) return <ErrorMessage>Missing tax page</ErrorMessage>;

  const menuChoice = page.features?.find((f) => f.slug.current == subpath) || null;

  const { donor } = useContext(DonorContext);

  if (!page.features) return <ErrorMessage>No features defined for tax page</ErrorMessage>;

  let pageContent = null;
  if (!menuChoice || menuChoice?._type == "taxunits") {
    pageContent = <TaxUnitsTab />;
  } else if (menuChoice?._type == "taxstatements") {
    pageContent = <YearlyReportsTab />;
  } else if (menuChoice?._type == "facebookdonations") {
    if (!donor) return <ErrorMessage>Missing donor</ErrorMessage>;
    pageContent = (
      <FacebookTab
        donor={donor}
        description={menuChoice.facebook_description || []}
        links={
          menuChoice.facebook_description_links ? menuChoice.facebook_description_links.links : []
        }
      />
    );
  } else if (menuChoice?._type == "abouttaxdeductions") {
    pageContent = (
      <TaxDeductionsTab
        description={menuChoice.about || []}
        links={menuChoice.links ? menuChoice.links.links : []}
      />
    );
  }

  return (
    <>
      <Head>
        <title>Gi Effektivt. | Skatt</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainHeader hideOnScroll={false}>
        <Navbar logo={settings.logo} elements={dashboard.main_navigation} />
        <TaxMenu mobile selected={menuChoice} choices={page.features}></TaxMenu>
      </MainHeader>

      <PageContent>
        <div className={style.container}>
          <h3 className={style.header}>{page.title}</h3>

          <TaxMenu selected={menuChoice} choices={page.features}></TaxMenu>

          {pageContent || <ErrorMessage>Missing page content</ErrorMessage>}
        </div>
      </PageContent>
    </>
  );
});

type FetchTaxPageResult = {
  settings: any[];
  page: Array<{
    title?: string;
    features?: TaxPageFeature[];
    slug?: {
      current?: string;
    };
  }>;
  dashboard: Array<{ dashboard_slug?: { current?: string }; main_navigation: any[] }>;
};

export interface TaxFeatureProps {
  _type: string;
  title: string;
  slug: {
    current: string;
  };
}

export type TaxUnitsData = TaxFeatureProps & {
  _type: "taxunits";
};

export type TaxDeductionData = TaxFeatureProps & {
  _type: "abouttaxdeductions";
  about?: any[];
  links?: LinksProps;
};

export type TaxStatementsData = TaxFeatureProps & {
  _type: "taxstatements";
};

export type MetaReceiptData = TaxFeatureProps & {
  _type: "facebookdonations";
  facebook_description?: any[];
  facebook_description_links?: {
    links: any[];
  };
};

export type TaxPageFeature = TaxUnitsData | TaxDeductionData | TaxStatementsData | MetaReceiptData;

const fetchTaxPage = groq`
{
  "settings": *[_type == "site_settings"] {
    logo,
  },
  "dashboard": *[_id == "dashboard"] {
    tax_slug {
      current
    },
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
  "page": *[_type == "tax"] {
    ...,
    title,
    features[] {
      ...,
      _type == "abouttaxdeductions" => {
        ...,
        links {
          ...,
          ${linksContentQuery}
        }
      },
    },
    slug {
      current
    },
  },
  ${footerQuery}
  ${widgetQuery}
}
`;
