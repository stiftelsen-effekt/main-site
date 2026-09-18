import React from "react";
import style from "./DonationDetails.module.scss";
import { Distribution, Donation } from "../../../../../models";
import { Organization } from "../../../../shared/components/Widget/types/Organization";
import { CauseArea } from "../../../../shared/components/Widget/types/CauseArea";
import DonationImpact, {
  DonationImpactItemsConfiguration,
} from "../../../donations/DonationImpact/DonationImpact";
import { ImpactEstimateExplanationConfiguration } from "../../../donations/DonationsAggregateImpactTable/ImpactEstimateExplanation";
import { groupDonationImpactByCauseArea } from "./impactGroups";

type CauseAreaImpactEstimateConfiguration = ImpactEstimateExplanationConfiguration & {
  cause_area_id: number;
};

export type DonationDetailsConfiguration = {
  impact_estimate_header?: string;
  cause_area_impact_estimates?: CauseAreaImpactEstimateConfiguration[];
  impact_items_configuration: DonationImpactItemsConfiguration;
};

export const DonationDetails: React.FC<{
  sum: string;
  donation: Donation;
  distribution: Distribution;
  timestamp: Date;
  configuration: DonationDetailsConfiguration;
  organizations: Organization[];
  causeAreas: CauseArea[];
}> = ({ donation, distribution, timestamp, configuration, organizations, causeAreas }) => {
  if (!distribution && !donation.impact?.length)
    return <span>Ingen distribusjon funnet for donasjon med KID {donation.KID}</span>;

  const distributionCauseAreas = distribution?.causeAreas ?? [];
  const impactGroups = groupDonationImpactByCauseArea(
    donation.impact ?? [],
    organizations,
    causeAreas,
  );
  const hasPrecomputedImpact = Boolean(donation.impact?.length && impactGroups.length);
  const visibleCauseAreas = hasPrecomputedImpact
    ? impactGroups.map((group) => group.causeArea)
    : distributionCauseAreas;

  return (
    <div className={style.wrapper}>
      <div className={style.impactEstimate}>
        {visibleCauseAreas.map((causeArea) => {
          const causeAreaId = causeArea.id;
          const causeAreaDistribution =
            distribution && !hasPrecomputedImpact
              ? {
                  ...distribution,
                  causeAreas: distributionCauseAreas.filter(
                    (distributionCauseArea) => distributionCauseArea.id === causeAreaId,
                  ),
                }
              : distribution;
          const impactGroup = impactGroups.find((group) => group.causeArea.id === causeAreaId);
          const causeAreaDonation = hasPrecomputedImpact
            ? { ...donation, impact: impactGroup?.impact }
            : donation;

          return (
            <div key={causeAreaId}>
              {(impactGroup?.showTitle ?? visibleCauseAreas.length > 1) && (
                <h5>{causeArea.name}</h5>
              )}

              <DonationImpact
                donation={causeAreaDonation}
                distribution={causeAreaDistribution as Distribution}
                timestamp={timestamp}
                configuration={configuration.impact_items_configuration}
                organizations={organizations}
              />
            </div>
          );
        })}
      </div>

      <div className={style.actions}>
        {/**
         * TODO: Add actions for managing the donation
         * - Download receipt
         * - Connect to tax unit
         * - Edit agreement (if it is an agreement)
         */}
      </div>
    </div>
  );
};
