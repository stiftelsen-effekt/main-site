import {
  Distribution,
  Donation,
  TaxYearlyReport,
  TaxYearlyReportUnits,
} from "../../../../../models";
import { thousandize } from "../../../../../util/formatting";
import { GenericList } from "../GenericList";
import { ListRow } from "../GenericListRow";
import { TaxYearlyReportMobileDetails } from "./TaxYearlyReportMobileDetails";
import style from "./TaxYearlyReportList.module.scss";
import DonationsDistributionTable from "../../../donations/DonationsDistributionTable/DonationsDistributionTable";
import { FileText } from "react-feather";
import { TaxYearlyReportListBody } from "./TaxYearlyReportListBody";
import { TaxYearlyReportListSupplemental } from "./TaxYearlyReportListSupplemental";

export const TaxYearlyReportMobileList: React.FC<{
  report: TaxYearlyReport;
  donations: Donation[];
  distribtionMap: Map<string, Distribution>;
}> = ({ report, donations, distribtionMap }) => {
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
    ],
    details: <TaxYearlyReportMobileDetails channels={report.sumDonationsWithoutTaxUnit.channels} />,
    element: report.sumDonationsWithoutTaxUnit,
  };

  const rowsUnits = report.units.map((unit) => ({
    id: unit.id.toString(),
    defaultExpanded: false,
    cells: [{ value: unit.name }],
    details: <TaxYearlyReportMobileDetails channels={unit.channels} unit={unit} />,
    element: unit,
  }));

  const rows: ListRow<TaxYearlyReportUnits | any>[] = [...rowsUnits, rowMissingTaxUnits];

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
