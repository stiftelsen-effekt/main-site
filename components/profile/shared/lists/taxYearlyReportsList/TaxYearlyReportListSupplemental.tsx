import { FileText } from "react-feather";
import { Distribution, Donation, TaxYearlyReport } from "../../../../../models";
import { thousandize } from "../../../../../util/formatting";

import style from "./TaxYearlyReportListSupplemental.module.scss";
import {
  AggregatedImpactTableConfiguration,
  DonationsAggregateImpactTable,
} from "../../../donations/DonationsAggregateImpactTable/DonationsAggregateImpactTable";

export const TaxYearlyReportListSupplemental: React.FC<{
  report: TaxYearlyReport;
  donations: Donation[];
  distribtionMap: Map<string, Distribution>;
  aggregateImpactConfig: AggregatedImpactTableConfiguration;
}> = ({ report, donations, distribtionMap, aggregateImpactConfig: aggregateImpactTexts }) => {
  if (report.sumDonations == 0) return null;
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
        <DonationsAggregateImpactTable
          donations={donations}
          distributionMap={distribtionMap}
          configuration={aggregateImpactTexts}
          defaultExpanded={false}
        ></DonationsAggregateImpactTable>
      </div>
      <div className={style.summation}>
        <h3 data-cy="yearly-tax-report-sum">
          {thousandize(report.units.reduce((acc, u) => acc + u.sumDonations, 0))} kr
        </h3>
        <span>Totalt sum donert i {report.year} som er skattefradragsgodkjent</span>
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
