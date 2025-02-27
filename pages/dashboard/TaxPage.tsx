import { groq } from "next-sanity";
import Head from "next/head";
import { useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { linksContentQuery } from "../../_queries";
import { LinksProps } from "../../components/main/blocks/Links/Links";
import { PageContent } from "../../components/profile/layout/PageContent/PageContent";
import { DonorContext } from "../../components/profile/layout/donorProvider";
import { ErrorMessage } from "../../components/profile/shared/ErrorMessage/ErrorMessage";
import { FacebookTab } from "../../components/profile/tax/FacebookTab/FacebookTab";
import { TaxDeductionsTab } from "../../components/profile/tax/TaxDeductionsTab/TaxDeductionsTab";
import { AggregatedImpactTableConfiguration } from "../../components/profile/donations/DonationsAggregateImpactTable/DonationsAggregateImpactTable";
import TaxMenu from "../../components/profile/tax/TaxMenu/TaxMenu";
import { TaxUnitsTab } from "../../components/profile/tax/TaxUnitsTab/TaxUnitsTab";
import { YearlyReportsTab } from "../../components/profile/tax/YearlyReportsTab/YearlyReportsTab";
import { MainHeader } from "../../components/shared/layout/Header/Header";
import { getClient } from "../../lib/sanity.client";
import style from "../../styles/Tax.module.css";
import { withStaticProps } from "../../util/withStaticProps";
import { GeneralPageProps, LayoutType, getAppStaticProps } from "../_app.page";
import { getDashboardPagePath } from "./DonationsPage";
import { Navbar } from "../../components/shared/components/Navbar/Navbar";
import { token } from "../../token";
import { stegaClean } from "@sanity/client/stega";
import { ConsentState } from "../../middleware.page";

export async function getTaxPagePath(): Promise<string[]> {
  const result = await getClient().fetch<FetchTaxPageResult>(fetchTaxPage);
  const dashboardPath = await getDashboardPagePath();

  const { dashboard: [dashboard] = [] } = result;

  const page = result.page;

  const taxSlug = stegaClean(page?.slug?.current);

  if (!taxSlug) return [];

  return [...dashboardPath, ...taxSlug.split("/")];
}

export async function getTaxPageSubPaths(): Promise<string[][]> {
  const result = await getClient().fetch<FetchTaxPageResult>(fetchTaxPage);
  const dashboardPath = await getDashboardPagePath();

  const { dashboard: [dashboard] = [] } = result;

  const page = result.page;

  const taxSlug = stegaClean(page?.slug?.current);

  if (!taxSlug) return [];
  if (!page.features) return [];

  return page.features.map((f) => [
    ...dashboardPath.map((component) => stegaClean(component)),
    ...taxSlug.split("/").map((component) => stegaClean(component)),
    f.slug.current,
  ]);
}

export const TaxPage = withStaticProps(
  async ({
    draftMode = false,
    path,
    consentState,
  }: {
    draftMode: boolean;
    path: string[];
    consentState: ConsentState;
  }) => {
    const appStaticProps = await getAppStaticProps({
      draftMode,
      consentState,
      layout: LayoutType.Profile,
    });
    const result = await getClient(draftMode ? token : undefined).fetch<FetchTaxPageResult>(
      fetchTaxPage,
    );

    const taxPath = await getTaxPagePath();

    const subpath = (taxPath && taxPath.length < path.length && path[taxPath.length]) || "";

    return {
      appStaticProps,
      draftMode,
      preview: draftMode,
      token: draftMode ? token ?? null : null,
      navbarData: await Navbar.getStaticProps({ dashboard: true, draftMode }),
      subpath,
      data: {
        result: result,
        query: fetchTaxPage,
        queryParams: {},
      },
    } satisfies GeneralPageProps;
  },
)(({ data, subpath, navbarData, draftMode }) => {
  const page = data.result.page;

  if (!page) return <ErrorMessage>Missing tax page</ErrorMessage>;

  const menuChoice = page.features?.find((f) => f.slug.current == subpath) || null;

  const { donor } = useContext(DonorContext);

  if (!page.features) return <ErrorMessage>No features defined for tax page</ErrorMessage>;

  let pageContent = null;
  if (!menuChoice || menuChoice?._type == "taxunits") {
    pageContent = <TaxUnitsTab />;
  } else if (menuChoice?._type == "taxstatements") {
    pageContent = (
      <YearlyReportsTab aggregatedImpactConfiguration={menuChoice.aggregate_estimated_impact} />
    );
  } else if (menuChoice?._type == "metareceipt") {
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
        <title>{data.result.settings[0].title} | Skatt</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainHeader hideOnScroll={false}>
        <Navbar {...navbarData} />
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
  settings: Array<{
    main_currency?: string;
    title?: string;
  }>;
  page: {
    title?: string;
    features?: TaxPageFeature[];
    slug?: {
      current?: string;
    };
  };
  dashboard: Array<{ dashboard_slug?: { current?: string } }>;
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
  aggregate_estimated_impact: AggregatedImpactTableConfiguration;
};

export type MetaReceiptData = TaxFeatureProps & {
  _type: "metareceipt";
  facebook_description?: any[];
  facebook_description_links?: {
    links: any[];
  };
};

export type TaxPageFeature = TaxUnitsData | TaxDeductionData | TaxStatementsData | MetaReceiptData;

const fetchTaxPage = groq`
{
  "settings": *[_type == "site_settings"] {
    main_currency,
    title,
  },
  "dashboard": *[_id == "dashboard"] {
    dashboard_slug {
      current
    },
  },
  "page": *[_type == "tax"][0] {
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
      _type == "taxstatements" => {
        ...,
        aggregate_estimated_impact -> {
          ...,
          "currency": *[ _type == "site_settings"][0].main_currency,
          "locale": *[ _type == "site_settings"][0].main_locale,
        }
      },
    },
    slug {
      current
    },
  },
}
`;
