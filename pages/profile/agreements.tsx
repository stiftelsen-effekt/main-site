import Head from "next/head";
import { Layout } from "../../components/profile/layout/layout";
import { LayoutPage } from "../../types";
import "react-toastify/dist/ReactToastify.css";
import { AgreementList } from "../../components/profile/shared/lists/agreementList/AgreementList";
import { AvtaleGiroAgreement, Distribution, Organization, VippsAgreement } from "../../models";
import { useAuth0, User } from "@auth0/auth0-react";
import {
  useAgreementsDistributions,
  useAvtalegiroAgreements,
  useOrganizations,
  useVippsAgreements,
  widgetQuery,
} from "../../_queries";
import { useContext, useEffect, useState } from "react";
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
import { footerQuery } from "../../components/shared/layout/Footer/Footer";
import { MainHeader } from "../../components/shared/layout/Header/Header";
import Link from "next/link";
import { DateTime } from "luxon";

const Agreements: LayoutPage<{ data: any; preview: boolean }> = ({ data, preview }) => {
  const { getAccessTokenSilently, user } = useAuth0();
  const { setActivity } = useContext(ActivityContext);
  const [selected, setSelected] = useState<"Aktive avtaler" | "Inaktive avtaler">("Aktive avtaler");
  const settings = data.result.settings[0];

  const {
    loading: avtaleGiroLoading,
    data: avtaleGiro,
    isValidating: avtaleGiroRefreshing,
    error: avtaleGiroError,
  } = useAvtalegiroAgreements(user as User, getAccessTokenSilently);

  const {
    loading: vippsLoading,
    data: vipps,
    isValidating: vippsRefreshing,
    error: vippsError,
  } = useVippsAgreements(user as User, getAccessTokenSilently);

  const {
    loading: organizationsLoading,
    data: organizations,
    isValidating: organizationsRefreshing,
    error: organizationsError,
  } = useOrganizations(user as User, getAccessTokenSilently);

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
    user as User,
    getAccessTokenSilently,
    !vippsLoading && !avtaleGiroLoading,
    Array.from(kids),
  );

  const loading = vippsLoading || avtaleGiroLoading || distributionsLoading || organizationsLoading;

  const refreshing =
    avtaleGiroRefreshing || vippsRefreshing || organizationsRefreshing || distributionsRefreshing;

  useEffect(() => {
    if (refreshing) setActivity(true);
    else setActivity(false);
  }, [refreshing]);

  if (loading || !organizations || !distributions || !vipps || !avtaleGiro)
    return (
      <>
        <PageContent>
          <h3>Faste avtaler</h3>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Spinner />
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
        distribution.organizations.some((org) => org.id === sciOrgId && parseFloat(org.share) > 0),
    );

  return (
    <>
      <Head>
        <title>Gi Effektivt. | Avtaler</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainHeader hideOnScroll={false}>
        <Navbar logo={settings.logo} />
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
                <Link href={"/articles/nye-evalueringskriterier-for-topplista"} passHref>
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
};

export async function getStaticProps({ preview = false }) {
  const result = await getClient(preview).fetch(fetchProfilePage);

  return {
    props: {
      preview: preview,
      data: {
        result: result,
        query: fetchProfilePage,
        queryParams: {},
      },
    },
  };
}

const fetchProfilePage = groq`
{
  "settings": *[_type == "site_settings"] {
    logo,
  },
  ${footerQuery}
  ${widgetQuery}
}
`;

Agreements.layout = Layout;
export default Agreements;

const getDistributionMap = (distributions: Distribution[], organizations: Organization[]) => {
  const map = new Map<string, Distribution>();

  for (let i = 0; i < distributions.length; i++) {
    let dist = distributions[i];

    let newDist = {
      kid: "",
      organizations: organizations.map((org) => ({
        id: org.id,
        name: org.name,
        share: "0",
      })),
    };

    for (let j = 0; j < dist.organizations.length; j++) {
      let org = dist.organizations[j];
      let index = newDist.organizations.map((o) => o.id).indexOf(org.id);
      if (newDist.organizations[index]) newDist.organizations[index].share = org.share;
    }

    map.set(dist.kid, { ...newDist });
  }

  return map;
};
