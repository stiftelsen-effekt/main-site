import React, { useCallback, useState } from "react";
import useSWR from "swr";
import { Donation, GiveWellGrant } from "../../../../../models";
import { thousandize } from "../../../../../util/formatting";
import style from "./DonationImpactGlobalHealth.module.scss";
import {
  DonationImpactGlobalHealthItem,
  ImpactItemConfiguration,
} from "./DonationImpactItemGlobalHealth";
import { ErrorMessage } from "../../../shared/ErrorMessage/ErrorMessage";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export type DonationImpactItemsConfiguration = {
  currency: string;
  locale: string;
  smart_distribution_label: string;
  operations_label: string;
  impact_item_configuration: ImpactItemConfiguration;
};

const DonationImpactGlobalHealth: React.FC<{
  donation: Donation;
  distribution: { org: string; sum: number }[];
  timestamp: Date;
  configuration: DonationImpactItemsConfiguration;
}> = ({ donation, distribution, timestamp, configuration }) => {
  const { data, error, isValidating } = useSWR<{ max_impact_fund_grants: GiveWellGrant[] }>(
    `https://impact.gieffektivt.no/api/max_impact_fund_grants?currency=${
      configuration.currency
    }&language=${configuration.locale}&donation_year=${timestamp.getFullYear()}&donation_month=${
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
  const updatePrecision = useCallback(
    (precision: number) => {
      setRequiredPrecision(precision);
    },
    [setRequiredPrecision],
  );

  if (!data || isValidating) {
    return <div key={`${donation.id}-impact`}>Loading...</div>;
  }
  if (error) {
    return <div key={`${donation.id}-impact`}>{error}</div>;
  }

  /**
   * If the donation has a component to the maximum impact fund, we must find the relevant grant
   * and distribute the part of the donation to GiveWell to the distribution
   */
  const giveWellDist = distribution.find((d) => d.org === "GiveWell");
  const filteredDistribution = distribution
    .filter((d) => d.org !== "GiveWell")
    .map((o) => ({ ...o }))
    .sort(function (a, b) {
      var key = "Drift";
      if (a.org === key && b.org != key) return -1;
      if (a.org != key && b.org === key) return 1;
      return 0;
    });

  let spreadDistribution: { org: string; sum: number }[] = [...filteredDistribution];
  if (giveWellDist) {
    const relevantGrant = data?.max_impact_fund_grants[0];

    if (!relevantGrant) {
      return <div key={`${donation.id}-impact`}>Could not find relevant maximum impact grant</div>;
    }

    const grantTotal = relevantGrant.allotment_set.reduce((acc, grant) => {
      return acc + grant.sum_in_cents;
    }, 0);

    relevantGrant.allotment_set.forEach((allotment) => {
      const org = allotment.charity.abbreviation;
      const sum = Math.round((allotment.sum_in_cents / grantTotal) * giveWellDist.sum);
      const orgIndex = spreadDistribution.findIndex((d) => d.org === org);
      if (orgIndex !== -1) {
        spreadDistribution[orgIndex].sum += sum;
      } else {
        spreadDistribution.push({ org, sum });
      }
    });
  }

  return (
    <div className={style.container} key={`${donation.id}-impact`}>
      {giveWellDist && (
        <div className={style.smartdistributionlabel}>
          <span>{configuration.smart_distribution_label}</span>
          <strong>{`${thousandize(Math.round(giveWellDist.sum) || null)} kr`}</strong>
        </div>
      )}
      <table className={style.wrapper} cellSpacing={0} data-cy="donation-impact-list">
        <tbody>
          {spreadDistribution.map((dist, i) => (
            <React.Fragment key={`${donation.id}-impact-${dist.org}`}>
              {dist.org !== "Drift" && (
                <DonationImpactGlobalHealthItem
                  orgAbriv={dist.org}
                  sumToOrg={dist.sum}
                  donationTimestamp={timestamp}
                  precision={requiredPrecision}
                  signalRequiredPrecision={(precision) => {
                    if (precision > requiredPrecision) updatePrecision(precision);
                  }}
                  configuration={configuration.impact_item_configuration}
                />
              )}
              {dist.org === "Drift" && (
                <tr>
                  <td className={style.impact} colSpan={100}>
                    <span>{configuration.operations_label}</span>
                    <strong>{`${Math.round(dist.sum)} kr`}</strong>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationImpactGlobalHealth;
