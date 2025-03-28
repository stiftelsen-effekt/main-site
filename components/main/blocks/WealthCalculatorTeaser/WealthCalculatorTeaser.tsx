import styles from "./WealthCalculatorTeaser.module.scss";

import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import {
  AreaChart,
  WealthCalculatorPeriodAdjustment,
} from "../../../shared/components/Graphs/Area/AreaGraph";
import { wealthMountainGraphData } from "../WealthCalculator/data";
import { PortableText } from "@portabletext/react";
import { useEffect, useState } from "react";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
import Link from "next/link";
import { useRouterContext } from "../../../../context/RouterContext";
import { calculateWealthPercentile } from "../WealthCalculator/_util";
import {
  AdjustedPPPFactorResult,
  getDanishAdjustedPPPconversionFactor,
  getNorwegianAdjustedPPPconversionFactor,
  getSwedishAdjustedPPPconversionFactor,
} from "../WealthCalculator/_queries";

export const WealthCalculatorTeaser: React.FC<{
  title: string;
  description: any[];
  link: NavLink;
  medianIncome: number;
  incomePercentileLabelTemplateString: string;
  afterDonationPercentileLabelTemplateString: string;
  periodAdjustment: WealthCalculatorPeriodAdjustment;
  xAxisLabel: string;
  locale: string;
}> = ({
  title,
  description,
  link,
  medianIncome,
  incomePercentileLabelTemplateString,
  afterDonationPercentileLabelTemplateString,
  periodAdjustment,
  xAxisLabel,
  locale,
}) => {
  const { articlesPagePath } = useRouterContext();
  const [pppConversion, setPppConversion] = useState<AdjustedPPPFactorResult | undefined>();

  /**
   * Get the adjusted PPP conversion factor for the locale.
   */
  useEffect(() => {
    if (locale === "no") {
      getNorwegianAdjustedPPPconversionFactor().then((res) => {
        setPppConversion(res);
      });
    } else if (locale === "sv") {
      getSwedishAdjustedPPPconversionFactor().then((res) => {
        setPppConversion(res);
      });
    } else if (locale === "dk") {
      getDanishAdjustedPPPconversionFactor().then((res) => {
        setPppConversion(res);
      });
    } else {
      console.error("Unsupported locale", locale);
    }
  }, [setPppConversion]);

  if (!pppConversion) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.description}>
          <h3>{title}</h3>
          <div className={styles.descriptionText}>
            <PortableText value={description} />
          </div>
          <div className={styles.desktopButton}>
            <Link
              href={
                link.pagetype === "article_page"
                  ? `/${[...articlesPagePath, link.slug].join("/")}`
                  : `/${link.slug}`
              }
            >
              <EffektButton onClick={() => {}}>{link.title}</EffektButton>
            </Link>
          </div>
        </div>
        <div className={styles.graph}>
          <AreaChart
            data={wealthMountainGraphData}
            lineInput={medianIncome}
            donationPercentage={0.1}
            wealthPercentile={calculateWealthPercentile(
              wealthMountainGraphData,
              medianIncome,
              periodAdjustment,
              pppConversion.adjustedPPPfactor,
            )}
            afterDonationWealthPercentile={calculateWealthPercentile(
              wealthMountainGraphData,
              medianIncome * 0.9,
              periodAdjustment,
              pppConversion.adjustedPPPfactor,
            )}
            incomePercentileLabelTemplateString={incomePercentileLabelTemplateString}
            afterDonationPercentileLabelTemplateString={afterDonationPercentileLabelTemplateString}
            adjustedPPPConversionFactor={pppConversion.adjustedPPPfactor}
            periodAdjustment={periodAdjustment}
          />
        </div>
      </div>
      <div className={styles.axislabel}>
        <span>{xAxisLabel} →</span>
      </div>
      <div className={styles.mobileButton}>
        <Link
          href={
            link.pagetype === "article_page"
              ? `/${[...articlesPagePath, link.slug].join("/")}`
              : `/${link.slug}`
          }
        >
          <EffektButton onClick={() => {}} fullWidth>
            {link.title}
          </EffektButton>
        </Link>
      </div>
    </div>
  );
};
