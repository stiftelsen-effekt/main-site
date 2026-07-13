import React, { useEffect, useState } from "react";
import style from "./DonationImpactItemAnimalWelfare.module.scss";
import { thousandize, thousandizeString } from "../../../../../util/formatting";
import useSWR from "swr";
import { ImpactEvaluation } from "../../../../../models";
import AnimateHeight from "react-animate-height";
import { Links } from "../../../../main/blocks/Links/Links";
import { PortableText } from "@portabletext/react";

export type ImpactItemConfiguration = {
  output_subheading_format_string: string;
  missing_evaluation_header: string;
  missing_impact_evaluation_text: any[];
  about_org_link_title_format_string: string;
  about_org_link_url_format_string: string;
  currency: string;
  locale: string;
};

export const DonationImpactItemAnimalWelfare: React.FC<{
  orgAbriv: string;
  sumToOrg: number;
  donationTimestamp: Date;
  precision: number;
  signalRequiredPrecision: (precision: number) => void;
  configuration: ImpactItemConfiguration;
  singleLineLabelOverride?: string;
  expandedContentOverride?: React.ReactNode;
}> = ({
  orgAbriv,
  sumToOrg,
  donationTimestamp,
  precision,
  signalRequiredPrecision,
  configuration,
  singleLineLabelOverride,
  expandedContentOverride,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  /**
   * Animal welfare donations never have an impact estimate, so they always render as a
   * single line in addition to the number, with the expand arrow on that line. The sum
   * is already shown as the number, so we strip {{sum}} to avoid showing it twice.
   */
  const singleLineText =
    singleLineLabelOverride ??
    configuration.output_subheading_format_string
      .replace("{{sum}}", "")
      .replace("{{org}}", orgAbriv)
      .replace(/\s+/g, " ")
      .trim();

  const expandedContent =
    expandedContentOverride ??
    (configuration.missing_impact_evaluation_text && (
      <PortableText value={configuration.missing_impact_evaluation_text} />
    ));

  const hasExpandableContent = Boolean(expandedContent);

  return (
    <>
      <tr
        className={[style.overview, style.singleLineOverview].join(" ")}
        data-cy="donation-impact-list-item-overview"
      >
        <td>
          <span className={style.impactOutput} data-cy="donation-impact-list-item-output">
            {thousandize(Math.round(sumToOrg))}
          </span>
        </td>
        <td>
          <span
            className={[
              style.impactDetailsSingleLine,
              hasExpandableContent ? style.expandable : "",
              hasExpandableContent && showDetails ? style.expanded : "",
            ].join(" ")}
            onClick={hasExpandableContent ? () => setShowDetails(!showDetails) : undefined}
          >
            {singleLineText}
          </span>
        </td>
      </tr>
      <tr className={style.details}>
        <td colSpan={Number.MAX_SAFE_INTEGER}>
          {/* Strange hack required to not have table reflow when showing the animated area */}
          <AnimateHeight duration={300} animateOpacity height={showDetails ? "auto" : 0}>
            <div>{expandedContent}</div>
          </AnimateHeight>
        </td>
      </tr>
      <tr className={style.spacerRow}>
        <td colSpan={Number.MAX_SAFE_INTEGER}></td>
      </tr>
    </>
  );
};
