import { TaxYearlyReportUnits } from "../../../../../models";
import { thousandize } from "../../../../../util/formatting";
import style from "./TaxYearlyReportMobileDetails.module.scss";

export const TaxYearlyReportMobileDetails: React.FC<{
  channels: { channel: string; sumDonations: number }[];
  unit?: TaxYearlyReportUnits;
}> = ({ channels, unit }) => {
  let noUnitSum = 0;
  if (!unit) {
    channels.forEach((channel) => {
      noUnitSum += channel.sumDonations;
    });
  }

  return (
    <table className={style.table} cellSpacing="0">
      <tbody>
        <tr>
          <td>Identifikator</td>
          <td>{unit ? unit.ssn : "-"}</td>
        </tr>
        {channels.map((channel) => (
          <tr key={channel.channel + "-" + (unit ? unit.id : "missing")}>
            <td>{"Gitt gjennom " + channel.channel}</td>
            <td>{thousandize(channel.sumDonations)} kr</td>
          </tr>
        ))}
        <tr>
          <td>Sum donasjoner</td>
          <td>{thousandize(unit ? unit.sumDonations : noUnitSum)} kr</td>
        </tr>
        <tr>
          <td>Skattefradrag</td>
          <td>{unit ? thousandize(unit.taxDeduction) + " kr" : "-"} </td>
        </tr>
      </tbody>
    </table>
  );
};
