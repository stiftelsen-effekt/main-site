import { FileText } from "react-feather";
import {
  Distribution,
  Donation,
  TaxYearlyReport,
  TaxYearlyReportUnits,
} from "../../../../../models";
import { thousandize } from "../../../../../util/formatting";
import DonationsDistributionTable from "../../../donations/DonationsDistributionTable/DonationsDistributionTable";
import { GenericList, ListRow } from "../GenericList";
import style from "./TaxYearlyReportList.module.scss";

export const TaxYearlyReportList: React.FC<{
  report: TaxYearlyReport;
  donations: Donation[];
  distribtionMap: Map<string, Distribution>;
}> = ({ report, donations, distribtionMap }) => {
  const headers = [
    { label: "Skatteenhet", width: "20%" },
    { label: "Enhetsnummer", width: "20%" },
    { label: "Gitt gjennom", width: "20%" },
    { label: "Skattefradrag", width: "20%" },
    { label: "Sum donasjoner", width: "20%" },
  ];

  const rows: ListRow<TaxYearlyReportUnits>[] = report.units.map((unit) => ({
    id: unit.id + unit.channel,
    defaultExpanded: false,
    cells: [
      unit.name,
      unit.ssn,
      unit.channel,
      thousandize(Math.round(unit.taxDeduction)) + " kr",
      thousandize(Math.round(unit.sumDonations)) + " kr",
    ],
    element: unit,
  }));

  const emptyPlaceholder = <div>EMPTY PLACEHOLDER</div>;

  const supplementalInformation = (
    <>
      <div className={style.printLink} onClick={() => window.print()}>
        <FileText size={"1rem"} />
        <span>Skriv ut</span>
      </div>
      <div className={style.impactWrapper}>
        <DonationsDistributionTable
          donations={donations}
          distributionMap={distribtionMap}
        ></DonationsDistributionTable>
      </div>
      <div className={style.summation}>
        <h3>{thousandize(report.sumTaxDeductions)} kr</h3>
        <span>Totalt sum donert i 2022 som er skattefradragsgodkjent</span>
      </div>
    </>
  );

  return (
    <GenericList
      title={report.year.toString()}
      headers={headers}
      rows={rows}
      emptyPlaceholder={emptyPlaceholder}
      expandable={false}
      supplementalInformation={supplementalInformation}
      proportions={[30, 60]}
    >
      <table className={style.summaryTable}>
        <tbody>
          {report.sumTaxDeductionsByChannel.map((channel) => (
            <tr key={channel.channel}>
              <td>{channel.channel}</td>
              <td>{thousandize(channel.sumTaxDeductions)} kr</td>
            </tr>
          ))}
          <tr>
            <td>Totalt</td>
            <td>{thousandize(report.sumTaxDeductions)} kr</td>
          </tr>
        </tbody>
      </table>
    </GenericList>
  );
};
