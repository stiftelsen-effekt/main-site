import React, { useEffect, useState } from "react";
import style from "./DonationImpactItemGlobalHealth.module.scss";
import { thousandize, thousandizeString } from "../../../../../util/formatting";
import useSWR from "swr";
import { ImpactEvaluation } from "../../../../../models";
import AnimateHeight from "react-animate-height";
import { LinkType, Links } from "../../../../main/blocks/Links/Links";
import { PortableText } from "@portabletext/react";
import { NavLink } from "../../../../shared/components/Navbar/Navbar";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const DEFAULT_GIVEWELL_ALL_GRANTS_TEXT =
  "All Grants Fund lar GiveWells eksperter investere i de mest lovende mulighetene på tvers av deres arbeid. Fordi fondet kombinerer både velprøvde og mer eksperimentelle tiltak, oppnår det høyere forventet effekt enn fokus på færre, kjente interventioner alene. Fondet støtter for eksempel utrulling av nye malariavaksiner i Afrika og prosesser som kan få nye legemidler raskere ut til dem som trenger det. Når du donerer til All Grants Fund, stoler du på GiveWells analysekompetanse, og får maksimal effekt per krone.";

const DEFAULT_GIVEWELL_ALL_GRANTS_LINKS: LinkType[] = [
  {
    _type: "link",
    _key: "givewell-all-grants-fund",
    title: "Les mer hos GiveWell",
    url: "https://www.givewell.org/all-grants-fund",
    newtab: true,
  },
];

export type ImpactItemConfiguration = {
  output_subheading_format_string: string;
  missing_evaluation_header: string;
  missing_impact_evaluation_text: any[];
  about_org_link_title_format_string: string;
  about_org_link_url_format_string: string;
  currency: string;
  locale: string;
  givewell_all_grants_fund_header?: string;
  givewell_all_grants_fund_text?: any[];
  givewell_all_grants_fund_links?: (LinkType | NavLink)[];
};

const renderGiveWellAllGrantsFundContent = (configuration: ImpactItemConfiguration) => {
  const customText = configuration.givewell_all_grants_fund_text;
  const customLinks = configuration.givewell_all_grants_fund_links;
  const linksToRender =
    customLinks && customLinks.length > 0 ? customLinks : DEFAULT_GIVEWELL_ALL_GRANTS_LINKS;

  return (
    <>
      {customText && customText.length > 0 ? (
        <PortableText value={customText} />
      ) : (
        <p>{DEFAULT_GIVEWELL_ALL_GRANTS_TEXT}</p>
      )}
      {linksToRender.length > 0 && <Links links={linksToRender} />}
    </>
  );
};

export const DonationImpactGlobalHealthItem: React.FC<{
  orgAbriv: string;
  orgName: string;
  sumToOrg: number;
  donationTimestamp: Date;
  precision: number;
  signalRequiredPrecision: (precision: number) => void;
  configuration: ImpactItemConfiguration;
}> = ({
  orgAbriv,
  orgName,
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
  const isGiveWellAllGrantsFund = orgAbriv === "AGF";
  const missingEvaluationHeader = isGiveWellAllGrantsFund
    ? configuration.givewell_all_grants_fund_header ?? configuration.missing_evaluation_header
    : configuration.missing_evaluation_header;

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
                  .replace("{{org}}", orgName)}
              </span>
              <span
                className={[style.impactDetailsExpandText, showDetails ? style.expanded : ""].join(
                  " ",
                )}
                onClick={() => setShowDetails(!showDetails)}
              >
                {missingEvaluationHeader}
              </span>
            </div>
          </td>
        </tr>
        <tr className={style.details}>
          <td colSpan={Number.MAX_SAFE_INTEGER}>
            {/* Strange hack required to not have table reflow when showing the animated area */}
            <AnimateHeight duration={300} animateOpacity height={showDetails ? "auto" : 0}>
              <div>
                {isGiveWellAllGrantsFund
                  ? renderGiveWellAllGrantsFundContent(configuration)
                  : configuration.missing_impact_evaluation_text && (
                      <PortableText value={configuration.missing_impact_evaluation_text} />
                    )}
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
