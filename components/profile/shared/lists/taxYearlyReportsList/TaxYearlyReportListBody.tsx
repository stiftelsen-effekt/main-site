import { TaxYearlyReport } from "../../../../../models";
import { thousandize } from "../../../../../util/formatting";
import style from "./TaxYearlyReportListBody.module.scss";

export const TaxYearlyReportListBody: React.FC<{ report: TaxYearlyReport }> = ({ report }) => {
  return (
    <>
      <table className={style.summaryTable}>
        <tbody>
          {report.sumTaxDeductionsByChannel.map((channel) => (
            <tr key={channel.channel}>
              <td>{channel.channel}</td>
              <td>{thousandize(channel.sumTaxDeductions)} kr</td>
            </tr>
          ))}
          <tr>
            <td>Totalt</td>
            <td>{thousandize(report.sumTaxDeductions)} kr</td>
          </tr>
        </tbody>
      </table>

      {report.sumNonDeductibleDonationsByType.length > 0 && (
        <table className={style.nonDeductibleDonationsTable}>
          <thead>
            <tr>
              <th colSpan={2}>Donasjoner som ikke er fradragsgodkjente</th>
            </tr>
          </thead>
          <tbody>
            {report.sumNonDeductibleDonationsByType.map((nondeductible) => (
              <tr key={nondeductible.type}>
                <td>{nondeductible.type}</td>
                <td>{thousandize(nondeductible.sumNonDeductibleDonations)} kr</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};
