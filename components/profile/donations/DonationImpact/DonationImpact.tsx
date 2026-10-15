import React, { useCallback, useState } from "react";
import { Distribution, DistributionCauseArea, Donation } from "../../../../models";
import { Organization } from "../../../shared/components/Widget/types/Organization";
import style from "./DonationImpact.module.scss";
import { DonationImpactItem } from "./DonationImpactItem";
import {
  DonationImpactItemsConfiguration,
  DonationImpactList,
  ImpactDistributionEntry,
} from "./DonationImpactList";
import { isFundOrganizationId, mapNameToOrgAbbriv } from "../../../../util/mappings";

export type { DonationImpactItemsConfiguration };

const isOperationsOrg = (name: string) => name === "Drift" || mapNameToOrgAbbriv(name) === "Drift";

const toDistributionEntry = (
  org: { id: number; name?: string; percentageShare: string },
  donationSum: number,
  causeAreaShare: number,
): ImpactDistributionEntry => ({
  org: mapNameToOrgAbbriv(org.name as string),
  orgName: org.name ?? "unknown",
  isFund: isFundOrganizationId(org.id),
  isOperations: isOperationsOrg(org.name as string),
  sum: donationSum * (parseFloat(org.percentageShare) / 100) * causeAreaShare,
});

const DonationImpact: React.FC<{
  donation: Donation;
  distribution: Distribution;
  timestamp: Date;
  configuration: DonationImpactItemsConfiguration;
  organizations: Organization[];
}> = ({ donation, distribution, timestamp, configuration, organizations }) => {
  const [requiredPrecision, setRequiredPrecision] = useState(0);
  const updatePrecision = useCallback(
    (precision: number) => {
      if (precision > requiredPrecision) setRequiredPrecision(precision);
    },
    [requiredPrecision],
  );

  if (donation.impact?.length) {
    return (
      <div className={style.container}>
        <table className={style.wrapper} cellSpacing={0} data-cy="donation-impact-list">
          <tbody>
            {donation.impact.map((entry, i) => {
              const matchedOrg = organizations.find((org) => org.name === entry.organization);
              if (!matchedOrg) {
                console.error(
                  `No organization found matching DK impact organization "${entry.organization}"`,
                );
              }
              return (
                <DonationImpactItem
                  key={`${donation.id}-impact-${i}`}
                  orgAbriv=""
                  orgName={entry.recipient}
                  sumToOrg={entry.amount}
                  donationTimestamp={timestamp}
                  precision={requiredPrecision}
                  signalRequiredPrecision={updatePrecision}
                  configuration={configuration.impact_item_configuration}
                  preComputedImpact={{
                    output: entry.count,
                    shortDescription: entry.unit,
                    longDescription: matchedOrg?.shortDescription ?? "",
                    charityName: entry.recipient,
                    orgUrl: matchedOrg?.informationUrl ?? "",
                  }}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  const multipleCauseAreas = distribution.causeAreas.length > 1;
  const donationSum = parseFloat(donation.sum);

  /**
   * When a donation spans multiple cause areas, operations (Drift) is pulled out of the
   * individual cause area sections and shown as its own titled section aggregating the
   * operations amount across all cause areas (see donation overview design).
   */
  const operationsSum = multipleCauseAreas
    ? distribution.causeAreas.reduce((total, causeArea) => {
        const causeAreaShare = parseFloat(causeArea.percentageShare) / 100;
        const causeAreaOperations = causeArea.organizations
          .filter((org) => isOperationsOrg(org.name as string))
          .reduce(
            (sum, org) =>
              sum + donationSum * (parseFloat(org.percentageShare) / 100) * causeAreaShare,
            0,
          );
        return total + causeAreaOperations;
      }, 0)
    : 0;

  return (
    <>
      {distribution.causeAreas.map((causeArea: DistributionCauseArea) => {
        const causeAreaShare = parseFloat(causeArea.percentageShare) / 100;
        const organizations = multipleCauseAreas
          ? causeArea.organizations.filter((org) => !isOperationsOrg(org.name as string))
          : causeArea.organizations;

        return (
          <div key={`${donation.id}-causarea${causeArea.id}-impact`}>
            {multipleCauseAreas && <h5 className={style.causeAreaHeader}>{causeArea.name}</h5>}
            <DonationImpactList
              donation={donation}
              distribution={organizations.map((org) =>
                toDistributionEntry(org, donationSum, causeAreaShare),
              )}
              timestamp={timestamp}
              configuration={configuration}
            />
          </div>
        );
      })}
      {multipleCauseAreas && operationsSum > 0 && (
        <div key={`${donation.id}-operations`}>
          <h5 className={style.causeAreaHeader}>
            {configuration.operations_section_title ?? configuration.operations_label}
          </h5>
          <DonationImpactList
            donation={donation}
            distribution={[
              {
                org: "Drift",
                orgName: configuration.operations_label,
                isOperations: true,
                sum: operationsSum,
              },
            ]}
            timestamp={timestamp}
            configuration={configuration}
          />
        </div>
      )}
    </>
  );
};

export default DonationImpact;
