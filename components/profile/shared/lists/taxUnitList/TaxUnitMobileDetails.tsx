import { TaxUnit } from "../../../../../models";
import { thousandize } from "../../../../../util/formatting";
import style from "./TaxUnitMobileDetails.module.scss";

export const TaxUnitMobileDetails: React.FC<{ taxUnit: TaxUnit }> = ({ taxUnit }) => {
  return (
    <table className={style.table} cellSpacing="0">
      <tbody>
        <tr>
          <td>Antall donasjoner</td>
          <td>{thousandize(Math.round(taxUnit.numDonations))}</td>
        </tr>
        <tr>
          <td>Sum donasjoner</td>
          <td>{thousandize(Math.round(taxUnit.sumDonations))} kr</td>
        </tr>
        <tr>
          <td>Sum skattefradrag</td>
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
