import { TaxUnit } from "../../../../../models";
import { thousandize } from "../../../../../util/formatting";
import style from "./TaxUnitMobileDetails.module.scss";

export const TaxUnitMobileDetails: React.FC<{
  taxUnit: TaxUnit;
  numberOfDonationsLabel: string;
  sumDonationsLabel: string;
  sumTaxDeductionsLabel: string;
}> = ({ taxUnit, numberOfDonationsLabel, sumDonationsLabel, sumTaxDeductionsLabel }) => {
  return (
    <table className={style.table} cellSpacing="0">
      <tbody>
        <tr>
          <td>{numberOfDonationsLabel}</td>
          <td>{thousandize(Math.round(taxUnit.numDonations))}</td>
        </tr>
        <tr>
          <td>{sumDonationsLabel}</td>
          <td>{thousandize(Math.round(taxUnit.sumDonations))} kr</td>
        </tr>
        <tr>
          <td>{sumTaxDeductionsLabel}</td>
          <td>
            {thousandize(
              Math.round(
                taxUnit.taxDeductions
                  ? taxUnit.taxDeductions.reduce(
                      (acc: number, deduction) => acc + deduction.deduction,
                      0,
                    )
                  : 0,
              ),
            )}{" "}
            kr
          </td>
        </tr>
      </tbody>
    </table>
  );
};
