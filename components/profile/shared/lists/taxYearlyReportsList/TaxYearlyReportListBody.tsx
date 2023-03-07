import { useState } from "react";
import { HelpCircle, Info } from "react-feather";
import { TaxYearlyReport } from "../../../../../models";
import { thousandize } from "../../../../../util/formatting";
import { Lightbox } from "../../../../shared/components/Lightbox/Lightbox";
import style from "./TaxYearlyReportListBody.module.scss";

export const TaxYearlyReportListBody: React.FC<{ report: TaxYearlyReport }> = ({ report }) => {
  const [nonDeductibleInfoOpen, setNonDeductibleInfoOpen] = useState(false);

  if (report.sumDonations == 0) return null;
  return (
    <>
      <table className={style.summaryTable} data-cy="yearly-tax-report-summary-table">
        <thead>
          <tr>
            <th colSpan={2}>Donasjoner som kvalifiserer til skattefradrag</th>
          </tr>
        </thead>
        <tbody>
          {report.units
            .reduce<{ channel: string; sumDonations: number }[]>((acc, unit) => {
              // Loop over channels in the unit
              // If the channel is not in the accumulator, add it
              // If the channel is in the accumulator, add the sumDonations to the accumulator
              unit.channels.forEach((channel) => {
                const channelInAcc = acc.find((c) => c.channel === channel.channel);
                if (channelInAcc) {
                  channelInAcc.sumDonations += channel.sumDonations;
                } else {
                  acc.push({ ...channel });
                }
              });
              return acc;
            }, [])
            .map((channel) => (
              <tr key={channel.channel}>
                <td>Gitt gjennom {channel.channel}</td>
                <td>{thousandize(channel.sumDonations)} kr</td>
              </tr>
            ))}
          <tr>
            <td>Totalt</td>
            {/** Should be sum donations */}
            <td>{thousandize(report.sumDonations)} kr</td>
          </tr>
        </tbody>
      </table>

      {report.sumNonDeductibleDonationsByType.reduce(
        (acc, n) => acc + n.sumNonDeductibleDonations,
        0,
      ) > 0 && (
        <>
          <Lightbox open={nonDeductibleInfoOpen} onConfirm={() => setNonDeductibleInfoOpen(false)}>
            <div className={style.nonDeductibleInfo}>
              <p>
                <strong>Cryptodonasjoner</strong> kvalifiserer ikke til skattefradrag.
              </p>
              <p>
                <strong>Donasjoner uten skatteenhet</strong> kvalifiserer ikke til skattefradrag. Om
                du ikke har noen registrerte skatteenheter kan du registrere en til venstre i menyen
                under &quot;skatt&quot; og vi vil knytte donasjonene for i år til denne enheten. Har
                du allerede en eller flere enheter, ta kontakt på{" "}
                <a href="mailto:donasjon@gieffektivt.no">donasjon@gieffektivt.no</a> slik at vi kan
                knytte rett donasjon til rett skatteenhet.
              </p>
              <p>
                <strong>Donasjoner gitt til Stiftelsen Effekt</strong> direkte kvalifiserer ikke til
                skattefradrag, da stiftelsen ikke er skattefradragsgodkjent.
              </p>
            </div>
          </Lightbox>
          <table
            className={style.nonDeductibleDonationsTable}
            data-cy="yearly-tax-report-non-deductable-table"
          >
            <thead>
              <tr>
                <th colSpan={2}>
                  <div className={style.cellContent}>
                    Donasjoner som ikke er fradragsgodkjente{" "}
                    <HelpCircle
                      size={"1rem"}
                      onClick={() => setNonDeductibleInfoOpen(true)}
                      data-cy="tax-report-tooltip-icon"
                    ></HelpCircle>
                  </div>
                </th>
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
          <div className={style.mobileOrgInfo}>
            <strong>Effektiv Altruisme Norge</strong>
            <span> Org.nr 919 809 140</span>
          </div>
        </>
      )}
    </>
  );
};
