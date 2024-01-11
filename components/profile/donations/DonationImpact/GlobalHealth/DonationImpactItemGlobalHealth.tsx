import React, { useEffect, useState } from "react";
import style from "./DonationImpactItemGlobalHealth.module.scss";
import { thousandize, thousandizeString } from "../../../../../util/formatting";
import useSWR from "swr";
import { ImpactEvaluation } from "../../../../../models";
import AnimateHeight from "react-animate-height";
import { Links } from "../../../../main/blocks/Links/Links";
import { PortableText } from "@portabletext/react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export type ImpactItemConfiguration = {
  output_subheading_format_string: string;
  missing_evaluation_header: string;
  missing_impact_evaluation_text: any[];
  about_org_link_title_format_string: string;
  about_org_link_url_format_string: string;
  currency: string;
  locale: string;
};

export const DonationImpactGlobalHealthItem: React.FC<{
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
  const { data, error, isValidating } = useSWR<{ evaluations: ImpactEvaluation[] }>(
    `https://impact.gieffektivt.no/api/evaluations?charity_abbreviation=${orgAbriv}&currency=${
      configuration.currency
    }&language=${
      configuration.locale
    }&donation_year=${donationTimestamp.getFullYear()}&donation_month=${
      donationTimestamp.getMonth() + 1
    }`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
  const [showDetails, setShowDetails] = useState(false);
  const [requiredPrecision, setRequiredPrecision] = useState(0);

  useEffect(() => {
    if (precision < requiredPrecision) {
      signalRequiredPrecision(requiredPrecision);
    }
  }, [precision, requiredPrecision]);

  if (!data || isValidating) {
    return (
      <tr key={`loading`}>
        <td>Loading...</td>
      </tr>
    );
  }
  if (error) {
    return (
      <tr key={`error`}>
        <td>{error}</td>
      </tr>
    );
  }
  /**
   * Sort evaluations by start time
   * Then return the first evaluation that has a start year and month less than or equal to the donation
   * This will be the most recent relevant evaluation to calculate the impact
   */
  const relevantEvaluation = data?.evaluations[0];

  if (!relevantEvaluation) {
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
  }

  const output = sumToOrg / relevantEvaluation.converted_cost_per_output;

  let tmpRequiredPrecision = 0;
  while (parseFloat(output.toFixed(tmpRequiredPrecision)) === 0 && tmpRequiredPrecision < 3) {
    tmpRequiredPrecision += 1;
  }
  if (requiredPrecision < tmpRequiredPrecision) {
    setRequiredPrecision(tmpRequiredPrecision);
  }

  const formattedOutput = thousandizeString(
    (Math.round(output * Math.pow(10, requiredPrecision)) / Math.pow(10, requiredPrecision))
      .toFixed(precision)
      .replace(/\./, ","),
  );

  return (
    <>
      <tr className={style.overview} data-cy="donation-impact-list-item-overview">
        <td>
          <span className={style.impactOutput} data-cy="donation-impact-list-item-output">
            {formattedOutput}
          </span>
        </td>
        <td>
          <div className={style.impactContext}>
            <span className={style.impactDetailsDescription}>
              {relevantEvaluation.intervention.short_description}
            </span>
            <span
              className={[style.impactDetailsExpandText, showDetails ? style.expanded : ""].join(
                " ",
              )}
              onClick={() => setShowDetails(!showDetails)}
            >
              {configuration.output_subheading_format_string
                .replace("{{sum}}", thousandize(Math.round(sumToOrg)))
                .replace("{{org}}", relevantEvaluation.charity.charity_name)}
            </span>
          </div>
        </td>
      </tr>
      <tr className={style.details}>
        <td colSpan={Number.MAX_SAFE_INTEGER}>
          {/* Strange hack required to not have table reflow when showing the animated area */}
          <AnimateHeight duration={300} animateOpacity height={showDetails ? "auto" : 0}>
            <div>
              <p>{relevantEvaluation.intervention.long_description}</p>
              <div>
                <Links
                  links={[
                    {
                      _type: "link",
                      _key: "charity_description",
                      title: configuration.about_org_link_title_format_string.replace(
                        "{{org}}",
                        relevantEvaluation.charity.charity_name,
                      ),
                      url: configuration.about_org_link_url_format_string
                        .replace("{{org}}", relevantEvaluation.charity.charity_name)
                        .replaceAll(" ", "_"),
                      newtab: true,
                    },
                  ]}
                />
              </div>
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
