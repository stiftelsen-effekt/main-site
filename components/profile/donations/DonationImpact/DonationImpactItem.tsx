import React, { useEffect } from "react";
import style from "./DonationImpactItem.module.scss";
import { thousandize } from "../../../../util/formatting";
import useSWR from "swr";
import { ImpactEvaluation } from "../../../../models";
import AnimateHeight from "react-animate-height";
import { Links } from "../../../main/blocks/Links/Links";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const DonationImpactItem: React.FC<{
  orgAbriv: string;
  sumToOrg: number;
  donationTimestamp: Date;
  precision: number;
  signalRequiredPrecision: (precision: number) => void;
}> = ({ orgAbriv, sumToOrg, donationTimestamp, precision, signalRequiredPrecision }) => {
  const { data, error, isValidating } = useSWR<{ evaluations: ImpactEvaluation[] }>(
    `https://impact.gieffektivt.no/api/evaluations?charity_abbreviation=${orgAbriv}&currency=NOK&language=NO&donation_year=${donationTimestamp.getFullYear()}&donation_month=${
      donationTimestamp.getMonth() + 1
    }`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
  const [showDetails, setShowDetails] = React.useState(false);

  if (!data || isValidating) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  /**
   * Sort evaluations by start time
   * Then return the first evaluation that has a start year and month less than or equal to the donation
   * This will be the most recent relevant evaluation to calculate the impact
   */
  const relevantEvaluation = data?.evaluations[0];

  if (!relevantEvaluation) {
    return <div>No relevant evaluation found for {orgAbriv}</div>;
  }

  const output = sumToOrg / relevantEvaluation.converted_cost_per_output;

  let requiredPrecision = 0;
  while (parseFloat(output.toFixed(requiredPrecision)) === 0 && requiredPrecision < 3) {
    console.log("increasing precision for " + orgAbriv);
    requiredPrecision += 1;
  }

  if (requiredPrecision > precision) {
    signalRequiredPrecision(requiredPrecision);
  }

  const formattedOutput = (
    Math.round(output * Math.pow(10, requiredPrecision)) / Math.pow(10, requiredPrecision)
  )
    .toFixed(precision)
    .replace(/\./, ",");

  return (
    <>
      <tr className={style.overview} data-cy="donation-impact-list-item-overview">
        <td>
          <h2 data-cy="donation-impact-list-item-output">{formattedOutput}</h2>
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
              {`${thousandize(Math.round(sumToOrg))} kr til ${
                relevantEvaluation.charity.charity_name
              }`}
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
              <p>
                Tallene er basert på analysene til GiveWell. De gir et omtrentlig bilde på hva våre
                anbefalte organisasjoner får ut av pengene. Alle tre tiltak er topp anbefalt som de
                mest kostnadseffektive måtene å redde liv eller forbedre den økonomiske situasjonen
                til ekstremt fattige. Mange bistandsorganisasjoner viser til overdrevne og
                misvisende tall i sin markedsføring. Bak våre tall ligger tusenvis av timer med
                undersøkelser og inkluderer alle kostnader, inkludert planlegging, innkjøp,
                distribusjon, opplæring og kontroll.
              </p>
              <div>
                <Links
                  links={[
                    {
                      _type: "link",
                      _key: "giveWell",
                      title: "Om " + relevantEvaluation.charity.charity_name,
                      url:
                        "https://gieffektivt.no/organizations#" +
                        relevantEvaluation.charity.charity_name.replaceAll(" ", "_"),
                      newtab: true,
                    },
                    {
                      _type: "link",
                      _key: "giveWell",
                      title: "GiveWell’s analyser",
                      url: "https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models",
                      newtab: true,
                    },
                  ]}
                />
              </div>
              <div className={style.chosenEvaluation}>
                <span>Evaluering: </span>
                <span>{relevantEvaluation.start_year} </span>
                <span>
                  {new Date(2020, relevantEvaluation.start_month - 1).toLocaleString("no-NB", {
                    month: "long",
                  })}
                </span>
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
