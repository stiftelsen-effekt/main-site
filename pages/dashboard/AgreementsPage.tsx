import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";
import { AgreementList } from "../../components/profile/shared/lists/agreementList/AgreementList";
import { AutoGiroAgreement, AvtaleGiroAgreement, Distribution, VippsAgreement } from "../../models";
import { useAuth0 } from "@auth0/auth0-react";
import {
  useAgreementsDistributions,
  useAutogiroAgreements,
  useAvtalegiroAgreements,
  useTaxUnits,
  useVippsAgreements,
} from "../../_queries";
import { useState } from "react";
import { InfoBox } from "../../components/shared/components/Infobox/Infobox";
import { Clock } from "react-feather";
import AgreementsMenu from "../../components/profile/agreements/AgreementsMenu/AgreementsMenu";
import styles from "../../styles/Agreements.module.css";
import { PageContent } from "../../components/profile/layout/PageContent/PageContent";
import { getClient } from "../../lib/sanity.client";
import { groq } from "next-sanity";
import { Spinner } from "../../components/shared/components/Spinner/Spinner";
import { MainHeader } from "../../components/shared/layout/Header/Header";
import { DateTime } from "luxon";
import { GetStaticPropsContext } from "next";
import { withStaticProps } from "../../util/withStaticProps";
import { LayoutType, getAppStaticProps } from "../_app.page";
import { Navbar } from "../../components/shared/components/Navbar/Navbar";
import { token } from "../../token";

export async function getAgreementsPagePath() {
  const result = await getClient().fetch<FetchAgreementsPageResult>(fetchAgreementsPage);

  const dashboardSlug = result?.dashboard?.[0]?.dashboard_slug?.current;
  const agreementsSlug = result?.page?.slug?.current;

  if (!dashboardSlug || !agreementsSlug) return null;

  return [dashboardSlug, agreementsSlug];
}

export const AgreementsPage = withStaticProps(
  async ({ draftMode = false }: GetStaticPropsContext<{ slug: string[] }>) => {
    const appStaticProps = await getAppStaticProps({ draftMode, layout: LayoutType.Profile });
    const result = await getClient(draftMode ? token : undefined).fetch<FetchAgreementsPageResult>(
      fetchAgreementsPage,
    );

    return {
      appStaticProps,
      draftMode,
      navbarData: await Navbar.getStaticProps({ dashboard: true, draftMode }),
      data: {
        result: result,
        query: fetchAgreementsPage,
        queryParams: {},
      },
    }; // satisfies GeneralPageProps (requires next@13);;
  },
)(({ navbarData, data, draftMode }) => {
  const page = data.result.page;
  const { getAccessTokenSilently, user } = useAuth0();
  const [selected, setSelected] = useState<"Aktive avtaler" | "Inaktive avtaler">("Aktive avtaler");

  const {
    loading: avtaleGiroLoading,
    data: avtaleGiro,
    isValidating: avtaleGiroRefreshing,
    error: avtaleGiroError,
  } = useAvtalegiroAgreements(user, getAccessTokenSilently);

  const {
    loading: vippsLoading,
    data: vipps,
    isValidating: vippsRefreshing,
    error: vippsError,
  } = useVippsAgreements(user, getAccessTokenSilently);

  const {
    loading: autoGiroLoading,
    data: autoGiro,
    isValidating: autoGiroRefreshing,
    error: autoGiroError,
  } = useAutogiroAgreements(user, getAccessTokenSilently);

  const kids = new Set<string>();
  if (vipps && avtaleGiro && autoGiro)
    [
      ...vipps?.map((a: VippsAgreement) => a.KID),
      ...avtaleGiro?.map((a: AvtaleGiroAgreement) => a.KID),
      ...autoGiro?.map((a: AutoGiroAgreement) => a.KID),
    ].map((kid) => kids.add(kid));

  const {
    loading: distributionsLoading,
    data: distributions,
    isValidating: distributionsRefreshing,
    error: distributionsError,
  } = useAgreementsDistributions(
    user,
    getAccessTokenSilently,
    !vippsLoading && !avtaleGiroLoading,
    Array.from(kids),
  );

  const {
    loading: taxUnitsLoading,
    data: taxUnits,
    isValidating: taxUnitsRefreshing,
    error: taxUnitsError,
  } = useTaxUnits(user, getAccessTokenSilently);

  const loading =
    vippsLoading || avtaleGiroLoading || distributionsLoading || taxUnitsLoading || autoGiroLoading;

  if (loading || !distributions || !vipps || !avtaleGiro || !taxUnits || !autoGiro)
    return (
      <>
        <Head>
          <title>{data.result.settings[0].title} | Avtaler</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <MainHeader hideOnScroll={false}>
          <Navbar {...navbarData} />
          <AgreementsMenu
            selected={selected}
            onChange={(selected) => setSelected(selected)}
          ></AgreementsMenu>
        </MainHeader>

        <PageContent>
          <div className={styles.container}>
            <h3 className={styles.header}>Faste avtaler</h3>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Spinner />
            </div>
          </div>
        </PageContent>
      </>
    );

  const activeAvtalegiroAgreements: AvtaleGiroAgreement[] = avtaleGiro.filter(
    (agreement: AvtaleGiroAgreement) => agreement.active === 1,
  );

  const activeAutogiroAgreements: AutoGiroAgreement[] = autoGiro.filter(
    (agreement: AutoGiroAgreement) => agreement.active === true,
  );

  const activeVippsAgreements: VippsAgreement[] = vipps.filter(
    (agreement: VippsAgreement) => agreement.status === "ACTIVE",
  );

  // A map with kid as key and distribution as value
  const distributionsMap = new Map<string, Distribution>();
  distributions.forEach((distribution: Distribution) => {
    distributionsMap.set(distribution.kid, distribution);
  });

  const vippsPending = vipps.filter(
    (agreement: VippsAgreement) =>
      agreement.status === "PENDING" &&
      DateTime.fromISO(agreement.timestamp_created).diff(DateTime.now(), "days").days > -7,
  );
  const avtalegiroPending = avtaleGiro.filter(
    (agreement: AvtaleGiroAgreement) =>
      agreement.active === 0 &&
      agreement.cancelled === null &&
      DateTime.fromISO(agreement.created).diff(DateTime.now(), "days").days > -7,
  );
  const autoGiroPending = autoGiro.filter(
    (agreement: AutoGiroAgreement) =>
      !agreement.active &&
      agreement.cancelled === null &&
      DateTime.fromISO(agreement.created).diff(DateTime.now(), "days").days > -7,
  );
  const pendingCount = vippsPending.length + avtalegiroPending.length + autoGiroPending.length;

  return (
    <>
      <Head>
        <title>{data.result.settings[0].title} | Avtaler</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainHeader hideOnScroll={false}>
        <Navbar {...navbarData} />
        <AgreementsMenu
          selected={selected}
          onChange={(selected) => setSelected(selected)}
        ></AgreementsMenu>
      </MainHeader>

      <PageContent>
        <div className={styles.container}>
          <h3 className={styles.header}>{page?.title}</h3>

          {pendingCount >= 1 && (
            <InfoBox>
              <header>
                <Clock size={24} color={"black"} />
                {pendingCount === 1
                  ? page?.pending_agreements_box_configuration.single_pending_agreement_title
                  : page?.pending_agreements_box_configuration.multiple_pending_agreements_title_template.replace(
                      "{{count}}",
                      pendingCount.toString(),
                    )}
              </header>
              <p>
                {pendingCount === 1
                  ? page?.pending_agreements_box_configuration.single_pending_agreement_text
                  : page?.pending_agreements_box_configuration.multiple_pending_agreements_text_template.replace(
                      "{{count}}",
                      pendingCount.toString(),
                    )}
              </p>
            </InfoBox>
          )}

          {window.innerWidth > 1180 || selected === "Aktive avtaler" ? (
            <AgreementList
              vipps={activeVippsAgreements}
              avtalegiro={activeAvtalegiroAgreements}
              autogiro={activeAutogiroAgreements}
              distributions={distributionsMap}
              taxUnits={taxUnits}
              expandable={true}
              configuration={page?.active_list_configuration}
            />
          ) : null}

          {window.innerWidth > 1180 || selected === "Inaktive avtaler" ? (
            <AgreementList
              vipps={vipps.filter((agreement: VippsAgreement) => agreement.status !== "ACTIVE")}
              avtalegiro={avtaleGiro.filter(
                (agreement: AvtaleGiroAgreement) => agreement.cancelled !== null,
              )}
              autogiro={autoGiro.filter(
                (agreement: AutoGiroAgreement) => agreement.cancelled !== null,
              )}
              distributions={distributionsMap}
              taxUnits={taxUnits}
              expandable={false}
              configuration={page?.inactive_list_configuration}
            />
          ) : null}
        </div>
      </PageContent>
    </>
  );
});

type AgreementsPageData = {
  title?: string;
  pending_agreements_box_configuration: {
    single_pending_agreement_title: string;
    multiple_pending_agreements_title_template: string;
    single_pending_agreement_text: string;
    multiple_pending_agreements_text_template: string;
  };
  active_list_configuration?: any;
  inactive_list_configuration?: any;
  slug?: { current?: string };
};

type FetchAgreementsPageResult = {
  settings: Array<{
    title?: string;
  }>;
  dashboard: Array<{ dashboard_slug?: { current?: string } }>;
  page?: AgreementsPageData;
};

const fetchAgreementsPage = groq`
{
  "settings": *[_type == "site_settings"] {
    title,
  },
  "dashboard": *[_id == "dashboard"] {
    dashboard_slug {
      current
    },
  },
  "page": *[_id == "agreements"][0] {
    ...,
    active_list_configuration {
      ...,
      details_configuration {
        ...,
        date_selector_configuration->{
          ...,
        }
      }
    },
    slug {
      current
    }
  }
}
`;
