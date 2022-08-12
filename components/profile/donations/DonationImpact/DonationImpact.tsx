import React from "react";
import useSWR from "swr";
import { GiveWellGrant } from "../../../../models";
import style from "./DonationImpact.module.scss";
import { DonationImpactItem } from "./DonationImpactItem";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const DonationImpact: React.FC<{
  distribution: { org: string; sum: number }[];
  timestamp: Date;
}> = ({ distribution, timestamp }) => {
  const { data, error, isValidating } = useSWR<{ max_impact_fund_grants: GiveWellGrant[] }>(
    `https://impact.gieffektivt.no/api/max_impact_fund_grants?currency=NOK&language=NO`,
    fetcher,
  );

  if (!data || isValidating) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  /**
   * If the donation has a component to the maximum impact fund, we must find the relevant grant
   * and distribute the part of the donation to GiveWell to the distribution
   */
  const giveWellDist = distribution.find((d) => d.org === "GiveWell");
  if (giveWellDist) {
    /**
     * Sort grants by start time
     * Then return the first grant that has a start year and month less than or equal to the donation
     * This will be the relevant grant to calculate the impact
     */
    const relevantGrant = data?.max_impact_fund_grants
      .sort((a, b) => {
        return +new Date(b.start_year, b.start_month) - +new Date(a.start_year, a.start_month);
      })
      .find(
        (g) =>
          g.start_year < timestamp.getFullYear() ||
          (timestamp.getFullYear() === g.start_year && g.start_month <= timestamp.getMonth() + 1),
      );

    console.log(relevantGrant);

    if (relevantGrant) {
      const grantTotal = relevantGrant.allotment_set.reduce((acc, grant) => {
        return acc + grant.sum_in_cents;
      }, 0);

      relevantGrant.allotment_set.forEach((allotment) => {
        const org = allotment.charity.abbreviation;
        const sum = Math.round((allotment.sum_in_cents / grantTotal) * giveWellDist.sum);
        const orgIndex = distribution.findIndex((d) => d.org === org);
        if (orgIndex !== -1) {
          distribution[orgIndex].sum += sum;
        } else {
          distribution.push({ org, sum });
        }
      });
    }
  }
  // Finally, filter out GiveWell from the distribution
  const filteredDistribution = distribution.filter((d) => d.org !== "GiveWell");

  return (
    <div className={style.wrapper}>
      {filteredDistribution.map((dist, i) => (
        <div className={style.impact} key={dist.org}>
          {dist.org !== "Drift" && (
            <DonationImpactItem
              orgAbriv={dist.org}
              sumToOrg={dist.sum}
              donationTimestamp={timestamp}
            />
          )}
          {dist.org === "Drift" && (
            <div className={style.impact}>{dist.sum} til drift av GiEffektivt</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DonationImpact;
