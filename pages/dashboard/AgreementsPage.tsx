import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";
import { AgreementList } from "../../components/profile/shared/lists/agreementList/AgreementList";
import { AvtaleGiroAgreement, Distribution, Organization, VippsAgreement } from "../../models";
import { useAuth0, User } from "@auth0/auth0-react";
import {
  useAgreementsDistributions,
  useAvtalegiroAgreements,
  useOrganizations,
  useVippsAgreements,
} from "../../_queries";
import { useContext, useState } from "react";
import { ActivityContext } from "../../components/profile/layout/activityProvider";
import { InfoBox } from "../../components/shared/components/Infobox/Infobox";
import { AlertTriangle, Clock } from "react-feather";
import AgreementsMenu from "../../components/profile/agreements/AgreementsMenu/AgreementsMenu";
import styles from "../../styles/Agreements.module.css";
import { PageContent } from "../../components/profile/layout/PageContent/PageContent";
import { getClient } from "../../lib/sanity.server";
import { groq } from "next-sanity";
import { Navbar } from "../../components/profile/layout/navbar";
import { Spinner } from "../../components/shared/components/Spinner/Spinner";
import { MainHeader } from "../../components/shared/layout/Header/Header";
import Link from "next/link";
import { DateTime } from "luxon";
import { useRouterContext } from "../../context/RouterContext";
import { GetStaticPropsContext } from "next";
import { withStaticProps } from "../../util/withStaticProps";
import { LayoutType, getAppStaticProps } from "../_app.page";
import { ProfileLayout } from "../../components/profile/layout/layout";

export async function getAgreementsPagePath() {
  const result = await getClient(false).fetch<FetchAgreementsPageResult>(fetchAgreementsPage);

  const dashboardSlug = result?.dashboard?.[0]?.dashboard_slug?.current;
  const agreementsSlug = result?.page?.[0]?.slug?.current;

  if (!dashboardSlug || !agreementsSlug) return null;

  return [dashboardSlug, agreementsSlug];
}

export const AgreementsPage = withStaticProps(
  async ({ preview = false }: GetStaticPropsContext<{ slug: string[] }>) => {
    const appStaticProps = await getAppStaticProps({ preview, layout: LayoutType.Profile });
    const result = await getClient(preview).fetch<FetchAgreementsPageResult>(fetchAgreementsPage);

    return {
      appStaticProps,
      preview: preview,
      navbar: await Navbar.getStaticProps({ preview }),
      data: {
        result: result,
        query: fetchAgreementsPage,
        queryParams: {},
      },
    };
  },
)(({ data, navbar, preview }) => {
  const { articlesPagePath } = useRouterContext();
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
    loading: organizationsLoading,
    data: organizations,
    isValidating: organizationsRefreshing,
    error: organizationsError,
  } = useOrganizations(getAccessTokenSilently);

  const kids = new Set<string>();
  if (vipps && avtaleGiro)
    [
      ...vipps?.map((a: VippsAgreement) => a.KID),
      ...avtaleGiro?.map((a: AvtaleGiroAgreement) => a.KID),
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

  const loading = vippsLoading || avtaleGiroLoading || distributionsLoading || organizationsLoading;

  if (loading || !organizations || !distributions || !vipps || !avtaleGiro)
    return (
      <>
        <Head>
          <title>Gi Effektivt. | Avtaler</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <MainHeader hideOnScroll={false}>
          <Navbar {...navbar} />
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

  const activeVippsAgreements: VippsAgreement[] = vipps.filter(
    (agreement: VippsAgreement) => agreement.status === "ACTIVE",
  );

  const distributionsMap = getDistributionMap(distributions, organizations);

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
  const pendingCount = vippsPending.length + avtalegiroPending.length;

  const sciOrgId = 2;
  const hasDistributionWithSCI = [...activeAvtalegiroAgreements, ...activeVippsAgreements]
    .map((agreement) => distributionsMap.get(agreement.KID))
    .some(
      (distribution: Distribution | undefined) =>
        distribution &&
        distribution.shares.some((org) => org.id === sciOrgId && parseFloat(org.share) > 0),
    );

  return (
    <>
      <Head>
        <title>Gi Effektivt. | Avtaler</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainHeader hideOnScroll={false}>
        <Navbar {...navbar} />
        <AgreementsMenu
          selected={selected}
          onChange={(selected) => setSelected(selected)}
        ></AgreementsMenu>
      </MainHeader>

      <PageContent>
        <div className={styles.container}>
          <h3 className={styles.header}>Faste avtaler</h3>

          {hasDistributionWithSCI && (
            <InfoBox>
              <header>
                <AlertTriangle size={24} color={"black"} />
                SCI Foundation utgår som anbefalt organisasjon
              </header>
              <p>
                Du har en aktiv donasjonsavtale til SCI Foundation. Vi anbefaler ikke lenger
                donasjoner til SCI Foundation gjeldende fra 18.08.22 og vil slutte å tildele penger
                til dem 31. oktober 2022. Les mer om denne endringen på{" "}
                <Link
                  href={`/${[...articlesPagePath, "nye-evalueringskriterier-for-topplista"]}`}
                  passHref
                >
                  <a style={{ textDecoration: "underline" }}>bloggen vår</a>
                </Link>
                .
              </p>
              <br />
              <p>
                Donasjoner øremerket SCI Foundation blir fra og med 1. november 2022 i stedet følge{" "}
                <Link href={"/smart-fordeling"} passHref>
                  <a style={{ textDecoration: "underline" }}>Smart fordeling</a>
                </Link>
                . Om du ønsker en annen fordeling kan du oppdatere fordelingen på din faste
                donasjon, eller fylle ut donasjonsskjemaet for en ny donasjon. Ta kontakt om du har
                noen spørsmål.
              </p>
            </InfoBox>
          )}

          {pendingCount >= 1 && (
            <InfoBox>
              <header>
                <Clock size={24} color={"black"} />
                {pendingCount} {pendingCount === 1 ? "avtale" : "avtaler"} bekreftes
              </header>
              <p>
                Vi har registrert {pendingCount} {pendingCount === 1 ? "ny avtale" : "nye avtaler"}{" "}
                på deg. Bankene bruker noen dager på å bekrefte opprettelse før avtalen din blir
                aktivert.
              </p>
            </InfoBox>
          )}

          {window.innerWidth > 1180 || selected === "Aktive avtaler" ? (
            <AgreementList
              title={"Aktive"}
              vipps={activeVippsAgreements}
              avtalegiro={activeAvtalegiroAgreements}
              distributions={distributionsMap}
              supplemental={"Dette er dine aktive betalingsavtaler du har med oss"}
              emptyString={"Vi har ikke registrert noen aktive faste donasjonsavtaler på deg."}
              expandable={true}
            />
          ) : null}

          {window.innerWidth > 1180 || selected === "Inaktive avtaler" ? (
            <AgreementList
              title={"Inaktive"}
              vipps={vipps.filter((agreement: VippsAgreement) => agreement.status !== "ACTIVE")}
              avtalegiro={avtaleGiro.filter(
                (agreement: AvtaleGiroAgreement) => agreement.cancelled !== null,
              )}
              distributions={distributionsMap}
              supplemental={
                "Dette er tidligere faste betalingsavtaler du har hatt med oss, som vi ikke lenger trekker deg for"
              }
              emptyString={"Vi har ikke registrert noen tidligere donasjonsavtaler på deg."}
              expandable={false}
            />
          ) : null}
        </div>
      </PageContent>
    </>
  );
});

type FetchAgreementsPageResult = {
  dashboard: Array<{ dashboard_slug?: { current?: string } }>;
  page?: Array<{ slug?: { current?: string } }>;
};

const fetchAgreementsPage = groq`
{
  "dashboard": *[_id == "dashboard"] {
    dashboard_slug {
      current
    },
  },
  "page": *[_id == "agreements"] {
    slug {
      current
    }
  }
}
`;

const getDistributionMap = (distributions: Distribution[], organizations: Organization[]) => {
  const map = new Map<string, Distribution>();

  for (let i = 0; i < distributions.length; i++) {
    let dist = distributions[i];

    let newDist: Distribution = {
      kid: "",
      standardDistribution: dist.standardDistribution,
      taxUnit: dist.taxUnit,
      shares: organizations.map((org) => ({
        id: org.id,
        name: org.name,
        share: "0",
      })),
    };

    for (let j = 0; j < dist.shares.length; j++) {
      let org = dist.shares[j];
      let index = newDist.shares.map((o) => o.id).indexOf(org.id);
      if (newDist.shares[index]) newDist.shares[index].share = org.share;
    }

    map.set(dist.kid, { ...newDist });
  }

  return map;
};
