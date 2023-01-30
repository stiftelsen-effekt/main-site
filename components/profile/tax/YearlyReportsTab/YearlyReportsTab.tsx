import { useAuth0, User } from "@auth0/auth0-react";
import { useState } from "react";
import { Distribution, Donation, TaxUnit, TaxYearlyReport } from "../../../../models";
import {
  useDistributions,
  useDonations,
  useTaxUnits,
  useYearlyTaxReports,
} from "../../../../_queries";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import { Spinner } from "../../../shared/components/Spinner/Spinner";
import { TaxUnitList } from "../../shared/lists/taxUnitList/TaxUnitList";
import { TaxUnitMobileList } from "../../shared/lists/taxUnitList/TaxUnitMobileList";
import { TaxYearlyReportList } from "../../shared/lists/taxYearlyReportsList/TaxYearlyReportList";
import { TaxYearlyReportMobileList } from "../../shared/lists/taxYearlyReportsList/TaxYearlyReportMobileList";
import { TaxUnitCreateModal } from "../../shared/TaxUnitModal/TaxUnitCreateModal";
import styles from "./YearlyReportsTab.module.scss";

export const YearlyReportsTab: React.FC = () => {
  const { getAccessTokenSilently, user } = useAuth0();

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

  if (loading || !dataAvailable) {
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

      {reportsData.map((report: TaxYearlyReport) => (
        <>
          <div className={styles.desktopList}>
            <TaxYearlyReportList
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
      ))}
    </div>
  );
};
