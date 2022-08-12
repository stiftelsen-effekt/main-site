import React from "react";
import style from "./DonationImpactItem.module.scss";
import { thousandize } from "../../../../util/formatting";
import useSWR from "swr";
import { ImpactEvaluation } from "../../../../models";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const DonationImpactItem: React.FC<{
  orgAbriv: string;
  sumToOrg: number;
  donationTimestamp: Date;
}> = ({ orgAbriv, sumToOrg, donationTimestamp }) => {
  const { data, error, isValidating } = useSWR<{ evaluations: ImpactEvaluation[] }>(
    `https://impact.gieffektivt.no/api/evaluations?charity_abbreviation=${orgAbriv}&currency=NOK&language=NO`,
    fetcher,
  );

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
  const relevantEvaluation = data?.evaluations
    .sort((a, b) => {
      return +new Date(b.start_year, b.start_month) - +new Date(a.start_year, a.start_month);
    })
    .find(
      (e) =>
        e.start_year < donationTimestamp.getFullYear() ||
        (donationTimestamp.getFullYear() === e.start_year &&
          e.start_month <= donationTimestamp.getMonth() + 1),
    );

  if (!relevantEvaluation) {
    return <div>No relevant evaluation found for {orgAbriv}</div>;
  }

  const output = relevantEvaluation
    ? thousandize(Math.round(sumToOrg / relevantEvaluation.converted_cost_per_output))
    : "-";

  return (
    <div className={style.wrapper}>
      <div className={style.chosenEvaluation}>
        <span>Evaluering:</span>
        <span>{relevantEvaluation.start_year}</span>
        <span>
          {new Date(2020, relevantEvaluation.start_month - 1).toLocaleString("no-NB", {
            month: "long",
          })}
        </span>
      </div>
      <div className={style.impact}>
        <h3>{output}</h3>
        <span>{relevantEvaluation.intervention.short_description}</span>
      </div>
    </div>
  );
};
