import {
  Distribution,
  Donation,
  TaxYearlyReport,
  TaxYearlyReportUnits,
} from "../../../../../models";
import { GenericList } from "../GenericList";
import { ListRow } from "../GenericListRow";
import { TaxYearlyReportMobileDetails } from "./TaxYearlyReportMobileDetails";
import { TaxYearlyReportListBody } from "./TaxYearlyReportListBody";
import { TaxYearlyReportListSupplemental } from "./TaxYearlyReportListSupplemental";
import { AggregatedImpactTableConfiguration } from "../../../donations/DonationsAggregateImpactTable/DonationsAggregateImpactTable";

export const TaxYearlyReportMobileList: React.FC<{
  report: TaxYearlyReport;
  donations: Donation[];
  distribtionMap: Map<string, Distribution>;
  aggregateImpactConfig: AggregatedImpactTableConfiguration;
}> = ({ report, donations, distribtionMap, aggregateImpactConfig }) => {
  const rowMissingTaxUnits = {
    id: "missingTaxUnits",
    defaultExpanded: false,
    cells: [
      {
        value: "Mangler enhet",
        tooltip: `Du har donasjoner for skatteåret som kvalifiserer til skattefradrag, men mangler skatteenhet. Vi har rapportert alle donasjoner for 2022 til skattemyndighetene, men i 2023 vil du få skattefradrag på donasjoner du knytter til en skatteenhet.`,
      },
    ],
    details: (
      <TaxYearlyReportMobileDetails
        channels={report.sumDonationsWithoutTaxUnit.channels.filter((c) => c.sumDonations > 0)}
      />
    ),
    element: report.sumDonationsWithoutTaxUnit,
  };

  const rowsUnits = report.units.map((unit) => ({
    id: unit.id.toString(),
    defaultExpanded: false,
    cells: [{ value: unit.name }],
    details: <TaxYearlyReportMobileDetails channels={unit.channels} unit={unit} />,
    element: unit,
  }));

  const rows: ListRow<TaxYearlyReportUnits | any>[] = [...rowsUnits];

  if (report.sumDonationsWithoutTaxUnit.sumDonations > 0) {
    rows.push(rowMissingTaxUnits);
  }

  const emptyPlaceholder = (
    <div>
      <div>Det mangler informasjon for skatteenheten.</div>
      <div>
        Ta kontakt på <a href={"mailto: donasjon@gieffektivt.no"}>donasjon@gieffektivt.no</a>.
      </div>
    </div>
  );

  return (
    <>
      <GenericList
        title={""}
        headers={[]}
        rows={rows}
        emptyPlaceholder={emptyPlaceholder}
        expandable={true}
        proportions={[30, 60]}
        supplementalInformation={
          <TaxYearlyReportListSupplemental
            report={report}
            donations={donations}
            distribtionMap={distribtionMap}
            aggregateImpactConfig={aggregateImpactConfig}
          />
        }
        supplementalOnMobile={true}
        linedRows={true}
      >
        <TaxYearlyReportListBody report={report} />
      </GenericList>
    </>
  );
};
