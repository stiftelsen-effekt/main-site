import React, { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { Donation, GiveWellGrant } from "../../../../models";
import { thousandize } from "../../../../util/formatting";
import style from "./DonationImpact.module.scss";
import { DonationImpactItem } from "./DonationImpactItem";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const DonationImpact: React.FC<{
  donation: Donation;
  distribution: { org: string; sum: number }[];
  timestamp: Date;
}> = ({ donation, distribution, timestamp }) => {
  const { data, error, isValidating } = useSWR<{ max_impact_fund_grants: GiveWellGrant[] }>(
    `https://impact.gieffektivt.no/api/max_impact_fund_grants?currency=NOK&language=NO&donation_year=${timestamp.getFullYear()}&donation_month=${
      timestamp.getMonth() + 1
    }`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const [requiredPrecision, setRequiredPrecision] = useState(0);

  if (!data || isValidating) {
    return <div key={`${donation.id}`}>Loading...</div>;
  }
  if (error) {
    return <div key={`${donation.id}`}>{error}</div>;
  }

  /**
   * If the donation has a component to the maximum impact fund, we must find the relevant grant
   * and distribute the part of the donation to GiveWell to the distribution
   */
  const giveWellDist = distribution.find((d) => d.org === "GiveWell");
  const filteredDistribution = distribution
    .filter((d) => d.org !== "GiveWell")
    .map((o) => ({ ...o }));
  let spreadDistribution: { org: string; sum: number }[] = [...filteredDistribution];
  const log: string[] = [];
  if (giveWellDist) {
    const relevantGrant = data?.max_impact_fund_grants[0];

    if (!relevantGrant) {
      return <div key={`${donation.id}`}>Could not find relevant maximum impact grant</div>;
    }

    const grantTotal = relevantGrant.allotment_set.reduce((acc, grant) => {
      return acc + grant.sum_in_cents;
    }, 0);

    relevantGrant.allotment_set.forEach((allotment) => {
      const org = allotment.charity.abbreviation;
      const sum = Math.round((allotment.sum_in_cents / grantTotal) * giveWellDist.sum);
      const orgIndex = spreadDistribution.findIndex((d) => d.org === org);
      if (orgIndex !== -1) {
        log.push(`Adding ${sum} to ${org}`);
        spreadDistribution[orgIndex].sum += sum;
      } else {
        log.push(`Pushing ${sum} to ${org}`);
        spreadDistribution.push({ org, sum });
      }
    });
  }

  return (
    <div className={style.container} key={`${donation.id}`}>
      {giveWellDist && (
        <div className={style.smartdistributionlabel}>
          <span>Smart fordeling</span>
          <strong>{`${thousandize(giveWellDist.sum || null)} kr`}</strong>
        </div>
      )}
      <table className={style.wrapper} cellSpacing={0} data-cy="donation-impact-list">
        <tbody>
          {spreadDistribution.map((dist, i) => (
            <>
              {dist.org !== "Drift" && (
                <DonationImpactItem
                  orgAbriv={dist.org}
                  sumToOrg={dist.sum}
                  donationTimestamp={timestamp}
                  precision={requiredPrecision}
                  signalRequiredPrecision={(precision) => {
                    precision > requiredPrecision ? setRequiredPrecision(precision) : null;
                  }}
                />
              )}
              {dist.org === "Drift" && (
                <tr key={`${donation.id}-drift`}>
                  <td className={style.impact} colSpan={100}>
                    <span>Drift av Gi Effektivt</span>
                    <strong>{`${dist.sum} kr`}</strong>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationImpact;
