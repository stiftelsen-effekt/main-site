import React, { useCallback, useState } from "react";
import useSWR from "swr";
import { PortableText } from "@portabletext/react";
import { Donation, GiveWellGrant } from "../../../../../models";
import style from "./DonationImpactGlobalHealth.module.scss";
import { LinkType, Links } from "../../../../main/blocks/Links/Links";
import { NavLink } from "../../../../shared/components/Navbar/Navbar";
import {
  DonationImpactGlobalHealthItem,
  ImpactItemConfiguration,
} from "./DonationImpactItemGlobalHealth";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export type DonationImpactItemsConfiguration = {
  currency: string;
  locale: string;
  operations_label: string;
  operations_section_title?: string;
  operations_text?: any[];
  operations_links?: (LinkType | NavLink)[];
  impact_item_configuration: ImpactItemConfiguration;
};

type DistributionEntry = {
  org: string;
  orgName: string;
  sum: number;
  // Portion of `sum` routed via a GiveWell grant, and the outputs it bought
  // using the grant's own cost-per-output
  smartDistributionSum?: number;
  smartDistributionOutput?: number;
};

/**
 * Renders the expandable content for an operations item. Returns null when there is
 * no configured text or links, so the caller can omit the expand arrow entirely.
 */
export const renderOperationsContent = (configuration: DonationImpactItemsConfiguration) => {
  const text = configuration.operations_text;
  const links = configuration.operations_links;
  const hasText = Boolean(text && text.length > 0);
  const hasLinks = Boolean(links && links.length > 0);
  if (!hasText && !hasLinks) return null;
  return (
    <>
      {hasText && <PortableText value={text} />}
      {hasLinks && links && <Links links={links} />}
    </>
  );
};

/**
 * Standalone operations section rendered with its own title when a donation spans
 * multiple cause areas (see DonationImpact cause area grouping).
 */
export const DonationImpactOperations: React.FC<{
  donation: Donation;
  sum: number;
  timestamp: Date;
  configuration: DonationImpactItemsConfiguration;
}> = ({ donation, sum, timestamp, configuration }) => (
  <div className={style.container} key={`${donation.id}-operations`}>
    <table className={style.wrapper} cellSpacing={0} data-cy="donation-impact-list">
      <tbody>
        <DonationImpactGlobalHealthItem
          orgAbriv="Drift"
          orgName={configuration.operations_label}
          sumToOrg={sum}
          donationTimestamp={timestamp}
          precision={0}
          signalRequiredPrecision={() => {}}
          configuration={configuration.impact_item_configuration}
          isOperations
          expandedContentOverride={renderOperationsContent(configuration)}
        />
      </tbody>
    </table>
  </div>
);

const DonationImpactGlobalHealth: React.FC<{
  donation: Donation;
  distribution: DistributionEntry[];
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

  let spreadDistribution: DistributionEntry[] = [...filteredDistribution];
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
      const orgName = allotment.charity.charity_name ?? allotment.charity.abbreviation;
      const sum = Math.round((allotment.sum_in_cents / grantTotal) * giveWellDist.sum);
      const output =
        allotment.converted_cost_per_output > 0 ? sum / allotment.converted_cost_per_output : 0;
      const orgIndex = spreadDistribution.findIndex((d) => d.org === org);
      if (orgIndex !== -1) {
        spreadDistribution[orgIndex].sum += sum;
        spreadDistribution[orgIndex].smartDistributionSum =
          (spreadDistribution[orgIndex].smartDistributionSum ?? 0) + sum;
        spreadDistribution[orgIndex].smartDistributionOutput =
          (spreadDistribution[orgIndex].smartDistributionOutput ?? 0) + output;
      } else {
        spreadDistribution.push({
          org,
          orgName,
          sum,
          smartDistributionSum: sum,
          smartDistributionOutput: output,
        });
      }
    });
  }

  return (
    <div className={style.container} key={`${donation.id}-impact`}>
      <table className={style.wrapper} cellSpacing={0} data-cy="donation-impact-list">
        <tbody>
          {spreadDistribution.map((dist) => (
            <React.Fragment key={`${donation.id}-impact-${dist.org}`}>
              {dist.org !== "Drift" && (
                <DonationImpactGlobalHealthItem
                  orgAbriv={dist.org}
                  orgName={dist.orgName ?? dist.org}
                  sumToOrg={dist.sum}
                  smartDistributionSum={dist.smartDistributionSum}
                  smartDistributionOutput={dist.smartDistributionOutput}
                  donationTimestamp={timestamp}
                  precision={requiredPrecision}
                  signalRequiredPrecision={(precision) => {
                    if (precision > requiredPrecision) updatePrecision(precision);
                  }}
                  configuration={configuration.impact_item_configuration}
                />
              )}
              {dist.org === "Drift" && (
                <DonationImpactGlobalHealthItem
                  orgAbriv="Drift"
                  orgName={configuration.operations_label}
                  sumToOrg={dist.sum}
                  donationTimestamp={timestamp}
                  precision={requiredPrecision}
                  signalRequiredPrecision={(precision) => {
                    if (precision > requiredPrecision) updatePrecision(precision);
                  }}
                  configuration={configuration.impact_item_configuration}
                  isOperations
                  expandedContentOverride={renderOperationsContent(configuration)}
                />
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationImpactGlobalHealth;
