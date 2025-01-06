import { useEffect, useState } from "react";
import { thousandize } from "../../../../util/formatting";

import styles from "./ResultsTeaser.module.scss";
import LinkButton from "../../../shared/components/EffektButton/LinkButton";

export const ResultsTeaser: React.FC<{ title: string }> = ({ title }) => {
  const [data, setData] = useState<{
    totalDonationsToRecommendedOrgs: string;
    numberOfDonors: number;
    lastUpdated: string;
  } | null>(null);

  useEffect(() => {
    fetch("https://data.gieffektivt.no/results/headline")
      .then((response) => response.json())
      .then((data) => setData(data.content))
      .catch(console.error);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div>
          <span className={styles.headlineNumber}>
            {thousandize(Math.round(parseFloat(data?.totalDonationsToRecommendedOrgs ?? "0")))} kr
          </span>
          <span>til effektiv bistand</span>
        </div>

        <div>
          <span className={styles.headlineNumber}>{thousandize(data?.numberOfDonors ?? 0)}</span>
          <span>givere</span>
        </div>
        <div>
          <LinkButton url="/resultater" title="Se resultater"></LinkButton>
        </div>
      </div>
    </div>
  );
};
