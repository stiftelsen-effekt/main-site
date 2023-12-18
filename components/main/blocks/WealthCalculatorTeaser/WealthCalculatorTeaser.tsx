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

export const WealthCalculatorTeaser: React.FC<{
  title: string;
  description: any[];
  link: NavLink;
  medianIncome: number;
  incomePercentileLabelTemplateString: string;
  afterDonationPercentileLabelTemplateString: string;
}> = ({
  title,
  description,
  link,
  medianIncome,
  incomePercentileLabelTemplateString,
  afterDonationPercentileLabelTemplateString,
}) => {
  const { articlesPagePath } = useRouterContext();

  const [chartSize, setChartSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });
  const [adjustedPPPConversionFactor, setAdjustedPPPConversionFactor] = useState<number>(1);

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

  const debouncedSizingUpdate = useDebouncedCallback(() => updateSizing(), 100, {
    maxWait: 100,
    trailing: true,
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", debouncedSizingUpdate);
    }
  }, []);

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
              adjustedPPPConversionFactor,
            )}
            afterDonationWealthPercentile={calculateWealthPercentile(
              wealthMountainGraphData,
              medianIncome * 0.9,
              adjustedPPPConversionFactor,
            )}
            incomePercentileLabelTemplateString={incomePercentileLabelTemplateString}
            afterDonationPercentileLabelTemplateString={afterDonationPercentileLabelTemplateString}
            size={chartSize}
            adjustedPPPConversionFactor={adjustedPPPConversionFactor}
          />
        </div>
      </div>
      <div className={styles.axislabel}>
        <span>Årsinntekt i kroner (logaritmisk skala) →</span>
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
