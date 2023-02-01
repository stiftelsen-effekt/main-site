import { useAuth0, User } from "@auth0/auth0-react";
import { useContext } from "react";
import { Info } from "react-feather";
import { Distribution, Donation, TaxYearlyReport, TaxYearlyReportUnits } from "../../../../models";
import {
  useDistributions,
  useDonations,
  useTaxUnits,
  useYearlyTaxReports,
} from "../../../../_queries";
import { InfoBox } from "../../../shared/components/Infobox/Infobox";
import { Spinner } from "../../../shared/components/Spinner/Spinner";
import { DonorContext } from "../../layout/donorProvider";
import { TaxYearlyReportList } from "../../shared/lists/taxYearlyReportsList/TaxYearlyReportList";
import { TaxYearlyReportMobileList } from "../../shared/lists/taxYearlyReportsList/TaxYearlyReportMobileList";
import styles from "./YearlyReportsTab.module.scss";

export const YearlyReportsTab: React.FC = () => {
  const { getAccessTokenSilently, user } = useAuth0();

  const { donor } = useContext(DonorContext);

  const {
    loading: reportsLoading,
    isValidating: reportsIsValidating,
    data: reportsData,
    error: reportsError,
  } = useYearlyTaxReports(user as User, getAccessTokenSilently);

  const {
    loading: donationsLoading,
    data: donations,
    isValidating: donationsIsValidating,
    error: donationsError,
  } = useDonations(user as User, getAccessTokenSilently);

  const kids = new Set<string>();
  donations?.map((donation: Donation) => kids.add(donation.KID));

  const {
    loading: distributionsLoading,
    data: distributions,
    isValidating: distributionsValidating,
    error: distributionsError,
  } = useDistributions(user as User, getAccessTokenSilently, !donationsLoading, Array.from(kids));

  const dataAvailable = donations && distributions && reportsData;
  const loading = donationsLoading || distributionsLoading || reportsLoading;

  if (loading || !dataAvailable || !donor) {
    return (
      <div className={styles.container}>
        <h4 className={styles.header}>Dine årsoppgaver</h4>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spinner />
        </div>
      </div>
    );
  }

  const distributionsMap = new Map<string, Distribution>();
  distributions.map((dist: Distribution) => distributionsMap.set(dist.kid, dist));

  return (
    <div className={styles.container}>
      <h4 className={styles.header}>Dine årsoppgaver</h4>

      {reportsData.map((report: TaxYearlyReport) => {
        const sumEanWithoutDeduction = report.sumDonationsWithoutTaxUnit.channels
          .filter((c) => c.channel === "EAN Giverportal")
          .reduce((acc: number, missing) => {
            if (missing.channel === "EAN Giverportal") {
              return acc + missing.sumDonations;
            }
            return acc;
          }, 0);

        const sumEanWithDeduction = report.units
          .map((u) => u.channels.find((c) => c.channel === "EAN Giverportal"))
          .reduce((acc: number, channel) => {
            if (channel) {
              return acc + channel?.sumDonations || 0;
            }
            return acc;
          }, 0);

        const sumEanDonations = sumEanWithDeduction + sumEanWithoutDeduction;

        const eanDistribution: Distribution = {
          kid: "EAN Giverportal",
          taxUnit: null,
          standardDistribution: true,
          shares: [
            {
              id: 12,
              name: "GiveWell Top Charities Fund",
              share: "100",
            },
          ],
        };
        distributionsMap.set("EAN Giverportal", eanDistribution);

        const fakeEanDonation = {
          id: Number.MAX_SAFE_INTEGER,
          KID: "EAN Giverportal",
          sum: sumEanDonations.toString(),
          timestamp: new Date(2022, 6, 1).toISOString(),
          donor: donor.name,
          donorId: parseInt(donor.id),
          email: donor.email,
          paymentMethod: "Bank",
          transactionCost: "0",
          metaOwnerId: 3,
        };

        const mergedDonations = [...donations, fakeEanDonation];

        const filteredDonations = mergedDonations.filter(
          (donation: Donation) => new Date(donation.timestamp).getFullYear() === report.year,
        );

        return (
          <>
            {report.sumDonationsWithoutTaxUnit.sumDonations > 0 && (
              <InfoBox>
                <header>
                  <Info />
                  Donasjoner mangler skattenhet
                </header>
                <p>
                  Du har donasjoner for skatteåret som kvalifiserer til skattefradrag, men mangler
                  skatteenhet.{" "}
                  {report.units.length == 0
                    ? 'Registrer en skatteenhet i fanen til venstre i menyen under "skatt" og alle donasjoner vil knyttes til den. Ta kontakt på donasjon@gieffektivt.no om du ønsker å knytte donasjonene dine til flere skatteenheter.'
                    : "Du har allerede en eller flere skatteenheter. Kontakt oss på donasjon@gieffektivt.no for å knytte donasjonene dine til rett skatteenhet."}
                </p>
              </InfoBox>
            )}
            <div className={styles.desktopList}>
              <TaxYearlyReportList
                key={report.year}
                donations={filteredDonations}
                distribtionMap={distributionsMap}
                report={report}
              />
            </div>
            <div className={styles.mobileList}>
              <TaxYearlyReportMobileList
                key={report.year}
                donations={donations.filter(
                  (donation: Donation) =>
                    new Date(donation.timestamp).getFullYear() === report.year &&
                    distributionsMap.get(donation.KID)?.taxUnit,
                )}
                distribtionMap={distributionsMap}
                report={report}
              />
            </div>
          </>
        );
      })}
    </div>
  );
};
