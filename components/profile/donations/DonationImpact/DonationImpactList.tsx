import React, { useCallback, useState } from "react";
import { PortableText } from "@portabletext/react";
import { Donation } from "../../../../models";
import style from "./DonationImpact.module.scss";
import { LinkType, Links } from "../../../main/blocks/Links/Links";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
import { DonationImpactItem, ImpactItemConfiguration } from "./DonationImpactItem";

export type DonationImpactItemsConfiguration = {
  currency: string;
  locale: string;
  operations_label: string;
  operations_section_title?: string;
  operations_text?: any[];
  operations_links?: (LinkType | NavLink)[];
  impact_item_configuration: ImpactItemConfiguration;
};

export type ImpactDistributionEntry = {
  org: string;
  orgName: string;
  isFund?: boolean;
  isOperations?: boolean;
  sum: number;
  smartDistributionSum?: number;
  smartDistributionOutput?: number;
};

const isOperationsEntry = (entry: ImpactDistributionEntry) =>
  Boolean(entry.isOperations) || entry.org === "Drift";

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

export const DonationImpactList: React.FC<{
  donation: Donation;
  distribution: ImpactDistributionEntry[];
  timestamp: Date;
  configuration: DonationImpactItemsConfiguration;
}> = ({ donation, distribution, timestamp, configuration }) => {
  const [requiredPrecision, setRequiredPrecision] = useState(0);
  const updatePrecision = useCallback((precision: number) => {
    setRequiredPrecision(precision);
  }, []);

  const sortedDistribution = [...distribution].sort((a, b) => {
    const aOperations = isOperationsEntry(a);
    const bOperations = isOperationsEntry(b);
    if (aOperations && !bOperations) return -1;
    if (!aOperations && bOperations) return 1;
    return 0;
  });

  return (
    <div className={style.container} key={`${donation.id}-impact`}>
      <table className={style.wrapper} cellSpacing={0} data-cy="donation-impact-list">
        <tbody>
          {sortedDistribution.map((dist) => {
            const operations = isOperationsEntry(dist);
            return (
              <DonationImpactItem
                key={`${donation.id}-impact-${dist.org}`}
                orgAbriv={dist.org}
                orgName={operations ? configuration.operations_label : dist.orgName}
                sumToOrg={dist.sum}
                smartDistributionSum={dist.smartDistributionSum}
                smartDistributionOutput={dist.smartDistributionOutput}
                donationTimestamp={timestamp}
                precision={requiredPrecision}
                signalRequiredPrecision={(precision) => {
                  if (precision > requiredPrecision) updatePrecision(precision);
                }}
                configuration={configuration.impact_item_configuration}
                isFund={dist.isFund}
                isOperations={operations}
                expandedContentOverride={
                  operations ? renderOperationsContent(configuration) : undefined
                }
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
