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
import { widgetQuery } from "../../_queries";
import TaxMenu, { TaxMenuChoices } from "../../components/profile/tax/TaxMenu/TaxMenu";
import { FacebookTab } from "../../components/profile/tax/FacebookTab/FacebookTab";
import { TaxDeductionsTab } from "../../components/profile/tax/TaxDeductionsTab/TaxDeductionsTab";
import { TaxUnitsTab } from "../../components/profile/tax/TaxUnitsTab/TaxUnitsTab";
import { YearlyReportsTab } from "../../components/profile/tax/YearlyReportsTab/YearlyReportsTab";
import { withStaticProps } from "../../util/withStaticProps";
import { getDashboardPagePath } from "./DonationsPage";
import { LayoutType, getAppStaticProps } from "../_app.page";

export async function getTaxPagePath() {
  const result = await getClient(false).fetch<FetchTaxPageResult>(fetchTaxPage);
  const dashboardPath = await getDashboardPagePath();

  const { dashboard: [dashboard] = [] } = result;

  const taxSlug = dashboard?.tax_slug?.current;

  if (!taxSlug) return null;

  return [...dashboardPath, ...taxSlug.split("/")];
}

export async function getTaxDeductionPagePath() {
  const result = await getClient(false).fetch<FetchTaxPageResult>(fetchTaxPage);
  const taxPath = await getTaxPagePath();

  const { taxdeduction: [taxdeduction] = [] } = result;

  const taxdeductionSlug = taxdeduction?.slug?.current;

  if (!taxPath || !taxdeductionSlug) return null;

  return [...taxPath, ...taxdeductionSlug.split("/")];
}

export async function getTaxUnitsPagePath() {
  const result = await getClient(false).fetch<FetchTaxPageResult>(fetchTaxPage);
  const taxPath = await getTaxPagePath();

  const { taxunits: [taxunits] = [] } = result;

  const taxunitsSlug = taxunits?.slug?.current;

  if (!taxPath || !taxunitsSlug) return null;

  return [...taxPath, ...taxunitsSlug.split("/")];
}

export async function getTaxStatementsPagePath() {
  const result = await getClient(false).fetch<FetchTaxPageResult>(fetchTaxPage);
  const taxPath = await getTaxPagePath();

  const { taxstatements: [taxstatements] = [] } = result;

  const taxstatementsSlug = taxstatements?.slug?.current;

  if (!taxPath || !taxstatementsSlug) return null;

  return [...taxPath, ...taxstatementsSlug.split("/")];
}

export async function getMetaReceiptPagePath() {
  const result = await getClient(false).fetch<FetchTaxPageResult>(fetchTaxPage);
  const taxPath = await getTaxPagePath();

  const { metareceipt: [metareceipt] = [] } = result;

  const metareceiptSlug = metareceipt?.slug?.current;

  if (!taxPath || !metareceiptSlug) return null;

  return [...taxPath, ...metareceiptSlug.split("/")];
}

export const TaxPage = withStaticProps(
  async ({ preview, path }: { preview: boolean; path: string[] }) => {
    const appStaticProps = await getAppStaticProps({
      layout: LayoutType.Profile,
    });
    const result = await getClient(preview).fetch<FetchTaxPageResult>(fetchTaxPage);

    const taxPath = await getTaxPagePath();

    const {
      taxdeduction: [taxdeduction] = [],
      taxunits: [taxunits] = [],
      taxstatements: [taxstatements] = [],
      metareceipt: [metareceipt] = [],
    } = result;

    const subpath = (taxPath && taxPath.length < path.length && path[taxPath.length]) || null;

    const menuChoice = (() => {
      switch (subpath) {
        case taxdeduction?.slug?.current:
          return TaxMenuChoices.ABOUT_TAX_DEDUCTIONS;
        case metareceipt?.slug?.current:
          return TaxMenuChoices.FACEBOOK_DONATIONS;
        case taxstatements?.slug?.current:
          return TaxMenuChoices.YEARLY_REPORTS;
        default:
          return TaxMenuChoices.TAX_UNITS;
      }
    })();

    return {
      appStaticProps,
      preview: preview,
      menuChoice,
      data: {
        result: result,
        query: fetchTaxPage,
        queryParams: {},
      },
    };
  },
)(({ data, menuChoice, preview }) => {
  const router = useRouter();
  const {
    settings: [settings] = [],
    taxdeduction: [taxdeduction] = [],
    taxunits: [taxunits] = [],
    taxstatements: [taxstatements] = [],
    metareceipt: [metareceipt] = [],
  } = data.result;

  const { donor } = useContext(DonorContext);

  if ((!router.isFallback && !data) || !donor) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Gi Effektivt. | Skatt</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainHeader hideOnScroll={false}>
        <Navbar logo={settings.logo} />
        <TaxMenu mobile selected={menuChoice}></TaxMenu>
      </MainHeader>

      <PageContent>
        <div className={style.container}>
          <h3 className={style.header}>Skatt</h3>

          <TaxMenu selected={menuChoice}></TaxMenu>

          {menuChoice == TaxMenuChoices.TAX_UNITS && <TaxUnitsTab />}

          {menuChoice == TaxMenuChoices.YEARLY_REPORTS && <YearlyReportsTab />}

          {menuChoice == TaxMenuChoices.FACEBOOK_DONATIONS && (
            <FacebookTab
              donor={donor}
              description={metareceipt.facebook_description}
              links={
                metareceipt.facebook_description_links
                  ? metareceipt.facebook_description_links.links
                  : []
              }
            />
          )}

          {menuChoice == TaxMenuChoices.ABOUT_TAX_DEDUCTIONS && (
            <TaxDeductionsTab
              description={taxdeduction.about_taxdeductions}
              links={
                taxdeduction.about_taxdeductions_links
                  ? taxdeduction.about_taxdeductions_links.links
                  : []
              }
            ></TaxDeductionsTab>
          )}
        </div>
      </PageContent>
    </>
  );
});

type FetchTaxPageResult = {
  settings?: any[];
  taxdeduction?: Array<{ slug?: { current?: string } } & Record<string, any>>;
  taxunits?: Array<{ slug?: { current?: string } } & Record<string, any>>;
  taxstatements?: Array<{ slug?: { current?: string } } & Record<string, any>>;
  metareceipt?: Array<{ slug?: { current?: string } } & Record<string, any>>;
  dashboard?: {
    tax_slug?: {
      current?: string;
    };
  }[];
};

const fetchTaxPage = groq`
{
  "settings": *[_type == "site_settings"] {
    logo,
  },
  "dashboard": *[_type == "dashboard"] {
    tax_slug {
      current
    },
  },
  "taxdeduction": *[_type == "taxdeduction"] {
    slug {
      current
    },
    about_taxdeductions,
    about_taxdeductions_links,
  },
  "metareceipt": *[_type == "metareceipt"] {
    slug {
      current
    },
    facebook_description,
    facebook_description_links,
  },
  "taxstatements": *[_type == "taxstatements"] {
    slug {
      current
    }
  },
  "taxunits": *[_type == "taxunits"] {
    slug {
      current
    }
  },
  ${footerQuery}
  ${widgetQuery}
}
`;
