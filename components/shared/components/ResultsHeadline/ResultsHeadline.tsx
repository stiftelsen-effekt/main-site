import { DateTime } from "luxon";
import { thousandize } from "../../../../util/formatting";
import styles from "./ResultsHeadline.module.scss";

export type ResultsHadlineNumbers = {
  totalDonationsToRecommendedOrgs: number;
  numberOfDonors: number;
  lastUpdated: string;
};

export const ResultsHeadline = ({
  headlineNumbers,
  totalOutputs,
}: {
  headlineNumbers: ResultsHadlineNumbers;
  totalOutputs: {
    name: string;
    outputs: number;
  }[];
}) => {
  const formattedLastUpdated = DateTime.fromISO(headlineNumbers.lastUpdated).toFormat(
    "dd.MM.yyyy HH:mm",
  );

  return (
    <div className={styles.wrapper}>
      <h1>{thousandize(Math.floor(headlineNumbers.totalDonationsToRecommendedOrgs))} kr</h1>
      <div className={styles.subheader}>
        <p className={styles.donorcount}>
          samlet inn fra {thousandize(headlineNumbers.numberOfDonors)} givere
        </p>
        <p className={styles.lastupdated}>sist oppdatert {formattedLastUpdated}</p>
      </div>

      <div className={styles.outputs}>
        Vi estimerer at dette har resultert i distribusjon av{" "}
        {totalOutputs
          .slice(0, totalOutputs.length - 1)
          .map((output) => `${thousandize(Math.floor(output.outputs))} ${output.name}`)
          .join(", ")}{" "}
        og {thousandize(Math.floor(totalOutputs[totalOutputs.length - 1].outputs))}{" "}
        {totalOutputs[totalOutputs.length - 1].name}.
      </div>
    </div>
  );
};
