import React, { useState } from "react";
import style from "./DonationDetails.module.scss";
import { Distribution, Donation } from "../../../../../models";
import { Organization } from "../../../../shared/components/Widget/types/Organization";
import { CauseArea } from "../../../../shared/components/Widget/types/CauseArea";
import DonationImpact, {
  DonationImpactItemsConfiguration,
} from "../../../donations/DonationImpact/DonationImpact";
import { mapNameToOrgAbbriv } from "../../../../../util/mappings";
import AnimateHeight from "react-animate-height";
import { LinkType, Links } from "../../../../main/blocks/Links/Links";
import { PortableText } from "@portabletext/react";
import { NavLink } from "../../../../shared/components/Navbar/Navbar";
import { groupDonationImpactByCauseArea } from "./impactGroups";

type ImpactEstimateExplanationConfiguration = {
  impact_estimate_explanation_title?: string;
  impact_estimate_explanation_text?: any[];
  impact_estimate_explanation_links?: (LinkType | NavLink)[];
};

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
}> = ({ sum, donation, distribution, timestamp, configuration, organizations, causeAreas }) => {
  const [expandedCauseAreaIds, setExpandedCauseAreaIds] = useState<number[]>([]);

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
        <strong>{configuration.impact_estimate_header}</strong>
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
          const impactEstimateConfiguration = configuration.cause_area_impact_estimates?.find(
            (candidate) => candidate.cause_area_id === causeAreaId,
          );
          const showImpactEstimateExplanation = expandedCauseAreaIds.includes(causeAreaId);

          return (
            <div key={causeAreaId}>
              {(impactGroup?.showTitle ?? visibleCauseAreas.length > 1) && (
                <h5>{causeArea.name}</h5>
              )}
              {impactEstimateConfiguration?.impact_estimate_explanation_title && (
                <>
                  <span
                    className={
                      showImpactEstimateExplanation
                        ? [style.caption, style.captionopen].join(" ")
                        : style.caption
                    }
                    onClick={() =>
                      setExpandedCauseAreaIds((current) =>
                        current.includes(causeAreaId)
                          ? current.filter((id) => id !== causeAreaId)
                          : [...current, causeAreaId],
                      )
                    }
                  >
                    {impactEstimateConfiguration.impact_estimate_explanation_title}&nbsp;&nbsp;
                  </span>
                  <AnimateHeight duration={500} height={showImpactEstimateExplanation ? "auto" : 0}>
                    <div className={style.impactExplanationContainer}>
                      <PortableText
                        value={impactEstimateConfiguration.impact_estimate_explanation_text}
                      />
                      <Links
                        links={impactEstimateConfiguration.impact_estimate_explanation_links ?? []}
                      ></Links>
                    </div>
                  </AnimateHeight>
                </>
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
