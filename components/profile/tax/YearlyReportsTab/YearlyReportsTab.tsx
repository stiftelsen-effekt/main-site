import { useAuth0, User } from "@auth0/auth0-react";
import { useState } from "react";
import { TaxUnit, TaxYearlyReport } from "../../../../models";
import { useTaxUnits, useYearlyTaxReports } from "../../../../_queries";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import { Spinner } from "../../../shared/components/Spinner/Spinner";
import { TaxUnitList } from "../../shared/lists/taxUnitList/TaxUnitList";
import { TaxUnitMobileList } from "../../shared/lists/taxUnitList/TaxUnitMobileList";
import { TaxYearlyReportList } from "../../shared/lists/taxYearlyReportsList/TaxYearlyReportList";
import { TaxUnitCreateModal } from "../../shared/TaxUnitModal/TaxUnitCreateModal";
import styles from "./YearlyReportsTab.module.scss";

export const YearlyReportsTab: React.FC = () => {
  const { getAccessTokenSilently, user } = useAuth0();

  const { loading, isValidating, data, error } = useYearlyTaxReports(
    user as User,
    getAccessTokenSilently,
  );

  return (
    <div className={styles.container}>
      <h4 className={styles.header}>Dine årsoppgaver</h4>
      {!loading && !error && data ? (
        data.map((report: TaxYearlyReport) => (
          <TaxYearlyReportList key={report.year} report={report} />
        ))
      ) : (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spinner />
        </div>
      )}
    </div>
  );
};
