import { DateTime } from "luxon";
import { thousandize } from "../../../../util/formatting";
import styles from "./ResultsHeadline.module.scss";

export type ResultsHadlineNumbers = {
  totalDonationsToRecommendedOrgs: number;
  numberOfDonors: number;
  lastUpdated: string;
};

export interface ResultsHeadlineTextConfig {
  currencySymbol?: string;
  collectedFromDonorsText?: string;
  lastUpdatedText?: string;
  impactEstimateText?: string;
  andText?: string;
  locale?: string;
}

export const ResultsHeadline = ({
  headlineNumbers,
  totalOutputs,
  textConfig,
}: {
  headlineNumbers: ResultsHadlineNumbers;
  totalOutputs: {
    name: string;
    outputs: number;
  }[];
  textConfig?: ResultsHeadlineTextConfig;
}) => {
  const formattedLastUpdated = DateTime.fromISO(headlineNumbers.lastUpdated).toFormat(
    "dd.MM.yyyy HH:mm",
  );

  const currencySymbol = textConfig?.currencySymbol || "kr";
  const collectedFromDonorsText =
    textConfig?.collectedFromDonorsText || "samlet inn fra {count} givere";
  const lastUpdatedText = textConfig?.lastUpdatedText || "sist oppdatert {date}";
  const impactEstimateText =
    textConfig?.impactEstimateText || "Vi estimerer at dette har resultert i distribusjon av";
  const andText = textConfig?.andText || "og";

  return (
    <div className={styles.wrapper}>
      <h1>
        {thousandize(
          Math.floor(headlineNumbers.totalDonationsToRecommendedOrgs),
          textConfig?.locale,
        )}{" "}
        {currencySymbol}
      </h1>
      <div className={styles.subheader}>
        <p className={styles.donorcount}>
          {collectedFromDonorsText.replace(
            "{count}",
            thousandize(headlineNumbers.numberOfDonors, textConfig?.locale),
          )}
        </p>
        <p className={styles.lastupdated}>
          {lastUpdatedText.replace("{date}", formattedLastUpdated)}
        </p>
      </div>

      <div className={styles.outputs}>
        {impactEstimateText}{" "}
        {totalOutputs
          .slice(0, totalOutputs.length - 1)
          .map(
            (output) =>
              `${thousandize(Math.floor(output.outputs), textConfig?.locale)} ${output.name}`,
          )
          .join(", ")}{" "}
        {andText}{" "}
        {thousandize(Math.floor(totalOutputs[totalOutputs.length - 1].outputs), textConfig?.locale)}{" "}
        {totalOutputs[totalOutputs.length - 1].name}.
      </div>
    </div>
  );
};
