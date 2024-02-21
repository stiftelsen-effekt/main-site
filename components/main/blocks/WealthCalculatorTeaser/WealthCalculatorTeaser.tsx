import styles from "./WealthCalculatorTeaser.module.scss";

import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import { AreaChart } from "../../../shared/components/Graphs/Area/AreaGraph";
import { wealthMountainGraphData } from "../WealthCalculator/data";
import { PortableText } from "@portabletext/react";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
import Link from "next/link";
import { useRouterContext } from "../../../../context/RouterContext";
import { calculateWealthPercentile } from "../WealthCalculator/_util";
import {
  AdjustedPPPFactorResult,
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
  xAxisLabel: string;
  locale: string;
}> = ({
  title,
  description,
  link,
  medianIncome,
  incomePercentileLabelTemplateString,
  afterDonationPercentileLabelTemplateString,
  xAxisLabel,
  locale,
}) => {
  const { articlesPagePath } = useRouterContext();

  const [chartSize, setChartSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });
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
    } else {
      console.error("Unsupported locale", locale);
    }
  }, [setPppConversion]);

  const outputRef = useRef<HTMLDivElement>(null);

  const updateSizing = () => {
    if (outputRef.current) {
      if (window && window.innerWidth > 1180) {
        setChartSize({
          width: outputRef.current.offsetWidth,
          height: 0,
        });
        setTimeout(() => {
          if (outputRef.current) {
            setChartSize({
              width: outputRef.current.offsetWidth,
              height: outputRef.current.offsetHeight,
            });
          } else {
            setChartSize({
              width: chartSize.width || 640,
              height: chartSize.width || 640,
            });
          }
        }, 1);
      } else {
        setChartSize({
          width: outputRef.current.offsetWidth,
          height: outputRef.current.offsetWidth,
        });
      }
    }
  };

  useEffect(() => {
    debouncedSizingUpdate();
  }, [outputRef]);

  const debouncedSizingUpdate = useDebouncedCallback(() => updateSizing(), 1000, {
    maxWait: 1000,
    trailing: true,
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", debouncedSizingUpdate);
    }
  }, []);

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
              passHref
            >
              <a>
                <EffektButton onClick={() => {}}>{link.title}</EffektButton>
              </a>
            </Link>
          </div>
        </div>
        <div className={styles.graph} ref={outputRef}>
          <AreaChart
            data={wealthMountainGraphData}
            lineInput={medianIncome}
            donationPercentage={0.1}
            wealthPercentile={calculateWealthPercentile(
              wealthMountainGraphData,
              medianIncome,
              pppConversion.adjustedPPPfactor,
            )}
            afterDonationWealthPercentile={calculateWealthPercentile(
              wealthMountainGraphData,
              medianIncome * 0.9,
              pppConversion.adjustedPPPfactor,
            )}
            incomePercentileLabelTemplateString={incomePercentileLabelTemplateString}
            afterDonationPercentileLabelTemplateString={afterDonationPercentileLabelTemplateString}
            size={chartSize}
            adjustedPPPConversionFactor={pppConversion.adjustedPPPfactor}
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
          passHref
        >
          <a>
            <EffektButton onClick={() => {}} fullWidth>
              {link.title}
            </EffektButton>
          </a>
        </Link>
      </div>
    </div>
  );
};
