import { FileText } from "react-feather";
import {
  Distribution,
  Donation,
  TaxYearlyReport,
  TaxYearlyReportUnits,
} from "../../../../../models";
import { thousandize } from "../../../../../util/formatting";
import DonationsDistributionTable from "../../../donations/DonationsDistributionTable/DonationsDistributionTable";
import { GenericList } from "../GenericList";
import { ListRow } from "../GenericListRow";
import { TaxYearlyReportDesktopDetails } from "./TaxYearlyReportDesktopDetails";
import style from "./TaxYearlyReportList.module.scss";
import { TaxYearlyReportListBody } from "./TaxYearlyReportListBody";
import { TaxYearlyReportListSupplemental } from "./TaxYearlyReportListSupplemental";

export const TaxYearlyReportList: React.FC<{
  report: TaxYearlyReport;
  donations: Donation[];
  distribtionMap: Map<string, Distribution>;
}> = ({ report, donations, distribtionMap }) => {
  const headers = [
    { label: "Skatteenhet", width: "25%" },
    { label: "Enhetsnummer", width: "25%" },
    { label: "Skattefradrag", width: "25%" },
    { label: "Sum donasjoner", width: "25%", align: "right" as "right" },
  ];

  const rowMissingTaxUnits = {
    id: "missingTaxUnits",
    defaultExpanded: false,
    cells: [
      {
        value: "Mangler enhet",
        tooltip: `Du har donasjoner for skatteåret som kvalifiserer til skattefradrag, men mangler skatteenhet. ${
          report.units.length == 0
            ? 'Registrer en skatteenhet i fanen til venstre i menyen under "skatt" og alle donasjoner vil knyttes til den. Ta kontakt på donasjon@gieffektivt.no om du ønsker å knytte donasjonene dine til flere skatteenheter.'
            : "Du har allerede en eller flere skatteenheter, kontakt oss på donasjon@gieffektivt.no for å knytte donasjonene dine til rett skatteenhet."
        }`,
      },
      { value: "-" },
      { value: "-" },
      {
        value: thousandize(Math.round(report.sumDonationsWithoutTaxUnit.sumDonations)) + "kr",
        align: "right" as "right",
      },
    ],
    details: (
      <TaxYearlyReportDesktopDetails
        channels={report.sumDonationsWithoutTaxUnit.channels.filter((c) => c.sumDonations > 0)}
      />
    ),
    element: report.sumDonationsWithoutTaxUnit,
  };

  const rowsUnits = report.units.map((unit) => ({
    id: unit.id.toString(),
    defaultExpanded: false,
    cells: [
      { value: unit.name },
      { value: unit.ssn },
      { value: thousandize(Math.round(unit.taxDeduction)) + " kr" },
      { value: thousandize(Math.round(unit.sumDonations)) + " kr", align: "right" as "right" },
    ],
    details: <TaxYearlyReportDesktopDetails channels={unit.channels} unit={unit} />,
    element: unit,
  }));

  const rows: ListRow<TaxYearlyReportUnits | any>[] = [...rowsUnits];

  if (report.sumDonationsWithoutTaxUnit.sumDonations > 0) {
    rows.push(rowMissingTaxUnits);
  }

  const emptyPlaceholder = <div>EMPTY PLACEHOLDER</div>;

  return (
    <GenericList
      title={report.year.toString()}
      headers={headers}
      rows={rows}
      emptyPlaceholder={emptyPlaceholder}
      expandable={true}
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
