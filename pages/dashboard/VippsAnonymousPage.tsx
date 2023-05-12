import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";
import { linksContentQuery, useAnonymousVippsAgreement, widgetQuery } from "../../_queries";
import styles from "../../styles/Agreements.module.css";
import { PageContent } from "../../components/profile/layout/PageContent/PageContent";
import { getClient } from "../../lib/sanity.server";
import { groq } from "next-sanity";
import { Navbar } from "../../components/profile/layout/navbar";
import { footerQuery } from "../../components/shared/layout/Footer/Footer";
import { MainHeader } from "../../components/shared/layout/Header/Header";
import { useRouter } from "next/router";
import { withStaticProps } from "../../util/withStaticProps";
import { LayoutType, getAppStaticProps } from "../_app.page";
import { AnonymousVippsAgreement } from "../../components/profile/vipps/AnonymousVippsAgreement";

export async function getVippsAnonymousPagePath() {
  const result = await getClient(false).fetch<FetchVippsAnonymousPageResult>(
    fetchVippsAnonymousPage,
  );

  const dashboardSlug = result?.dashboard?.[0]?.dashboard_slug?.current;
  const slug = result?.vipps?.[0]?.anonymous_page?.slug.current;

  if (!dashboardSlug || !slug) return null;

  return [dashboardSlug, slug];
}

export const VippsAnonymousPage = withStaticProps(async ({ preview }: { preview: boolean }) => {
  const appStaticProps = await getAppStaticProps({
    layout: LayoutType.Profile,
  });
  const result = await getClient(preview).fetch<FetchVippsAnonymousPageResult>(
    fetchVippsAnonymousPage,
  );

  return {
    appStaticProps,
    preview: preview,
    data: {
      result: result,
      query: fetchVippsAnonymousPage,
      queryParams: {},
    },
  };
})(({ data, preview }) => {
  const settings = data.result.settings[0];
  const router = useRouter();
  const agreementCode = router.query["agreement-code"] as string;
  const page = data.result.vipps?.[0].anonymous_page;

  if (!page) {
    return <div>404{preview ? " - Attempting to load preview" : null}</div>;
  }

  const { loading, data: agreementData, error } = useAnonymousVippsAgreement(agreementCode);

  const distribution = agreementData?.distribution;
  const agreement = agreementData?.agreement;
  const status = agreement?.status;

  return (
    <>
      <Head>
        <title>Gi Effektivt. | Anonym Vipps-avtale</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainHeader hideOnScroll={false}>
        <Navbar logo={settings.logo} />
      </MainHeader>

      <PageContent>
        <h3 className={styles.header}>Anonym Vipps-avtale</h3>
        <p>Her kan du endre eller avslutte din anonyme Vipps-avtale.</p>
        <div className={styles.gridContainer}>
          <div className={styles.editGridCell}>
            {loading && <div>Loading...</div>}
            {error && <div>Error</div>}
            {status === "ACTIVE" && (
              <AnonymousVippsAgreement
                endpoint={agreementCode}
                inputDistribution={distribution}
                inputSum={agreement.amount}
                inputDate={agreement.monthly_charge_day}
              />
            )}
            {status === "STOPPED" && (
              <div>
                <h4>Avtalen er avsluttet</h4>
                <p>Avtalen er avsluttet og vil ikke trekkes lenger.</p>
              </div>
            )}
            {status !== "STOPPED" && status !== "ACTIVE" && (
              <div>
                <h4>Avtalen er ikke aktiv</h4>
                <p>
                  Årsaken til dette kan være at avtalen ikke er aktivert enda, eller at det er noe
                  feil med avtalen.
                </p>
              </div>
            )}
          </div>
          <div className={styles.infoGridCell}>
            {agreement && (
              <>
                <h4>Din avtale</h4>
                <p>Sum: {agreement.amount} kr</p>
                <p>Trekkdag: Den {agreement.monthly_charge_day}. hver måned</p>
                <p>Status: {status}</p>
              </>
            )}
          </div>
        </div>
      </PageContent>
    </>
  );
});

type FetchVippsAnonymousPageResult = {
  settings: any[];
  dashboard: Array<{ dashboard_slug?: { current?: string } }>;
  vipps?: Array<{
    anonymous_page: Record<string, any> & {
      slug: {
        current: string;
      };
    };
  }>;
};

const fetchVippsAnonymousPage = groq`
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
  "dashboard": *[_id == "dashboard"] {
    dashboard_slug {
      current
    }
  },
  ${widgetQuery}
  ${footerQuery}
  "vipps": *[_id == "vipps"] {
    anonymous_page->{
      slug {
        current
      },
      header {
        ...,
        seoImage{
          asset->
        },
        ${linksContentQuery}
      },
      content,
    }
  }
}
`;
