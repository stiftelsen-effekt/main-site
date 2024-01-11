import { FileText } from "react-feather";
import {
  Distribution,
  Donation,
  TaxYearlyReport,
  TaxYearlyReportUnits,
} from "../../../../../models";
import { thousandize } from "../../../../../util/formatting";
import { GenericList } from "../GenericList";
import { ListRow } from "../GenericListRow";
import { TaxYearlyReportDesktopDetails } from "./TaxYearlyReportDesktopDetails";
import style from "./TaxYearlyReportList.module.scss";
import { TaxYearlyReportListBody } from "./TaxYearlyReportListBody";
import { TaxYearlyReportListSupplemental } from "./TaxYearlyReportListSupplemental";
import { AggregatedImpactTableConfiguration } from "../../../donations/DonationsAggregateImpactTable/DonationsAggregateImpactTable";

export const TaxYearlyReportList: React.FC<{
  report: TaxYearlyReport;
  donations: Donation[];
  distribtionMap: Map<string, Distribution>;
  aggregateImpactConfig: AggregatedImpactTableConfiguration;
}> = ({ report, donations, distribtionMap, aggregateImpactConfig }) => {
  const headers = [
    { label: "Skatteenhet", width: "25%" },
    { label: "Enhetsnummer", width: "25%" },
    { label: "Skattefradrag", width: "25%" },
    { label: "Sum donasjoner", width: "25%", align: "right" as "right" },
  ];

  const currentYear = new Date().getFullYear();

  const rowMissingTaxUnits = {
    id: "missingTaxUnits",
    defaultExpanded: false,
    cells: [
      {
        value: report.year === currentYear - 1 ? "Mangler enhet" : "Manglet enhet",
        tooltip:
          report.year === currentYear - 1
            ? `Du har donasjoner for skatteåret som kvalifiserer til skattefradrag, men mangler skatteenhet. Vi har rapportert alle donasjoner for ${
                currentYear - 1
              } til skattemyndighetene, men i ${currentYear} vil du få skattefradrag på donasjoner du knytter til en skatteenhet.`
            : undefined,
      },
      { value: "-" },
      { value: "-" },
      {
        value: thousandize(Math.round(report.sumDonationsWithoutTaxUnit.sumDonations)) + " kr",
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

  const emptyPlaceholder = (
    <div>
      Vi har ikke registrert noen donasjoner på deg i 2022. Om dette ikke stemmer ta kontakt med oss
      på donasjon@gieffektivt.no.
    </div>
  );

  return (
    <div className={style.wrapper}>
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
            aggregateImpactConfig={aggregateImpactConfig}
          />
        }
        proportions={[30, 60]}
      >
        <TaxYearlyReportListBody report={report} />
      </GenericList>
    </div>
  );
};
