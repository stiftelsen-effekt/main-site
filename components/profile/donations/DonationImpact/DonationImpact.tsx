import React, { useCallback, useState } from "react";
import useSWR from "swr";
import { Distribution, DistributionCauseArea, Donation, GiveWellGrant } from "../../../../models";
import { thousandize } from "../../../../util/formatting";
import style from "./DonationImpact.module.scss";
import {
  DonationImpactGlobalHealthItem,
  ImpactItemConfiguration,
} from "./GlobalHealth/DonationImpactItemGlobalHealth";
import { ErrorMessage } from "../../shared/ErrorMessage/ErrorMessage";
import DonationImpactGlobalHealth from "./GlobalHealth/DonationImpactGlobalHealth";
import DonationImpactAnimalWelfare from "./AnimalWelfare/DonationImpactAnimalWelfare";
import { mapNameToOrgAbbriv } from "../../../../util/mappings";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
