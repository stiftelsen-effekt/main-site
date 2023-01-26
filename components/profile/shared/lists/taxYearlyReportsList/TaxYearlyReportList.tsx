import { FileText } from "react-feather";
import {
  Distribution,
  Donation,
  TaxYearlyReport,
  TaxYearlyReportMissingTaxUnitDonations,
  TaxYearlyReportUnits,
} from "../../../../../models";
import { thousandize } from "../../../../../util/formatting";
import DonationsDistributionTable from "../../../donations/DonationsDistributionTable/DonationsDistributionTable";
import { GenericList } from "../GenericList";
import { ListRow } from "../GenericListRow";
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

  const rowsMissingTaxUnits = report.sumDonationsWithoutTaxUnitByChannel
    .filter((missing) => missing.sumDonationsWithoutTaxUnit > 0)
    .map((missing: TaxYearlyReportMissingTaxUnitDonations) => ({
      id: missing.channel,
      defaultExpanded: false,
      cells: [
        {
          value: "",
          tooltip: `Mangler skatteenhet. ${
            report.units.length == 0
              ? "Registrer en skatteenhet i fanen til venstre i menyen og alle donasjoner vil knyttes til den."
              : "Du har allerede en eller flere skatteenheter, kontakt oss på donasjon@gieffektivt.no for å knytte donasjonene dine til rett skatteenhet."
          }`,
        },
        { value: "-" },
        { value: missing.channel },
        { value: "-" },
        { value: thousandize(Math.round(missing.sumDonationsWithoutTaxUnit)) + " kr" },
      ],
      element: missing,
    }));

  const rowsUnits = report.units.map((unit) => ({
    id: unit.id + unit.channel,
    defaultExpanded: false,
    cells: [
      { value: unit.name },
      { value: unit.ssn },
      { value: unit.channel },
      { value: thousandize(Math.round(unit.taxDeduction)) + " kr" },
      { value: thousandize(Math.round(unit.sumDonations)) + " kr" },
    ],
    element: unit,
  }));

  const rows: ListRow<TaxYearlyReportUnits | TaxYearlyReportMissingTaxUnitDonations>[] = [
    ...rowsMissingTaxUnits,
    ...rowsUnits,
  ];

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
      <>
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

        {report.sumNonDeductibleDonationsByType.length > 0 && (
          <table className={style.nonDeductibleDonationsTable}>
            <thead>
              <tr>
                <th colSpan={2}>Donasjoner som ikke er fradragsgodkjente</th>
              </tr>
            </thead>
            <tbody>
              {report.sumNonDeductibleDonationsByType.map((nondeductible) => (
                <tr key={nondeductible.type}>
                  <td>{nondeductible.type}</td>
                  <td>{thousandize(nondeductible.sumNonDeductibleDonations)} kr</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>
    </GenericList>
  );
};
