import { useEffect, useState } from "react";
import { thousandize } from "../../../../util/formatting";

import styles from "./ResultsTeaser.module.scss";
import LinkButton from "../../../shared/components/EffektButton/LinkButton";
import { NavLink } from "../../../shared/components/Navbar/Navbar";

export const ResultsTeaser: React.FC<{
  title: string;
  sumSubtitle?: string;
  donorsSubtitle?: string;
  seeMoreButton?: NavLink;
  locale: string;
}> = ({ title, sumSubtitle, donorsSubtitle, seeMoreButton, locale }) => {
  const [data, setData] = useState<{
    totalDonationsToRecommendedOrgs: string;
    numberOfDonors: number;
    lastUpdated: string;
  } | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_EFFEKT_API}/results/headline`)
      .then((response) => response.json())
      .then((data) => setData(data.content))
      .catch(console.error);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div>
          <span className={styles.headlineNumber}>
            {thousandize(
              Math.round(parseFloat(data?.totalDonationsToRecommendedOrgs ?? "0")),
              locale,
            )}{" "}
            kr
          </span>
          <span>{sumSubtitle}</span>
        </div>

        <div>
          <span className={styles.headlineNumber}>
            {thousandize(data?.numberOfDonors ?? 0, locale)}
          </span>
          <span>{donorsSubtitle}</span>
        </div>
        {seeMoreButton && seeMoreButton.slug && (
          <div>
            <LinkButton
              url={"/" + seeMoreButton.slug}
              title={seeMoreButton.title || "See more"}
            ></LinkButton>
          </div>
        )}
      </div>
    </div>
  );
};
