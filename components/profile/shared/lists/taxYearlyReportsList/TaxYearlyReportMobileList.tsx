import {
  Distribution,
  Donation,
  TaxYearlyReport,
  TaxYearlyReportMissingTaxUnitDonations,
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
  const headers = [
    {
      label: "Navn",
    },
    {
      label: "Identifikator",
    },
  ];

  const rowsMissingTaxUnits = report.sumDonationsWithoutTaxUnitByChannel
    .filter((missing) => missing.sumDonationsWithoutTaxUnit > 0)
    .map((missing: TaxYearlyReportMissingTaxUnitDonations) => ({
      id: missing.channel,
      defaultExpanded: false,
      cells: [
        {
          value: "Mangler skatteenhet",
          tooltip: `Mangler skatteenhet. ${
            report.units.length == 0
              ? "Registrer en skatteenhet i fanen til venstre i menyen og alle donasjoner vil knyttes til den."
              : "Du har allerede en eller flere skatteenheter, kontakt oss på donasjon@gieffektivt.no for å knytte donasjonene dine til rett skatteenhet."
          }`,
        },
      ],
      details: <TaxYearlyReportMobileDetails unit={missing} />,
      element: missing,
    }));

  const rowsUnits = report.units.map((unit) => ({
    id: unit.id + unit.channel,
    defaultExpanded: false,
    cells: [{ value: unit.name }],
    details: <TaxYearlyReportMobileDetails unit={unit} />,
    element: unit,
  }));

  const rows: ListRow<TaxYearlyReportUnits | TaxYearlyReportMissingTaxUnitDonations>[] = [
    ...rowsUnits,
    ...rowsMissingTaxUnits,
  ];

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
      >
        <TaxYearlyReportListBody report={report} />
      </GenericList>
    </>
  );
};
