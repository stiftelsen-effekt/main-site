import { DateTime } from "luxon";
import { groq } from "next-sanity";
import Head from "next/head";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import { linksContentQuery, useAnonymousVippsAgreement } from "../../_queries";
import { PageContent } from "../../components/profile/layout/PageContent/PageContent";
import { ProfileLayout } from "../../components/profile/layout/layout";
import { AnonymousVippsAgreement } from "../../components/profile/vipps/AnonymousVippsAgreement";
import { MainHeader } from "../../components/shared/layout/Header/Header";
import { getClient } from "../../lib/sanity.server";
import styles from "../../styles/Agreements.module.css";
import { withStaticProps } from "../../util/withStaticProps";
import { LayoutType, getAppStaticProps } from "../_app.page";
import { Navbar } from "../../components/shared/components/Navbar/Navbar";

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
  const appStaticProps = await getAppStaticProps({ preview, layout: LayoutType.Profile });
  const result = await getClient(preview).fetch<FetchVippsAnonymousPageResult>(
    fetchVippsAnonymousPage,
  );

  return {
    appStaticProps,
    preview: preview,
    navbarData: await Navbar.getStaticProps({ dashboard: true, preview }),
    data: {
      result: result,
      query: fetchVippsAnonymousPage,
      queryParams: {},
    },
  };
})(({ data, navbarData, preview }) => {
  const dashboard = data.result.dashboard[0];
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
        <Navbar {...navbarData} />
      </MainHeader>

      <PageContent>
        <h3 className={styles.header}>Anonym Vipps-avtale</h3>
        <div className={styles.gridContainer}>
          <div className={styles.infoGridCell}>
            {agreement && !loading && (
              <>
                <div className={styles.infoSection}>
                  <p>
                    <strong>Sum:</strong> {agreement.amount} kr
                  </p>
                  <p>
                    <strong>Status:</strong>
                    {"  "}
                    {status === "ACTIVE" ? "Aktiv" : status === "STOPPED" ? "Avsluttet" : "Inaktiv"}
                  </p>
                </div>
                <div className={styles.infoSection}>
                  <p>
                    <strong>Opprettet:</strong>
                    {"  "}
                    {DateTime.fromJSDate(new Date(agreement.timestamp_created)).toFormat(
                      "dd.MM.yyyy",
                    )}
                  </p>
                  <p>
                    <strong>Trekkdag:</strong> Den {agreement.monthly_charge_day}. hver måned
                  </p>
                </div>
              </>
            )}
          </div>
          <div className={styles.editGridCell}>
            {/* TODO: Add proper loading and error messages */}
            {loading && <div>Loading...</div>}
            {error && <div>Error</div>}
            {status === "ACTIVE" && (
              <>
                <AnonymousVippsAgreement
                  endpoint={agreementCode}
                  inputDistribution={distribution}
                  inputSum={agreement.amount}
                  inputDate={agreement.monthly_charge_day}
                />
              </>
            )}
            {status === "STOPPED" && (
              <>
                <h5 className={styles.cellTitle}>Avtalen er avsluttet</h5>
                <p>Avtalen er avsluttet og vil ikke trekkes lenger.</p>
              </>
            )}
            {status !== "STOPPED" && status !== "ACTIVE" && (
              <>
                <h5 className={styles.cellTitle}>Avtalen er ikke aktiv</h5>
                <p>
                  Årsaken til dette kan være at avtalen ikke er aktivert enda, eller at det er noe
                  feil med avtalen.
                </p>
              </>
            )}
          </div>
        </div>
      </PageContent>
    </>
  );
});

type FetchVippsAnonymousPageResult = {
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
  "dashboard": *[_id == "dashboard"] {
    dashboard_slug {
      current
    },
  },
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
