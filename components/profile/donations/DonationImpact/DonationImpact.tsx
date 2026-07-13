import React, { useCallback, useState } from "react";
import { Distribution, DistributionCauseArea, Donation } from "../../../../models";
import { Organization } from "../../../shared/components/Widget/types/Organization";
import style from "./DonationImpact.module.scss";
import ghStyle from "./GlobalHealth/DonationImpactGlobalHealth.module.scss";
import {
  DonationImpactGlobalHealthItem,
  ImpactItemConfiguration,
} from "./GlobalHealth/DonationImpactItemGlobalHealth";
import DonationImpactGlobalHealth, {
  DonationImpactOperations,
} from "./GlobalHealth/DonationImpactGlobalHealth";
import DonationImpactAnimalWelfare from "./AnimalWelfare/DonationImpactAnimalWelfare";
import { mapNameToOrgAbbriv } from "../../../../util/mappings";
import { LinkType } from "../../../main/blocks/Links/Links";
import { NavLink } from "../../../shared/components/Navbar/Navbar";

export type DonationImpactItemsConfiguration = {
  currency: string;
  locale: string;
  operations_label: string;
  operations_section_title?: string;
  operations_text?: any[];
  operations_links?: (LinkType | NavLink)[];
  impact_item_configuration: ImpactItemConfiguration;
};

const isOperationsOrg = (name: string) => name === "Drift" || mapNameToOrgAbbriv(name) === "Drift";

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
      <div className={ghStyle.container}>
        <table className={ghStyle.wrapper} cellSpacing={0} data-cy="donation-impact-list">
          <tbody>
            {donation.impact.map((entry, i) => {
              const matchedOrg = organizations.find((org) => org.name === entry.organization);
              if (!matchedOrg) {
                console.error(
                  `No organization found matching DK impact organization "${entry.organization}"`,
                );
              }
              return (
                <DonationImpactGlobalHealthItem
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

  /**
   * When a donation spans multiple cause areas, operations (Drift) is pulled out of the
   * individual cause area sections and shown as its own titled section aggregating the
   * operations amount across all cause areas (see donation overview design).
   */
  const operationsSum = multipleCauseAreas
    ? distribution.causeAreas.reduce((total, causeArea) => {
        const causeAreaOperations = causeArea.organizations
          .filter((org) => isOperationsOrg(org.name as string))
          .reduce(
            (sum, org) =>
              sum +
              parseFloat(donation.sum) *
                (parseFloat(org.percentageShare) / 100) *
                (parseFloat(causeArea.percentageShare) / 100),
            0,
          );
        return total + causeAreaOperations;
      }, 0)
    : 0;

  return (
    <>
      {distribution.causeAreas.map((causeArea: DistributionCauseArea) => {
        const organizations = multipleCauseAreas
          ? causeArea.organizations.filter((org) => !isOperationsOrg(org.name as string))
          : causeArea.organizations;

        return (
          <div key={`${donation.id}-causarea${causeArea.id}-impact`}>
            {multipleCauseAreas && <h5 className={style.causeAreaHeader}>{causeArea.name}</h5>}
            {causeArea.id === 1 && (
              <DonationImpactGlobalHealth
                key={`${donation.id}-causarea${causeArea.id}-impact`}
                donation={donation}
                distribution={organizations.map((org) => ({
                  org: mapNameToOrgAbbriv(org.name as string),
                  orgName: org.name ?? "unknown",
                  sum:
                    parseFloat(donation.sum) *
                    (parseFloat(org.percentageShare) / 100) *
                    (parseFloat(causeArea.percentageShare) / 100),
                }))}
                timestamp={timestamp}
                configuration={configuration}
              />
            )}
            {causeArea.id !== 1 && (
              <DonationImpactAnimalWelfare
                key={`${donation.id}-causarea${causeArea.id}-impact`}
                donation={donation}
                distribution={organizations.map((org) => ({
                  org: org.name as string,
                  sum:
                    parseFloat(donation.sum) *
                    (parseFloat(org.percentageShare) / 100) *
                    (parseFloat(causeArea.percentageShare) / 100),
                }))}
                timestamp={timestamp}
                configuration={configuration}
              />
            )}
          </div>
        );
      })}
      {multipleCauseAreas && operationsSum > 0 && (
        <div key={`${donation.id}-operations`}>
          <h5 className={style.causeAreaHeader}>
            {configuration.operations_section_title ?? configuration.operations_label}
          </h5>
          <DonationImpactOperations
            donation={donation}
            sum={operationsSum}
            timestamp={timestamp}
            configuration={configuration}
          />
        </div>
      )}
    </>
  );
};

export default DonationImpact;
