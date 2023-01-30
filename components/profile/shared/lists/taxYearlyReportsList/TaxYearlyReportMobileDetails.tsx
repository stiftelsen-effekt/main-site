import {
  TaxUnit,
  TaxYearlyReportMissingTaxUnitDonations,
  TaxYearlyReportUnits,
} from "../../../../../models";
import { thousandize } from "../../../../../util/formatting";
import style from "./TaxYearlyReportMobileDetails.module.scss";

export const TaxYearlyReportMobileDetails: React.FC<{
  unit: TaxYearlyReportUnits | TaxYearlyReportMissingTaxUnitDonations;
}> = ({ unit }) => {
  return (
    <table className={style.table} cellSpacing="0">
      <tbody>
        {"sumDonations" in unit && "taxDeduction" in unit && "ssn" in unit && (
          <>
            <tr>
              <td>Identifikator</td>
              <td>{unit.ssn}</td>
            </tr>
            <tr>
              <td>Gitt gjennom</td>
              <td>{unit.channel}</td>
            </tr>
            <tr>
              <td>Sum donasjoner</td>
              <td>{thousandize(Math.round(parseFloat(unit.sumDonations)))} kr</td>
            </tr>
            <tr>
              <td>Sum skattefradrag</td>
              <td>{thousandize(Math.round(unit.taxDeduction))} kr</td>
            </tr>
          </>
        )}
        {"sumDonationsWithoutTaxUnit" in unit && (
          <>
            <tr>
              <td>Identifikator</td>
              <td>Mangler</td>
            </tr>
            <tr>
              <td>Gitt gjennom</td>
              <td>{unit.channel}</td>
            </tr>
            <tr>
              <td>Sum donasjoner</td>
              <td>{thousandize(Math.round(unit.sumDonationsWithoutTaxUnit))} kr</td>
            </tr>
          </>
        )}
      </tbody>
    </table>
  );
};
