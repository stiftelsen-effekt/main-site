import React, { useState } from "react";
import style from "./DonationDetails.module.scss";
import { Distribution, Donation } from "../../../../../models";
import DonationImpact, {
  DonationImpactItemsConfiguration,
} from "../../../donations/DonationImpact/DonationImpact";
import { mapNameToOrgAbbriv } from "../../../../../util/mappings";
import AnimateHeight from "react-animate-height";
import { LinkType, Links } from "../../../../main/blocks/Links/Links";
import { PortableText } from "@portabletext/react";
import { NavLink } from "../../../../shared/components/Navbar/Navbar";

export type DonationDetailsConfiguration = {
  impact_estimate_header: string;
  impact_estimate_explanation_title: string;
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

  if (!distribution)
    return <span>Ingen distribusjon funnet for donasjon med KID {donation.KID}</span>;

  return (
    <div className={style.wrapper}>
      <div className={style.impactEstimate}>
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
          distribution={distribution}
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
