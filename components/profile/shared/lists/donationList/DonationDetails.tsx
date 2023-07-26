import React, { useState } from "react";
import jsonData from "./dummy.json";
import style from "./DonationDetails.module.scss";
import { Distribution, Donation } from "../../../../../models";
import DonationImpact, {
  DonationImpactItemsConfiguration,
} from "../../../donations/DonationImpact/DonationImpact";
import { mapNameToOrgAbbriv } from "../../../../../util/mappings";
import AnimateHeight from "react-animate-height";
import { LinkType, Links } from "../../../../main/blocks/Links/Links";
import { PortableText } from "@portabletext/react";
import { NavLink } from "../../../../main/layout/navbar";
import DonationsTimelinePreview from "../../../../shared/components/Timeline/DonationsTimeline.style";
import { DonationsTimeline } from "../../../../shared/components/Timeline/DonationsTimeline";
import { DonationStatusModal } from "../../../donations/DonationsStatus/DonationStatusModal";
//import { DonationDateAmount } from "./DonationDataAmount";

export type DonationDetailsConfiguration = {
  impact_estimate_header: string;
  status_estimate_header: string;
  impact_estimate_explanation_title: string;
  status_estimate_explanation_title: string;
  date_and_amount: string;
  status_estimate_explanation_text: any[];
  impact_estimate_explanation_text: any[];
  impact_estimate_explanation_links: (LinkType | NavLink)[];
  impact_items_configuration: DonationImpactItemsConfiguration;
};

export const DonationDetails: React.FC<{
  sum: string;
  donation: Donation;
  distribution: Distribution;
  timestamp: Date;
  configuration: DonationDetailsConfiguration;
}> = ({ sum, donation, distribution, timestamp, configuration }) => {
  const [showImpactEstimateExplanation, setShowImpactEstimateExplanation] = useState(false);
  const [showStatusEstimateExplanation, setShowStatusEstimateExplanation] = useState(false);

  if (!distribution)
    return <span>Ingen distribusjon funnet for donasjon med KID {donation.KID}</span>;

  const mappedDistribution = distribution.shares.map((org) => ({
    org: mapNameToOrgAbbriv(org.name) || org.name,
    sum: parseFloat(sum) * (parseFloat(org.share) / 100),
  }));
  const myDate = "22.03.23";
  return (
    <div className={style.wrapper}>
      <div className={style.impactEstimate}>
        <strong>{configuration.status_estimate_header}</strong>
        <span
          className={
            showStatusEstimateExplanation
              ? [style.caption, style.captionopen].join(" ")
              : style.caption
          }
          onClick={() => setShowStatusEstimateExplanation(!showStatusEstimateExplanation)}
        >
          {configuration.status_estimate_explanation_title}&nbsp;&nbsp;
        </span>
        <div className={style.captionStatus}>
          {console.log(
            "configuration?.date_and_amount: ",
            configuration?.date_and_amount.replace("{{date}}", "1").replace("{{amount}}", "444"),
          )}
        </div>
        <AnimateHeight duration={500} height={showStatusEstimateExplanation ? "auto" : 0}>
          <div className={style.impactExplanationContainer}>
            <PortableText value={configuration?.status_estimate_explanation_text} />

            <Links links={configuration?.impact_estimate_explanation_links}></Links>
          </div>
        </AnimateHeight>

        <DonationsTimelinePreview description="Donasjon mottatt av GiveWell" data={jsonData} />
        <strong>{configuration.impact_estimate_header}</strong>

        <span
          className={
            showImpactEstimateExplanation
              ? [style.caption, style.captionopen].join(" ")
              : style.caption
          }
          onClick={() => setShowImpactEstimateExplanation(!showImpactEstimateExplanation)}
        >
          {configuration.impact_estimate_explanation_title}&nbsp;&nbsp;
        </span>
        <AnimateHeight duration={500} height={showImpactEstimateExplanation ? "auto" : 0}>
          <div className={style.impactExplanationContainer}>
            <PortableText value={configuration?.impact_estimate_explanation_text} />

            <Links links={configuration?.impact_estimate_explanation_links}></Links>
          </div>
        </AnimateHeight>
        <DonationImpact
          donation={donation}
          distribution={mappedDistribution}
          timestamp={timestamp}
          configuration={configuration.impact_items_configuration}
        />
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
