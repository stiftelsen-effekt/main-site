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
import { TaxYearlyReportListBody } from "./TaxYearlyReportListBody";
import { TaxYearlyReportListSupplemental } from "./TaxYearlyReportListSupplemental";

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
          value: "Mangler",
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
      { value: thousandize(Math.round(parseFloat(unit.sumDonations))) + " kr" },
    ],
    element: unit,
  }));

  const rows: ListRow<TaxYearlyReportUnits | TaxYearlyReportMissingTaxUnitDonations>[] = [
    ...rowsUnits,
    ...rowsMissingTaxUnits,
  ];

  const emptyPlaceholder = <div>EMPTY PLACEHOLDER</div>;

  return (
    <GenericList
      title={report.year.toString()}
      headers={headers}
      rows={rows}
      emptyPlaceholder={emptyPlaceholder}
      expandable={false}
      supplementalInformation={
        <TaxYearlyReportListSupplemental
          report={report}
          donations={donations}
          distribtionMap={distribtionMap}
        />
      }
      proportions={[30, 60]}
    >
      <TaxYearlyReportListBody report={report} />
    </GenericList>
  );
};
