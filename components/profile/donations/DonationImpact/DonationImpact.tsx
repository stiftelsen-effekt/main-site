import React, { useCallback, useState } from "react";
import { Distribution, DistributionCauseArea, Donation } from "../../../../models";
import style from "./DonationImpact.module.scss";
import ghStyle from "./GlobalHealth/DonationImpactGlobalHealth.module.scss";
import {
  DonationImpactGlobalHealthItem,
  ImpactItemConfiguration,
} from "./GlobalHealth/DonationImpactItemGlobalHealth";
import DonationImpactGlobalHealth from "./GlobalHealth/DonationImpactGlobalHealth";
import DonationImpactAnimalWelfare from "./AnimalWelfare/DonationImpactAnimalWelfare";
import { mapNameToOrgAbbriv } from "../../../../util/mappings";

export type DonationImpactItemsConfiguration = {
  currency: string;
  locale: string;
  smart_distribution_label: string;
  operations_label: string;
  impact_item_configuration: ImpactItemConfiguration;
};

const DonationImpact: React.FC<{
  donation: Donation;
  distribution: Distribution;
  timestamp: Date;
  configuration: DonationImpactItemsConfiguration;
}> = ({ donation, distribution, timestamp, configuration }) => {
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
            {donation.impact.map((entry, i) => (
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
                  longDescription: entry.description,
                  linkSubject: entry.unit,
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <>
      {distribution.causeAreas.map((causeArea: DistributionCauseArea) => (
        <div key={`${donation.id}-causarea${causeArea.id}-impact`}>
          {distribution.causeAreas.length > 1 && (
            <h5 className={style.causeAreaHeader}>{causeArea.name}</h5>
          )}
          {causeArea.id === 1 && (
            <DonationImpactGlobalHealth
              key={`${donation.id}-causarea${causeArea.id}-impact`}
              donation={donation}
              distribution={causeArea.organizations.map((org) => ({
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
              distribution={causeArea.organizations.map((org) => ({
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
      ))}
    </>
  );
};

export default DonationImpact;
