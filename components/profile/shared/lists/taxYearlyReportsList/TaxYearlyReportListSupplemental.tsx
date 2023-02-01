import { FileText } from "react-feather";
import { Distribution, Donation, TaxYearlyReport } from "../../../../../models";
import { thousandize } from "../../../../../util/formatting";
import DonationsDistributionTable from "../../../donations/DonationsDistributionTable/DonationsDistributionTable";

import style from "./TaxYearlyReportListSupplemental.module.scss";

export const TaxYearlyReportListSupplemental: React.FC<{
  report: TaxYearlyReport;
  donations: Donation[];
  distribtionMap: Map<string, Distribution>;
}> = ({ report, donations, distribtionMap }) => {
  return (
    <>
      <div className={style.header}>
        <h2>{report.year}</h2>
        <div className={style.printLink} onClick={() => window.print()}>
          <FileText size={"1rem"} />
          <span>Skriv ut</span>
        </div>
      </div>
      <div className={style.impactWrapper}>
        <DonationsDistributionTable
          donations={donations}
          distributionMap={distribtionMap}
          defaultExpanded={false}
        ></DonationsDistributionTable>
      </div>
      <div className={style.summation}>
        <h3>{thousandize(report.sumTaxDeductions)} kr</h3>
        <span>Totalt sum donert i 2022 som er skattefradragsgodkjent</span>
      </div>
      <div className={style.taxMessageInfo}>
        <span>
          Beløpet vil være registrert i skattemeldingen når du får den (Gave og arv → Gave til
          frivillige organisasjoner).
        </span>
      </div>
      <div className={style.orgInfo}>
        <strong>Effektiv Altruisme Norge</strong>
        <span> Org.nr 919 809 140</span>
      </div>
      <div className={style.mobileListHeader}>
        <i>Skattenheter</i>
      </div>
    </>
  );
};
