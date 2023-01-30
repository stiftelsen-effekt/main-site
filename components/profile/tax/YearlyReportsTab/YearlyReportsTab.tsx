import { useAuth0, User } from "@auth0/auth0-react";
import { useContext, useState } from "react";
import {
  Distribution,
  Donation,
  TaxUnit,
  TaxYearlyReport,
  TaxYearlyReportChannelDeductions,
  TaxYearlyReportMissingTaxUnitDonations,
  TaxYearlyReportUnits,
} from "../../../../models";
import {
  useDistributions,
  useDonations,
  useTaxUnits,
  useYearlyTaxReports,
} from "../../../../_queries";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import { Spinner } from "../../../shared/components/Spinner/Spinner";
import { DonorContext } from "../../layout/donorProvider";
import { TaxUnitList } from "../../shared/lists/taxUnitList/TaxUnitList";
import { TaxUnitMobileList } from "../../shared/lists/taxUnitList/TaxUnitMobileList";
import { TaxYearlyReportList } from "../../shared/lists/taxYearlyReportsList/TaxYearlyReportList";
import { TaxYearlyReportMobileList } from "../../shared/lists/taxYearlyReportsList/TaxYearlyReportMobileList";
import { TaxUnitCreateModal } from "../../shared/TaxUnitModal/TaxUnitCreateModal";
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
        const sumEanWithoutDeduction = report.sumDonationsWithoutTaxUnitByChannel.reduce(
          (acc: number, missing: TaxYearlyReportMissingTaxUnitDonations) => {
            if (missing.channel === "EAN Giverportal") {
              return acc + missing.sumDonationsWithoutTaxUnit;
            }
            return acc;
          },
          0,
        );

        const sumEanWithDeduction = report.units.reduce(
          (acc: number, unit: TaxYearlyReportUnits) => {
            if (unit.channel === "EAN Giverportal") {
              return acc + parseFloat(unit.sumDonations);
            }
            return acc;
          },
          0,
        );

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
