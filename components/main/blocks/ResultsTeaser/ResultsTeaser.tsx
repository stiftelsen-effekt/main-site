import { useEffect, useState } from "react";
import { thousandize } from "../../../../util/formatting";

import styles from "./ResultsTeaser.module.scss";
import Link from "next/link";
import LinkButton from "../../../shared/components/EffektButton/LinkButton";

export const ResultsTeaser: React.FC<{ title: string }> = ({ title }) => {
  // {"status":200,"content":{"totalDonationsToRecommendedOrgs":"94707346.10","numberOfDonors":9873,"lastUpdated":"2024-12-13T05:00:42.000Z"}}
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
      {/* <span>{title}</span> */}
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
