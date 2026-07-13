import React, { useCallback, useState } from "react";
import { PortableText } from "@portabletext/react";
import { Donation } from "../../../../../models";
import style from "./DonationImpactAnimalWelfare.module.scss";
import { LinkType, Links } from "../../../../main/blocks/Links/Links";
import { NavLink } from "../../../../shared/components/Navbar/Navbar";
import {
  DonationImpactItemAnimalWelfare,
  ImpactItemConfiguration,
} from "./DonationImpactItemAnimalWelfare";

export type DonationImpactItemsConfiguration = {
  currency: string;
  locale: string;
  operations_label: string;
  operations_section_title?: string;
  operations_text?: any[];
  operations_links?: (LinkType | NavLink)[];
  impact_item_configuration: ImpactItemConfiguration;
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

const DonationImpactAnimalWelfare: React.FC<{
  donation: Donation;
  distribution: { org: string; sum: number }[];
  timestamp: Date;
  configuration: DonationImpactItemsConfiguration;
}> = ({ donation, distribution, timestamp, configuration }) => {
  const [requiredPrecision, setRequiredPrecision] = useState(0);
  const updatePrecision = useCallback(
    (precision: number) => {
      setRequiredPrecision(precision);
    },
    [setRequiredPrecision],
  );

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

  return (
    <div className={style.container} key={`${donation.id}-impact`}>
      <table className={style.wrapper} cellSpacing={0} data-cy="donation-impact-list">
        <tbody>
          {spreadDistribution.map((dist, i) => (
            <React.Fragment key={`${donation.id}-impact-${dist.org}`}>
              {dist.org !== "Drift" && (
                <DonationImpactItemAnimalWelfare
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
                <DonationImpactItemAnimalWelfare
                  orgAbriv="Drift"
                  sumToOrg={dist.sum}
                  donationTimestamp={timestamp}
                  precision={requiredPrecision}
                  signalRequiredPrecision={(precision) => {
                    if (precision > requiredPrecision) updatePrecision(precision);
                  }}
                  configuration={configuration.impact_item_configuration}
                  singleLineLabelOverride={configuration.operations_label}
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

export default DonationImpactAnimalWelfare;
