import { TaxUnit, TaxYearlyReportUnits } from "../../../../../models";
import { thousandize } from "../../../../../util/formatting";
import style from "./TaxYearlyReportDesktopDetails.module.scss";

export const TaxYearlyReportDesktopDetails: React.FC<{
  channels: { channel: string; sumDonations: number }[];
  unit?: TaxYearlyReportUnits;
}> = ({ channels, unit }) => {
  return (
    <table className={style.table} cellSpacing="0">
      <tbody>
        {channels.map((channel) => (
          <tr key={channel.channel + "-" + (unit ? unit.id : "missing")}>
            <td>{"Gitt gjennom " + channel.channel}</td>
            <td>{thousandize(channel.sumDonations)} kr</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
