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
}> = ({
  orgAbriv,
  sumToOrg,
  donationTimestamp,
  precision,
  signalRequiredPrecision,
  configuration,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <tr className={style.overview} data-cy="donation-impact-list-item-overview">
        <td>
          <span className={style.impactOutput} data-cy="donation-impact-list-item-output">
            {thousandize(Math.round(sumToOrg))}
          </span>
        </td>
        <td>
          <div className={style.impactContext}>
            <span className={style.impactDetailsDescription}>
              {" "}
              {configuration.output_subheading_format_string
                .replace("{{sum}}", thousandize(Math.round(sumToOrg)))
                .replace("{{org}}", orgAbriv)}
            </span>
            <span
              className={[style.impactDetailsExpandText, showDetails ? style.expanded : ""].join(
                " ",
              )}
              onClick={() => setShowDetails(!showDetails)}
            >
              {configuration.missing_evaluation_header}
            </span>
          </div>
        </td>
      </tr>
      <tr className={style.details}>
        <td colSpan={Number.MAX_SAFE_INTEGER}>
          {/* Strange hack required to not have table reflow when showing the animated area */}
          <AnimateHeight duration={300} animateOpacity height={showDetails ? "auto" : 0}>
            <div>
              <PortableText value={configuration.missing_impact_evaluation_text} />
            </div>
          </AnimateHeight>
        </td>
      </tr>
      <tr className={style.spacerRow}>
        <td colSpan={Number.MAX_SAFE_INTEGER}></td>
      </tr>
    </>
  );
};
