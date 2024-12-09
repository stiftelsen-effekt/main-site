import * as Plot from "@observablehq/plot";
import { useCallback, useEffect, useRef, useState } from "react";
import { getRemInPixels } from "../../../../main/blocks/Paragraph/Citation";
import { useDebouncedCallback } from "use-debounce";
import styles from "./AreaGraph.module.scss";

const drawChart = (
  data: { x: number; y: number }[],
  lineInput: number,
  lineInputWealthPercentage: number,
  afterDonationWealthPercentage: number,
  donationPercentage: number,
  incomePercentileLabelTemplateString: string,
  afterDonationPercentileLabelTemplateString: string,
  adjustedPPPConversionFactor: number,
  periodAdjustment: WealthCalculatorPeriodAdjustment,
  size: { width: number | undefined; height: number | undefined },
) => {
  const incomeXPositon = lineInput / periodAdjustment / adjustedPPPConversionFactor;
  const incomeAfterDonationXPosition =
    (lineInput * (1 - donationPercentage)) / periodAdjustment / adjustedPPPConversionFactor;
  const dataMax = Math.max(...data.map((d) => d.y));
  // Browser window width smaller than or equal to 1180px
  const isMobile = window.innerWidth <= 1180;

  const wealthPercentileText = convertNumberToBoldText(lineInputWealthPercentage, true);
  const donationPercentageText = (donationPercentage * 100).toLocaleString("no-NB") + "%";
  const afterDonationWealthPercentileText = convertNumberToBoldText(
    afterDonationWealthPercentage,
    true,
  );

  const afterDonationLabel = afterDonationPercentileLabelTemplateString
    .replace("{percentile}", afterDonationWealthPercentileText)
    .replace("{donationpercentage}", donationPercentageText);

  const incomePercentileLabel = incomePercentileLabelTemplateString
    .replace("{percentile}", wealthPercentileText)
    .replace("{donationpercentage}", donationPercentageText);

  const labelLineWidth = 13;
  const labelLineNumber = Math.round(
    afterDonationLabel.length / (labelLineWidth * 1.5) +
      incomePercentileLabel.length / (labelLineWidth * 1.5),
  );

  const requiredMarginTopAsPercentage = size.height
    ? (getBrowserRemSizeInPx(0.8) * 1.3 * labelLineNumber) /
      (size.height - getBrowserRemSizeInPx(0.7) * 1.2 * 2)
    : 0.4;

  const adjustedMax = dataMax / (1 - requiredMarginTopAsPercentage);
  const numberOfLinesInChart = 6 / requiredMarginTopAsPercentage;
  const adjustedBelowMax = adjustedMax * ((numberOfLinesInChart - 4) / numberOfLinesInChart);

  let incomeMarkers: any[] = [];
  if (lineInput >= 2.7 * periodAdjustment) {
    incomeMarkers = [
      Plot.ruleX([incomeXPositon], {
        y: adjustedBelowMax,
        ariaHidden: "true",
      }),

      Plot.text([incomePercentileLabel], {
        lineWidth: labelLineWidth,
        lineHeight: 1.3,
        textAnchor: isMobile ? "end" : "start",
        frameAnchor: "top",
        fontSize: getBrowserRemSizeInPx(0.8),
        fontFamily: "ESKlarheitGrotesk",
        stroke: "var(--secondary)",
        fill: "var(--primary)",
        paintOrder: "stroke",
        strokeWidth: 10,
        x: incomeXPositon,
        y: adjustedBelowMax,
        dx: isMobile ? -10 : 10,
      }),
      Plot.text([afterDonationLabel], {
        lineWidth: labelLineWidth,
        lineHeight: 1.3,
        textAnchor: isMobile ? "end" : "start",
        frameAnchor: "top",
        fontSize: getBrowserRemSizeInPx(0.8),
        fontFamily: "ESKlarheitGrotesk",
        x: incomeAfterDonationXPosition,
        y: adjustedMax,
        dx: isMobile ? -10 : 10,
      }),
    ];
  }

  const domainLower = 2.6 * periodAdjustment;
  const domainUpper = isMobile
    ? Math.max(5480 * periodAdjustment, lineInput)
    : Math.max(8219 * periodAdjustment, lineInput);
  const shouldInsetRight = lineInput > 2465 * periodAdjustment && !isMobile;

  const chart = Plot.plot({
    height: size.height,
    width: size.width,
    marginTop: isMobile ? getRemInPixels() * 3 : 0,
    padding: 20,
    x: {
      type: "log",
      domain: [domainLower, domainUpper],
      insetRight: shouldInsetRight ? 180 : 0,
      transform: (dailyIncome: number) =>
        dailyIncome * periodAdjustment * adjustedPPPConversionFactor,
      label: null,
    },
    y: {
      axis: null,
    },
    style: {
      background: "var(--secondary)",
      fontSize: "0.7rem",
      fontFamily: "ESKlarheitGrotesk",
      fill: "var(--primary)",
    },
    marks: [
      Plot.areaY(data, {
        curve: "natural",
        x: "x",
        y: "y",
        ariaHidden: "true",
      }),
      Plot.ruleX([incomeAfterDonationXPosition], {
        strokeDasharray: "4,4",
        y: adjustedMax,
        ariaHidden: "true",
      }),
      ...incomeMarkers,
    ],
  });

  return chart;
};

export const AreaChart: React.FC<{
  data: { x: number; y: number }[];
  lineInput: number;
  donationPercentage: number;
  wealthPercentile: number;
  afterDonationWealthPercentile: number;
  label?: string;
  incomePercentileLabelTemplateString: string;
  afterDonationPercentileLabelTemplateString: string;
  adjustedPPPConversionFactor: number;
  periodAdjustment: WealthCalculatorPeriodAdjustment;
}> = ({
  data,
  lineInput,
  donationPercentage,
  wealthPercentile,
  afterDonationWealthPercentile,
  label,
  incomePercentileLabelTemplateString,
  afterDonationPercentileLabelTemplateString,
  adjustedPPPConversionFactor,
  periodAdjustment,
}) => {
  const outputRef = useRef<HTMLDivElement>(null);

  const drawGraph = useCallback(() => {
    if (outputRef.current) {
      if (!outputRef.current.parentElement) {
        return;
      }

      /**
       * Get width from parent element
       */
      outputRef.current.innerHTML = "";
      const width = outputRef.current.parentElement.clientWidth;
      const height = outputRef.current.parentElement.clientHeight - 1;

      const size = {
        width: width,
        height: height,
      };

      const chart = drawChart(
        data,
        lineInput,
        wealthPercentile,
        afterDonationWealthPercentile,
        donationPercentage,
        incomePercentileLabelTemplateString,
        afterDonationPercentileLabelTemplateString,
        adjustedPPPConversionFactor,
        periodAdjustment,
        size,
      );

      outputRef.current.appendChild(chart);
    }
  }, [outputRef, lineInput, donationPercentage]);

  const debouncedDrawGraph = useDebouncedCallback(drawGraph, 100, {
    trailing: true,
  });

  useEffect(() => {
    drawGraph();
  }, [outputRef, lineInput, donationPercentage]);

  useEffect(() => {
    if (outputRef.current && outputRef.current.parentElement) {
      const observer = new ResizeObserver((entries) => {
        debouncedDrawGraph();
      });

      observer.observe(outputRef.current.parentElement);
    }
  }, [outputRef, debouncedDrawGraph]);

  return (
    <>
      {label ? <span className={styles.label}>{label}</span> : null}
      <div ref={outputRef}></div>
    </>
  );
};

const convertNumberToBoldText = (number: number, percentage: boolean = false) => {
  const str = number.toLocaleString("no-NB");
  const split = str.split("");
  let result = "";

  for (let i = 0; i < split.length; i++) {
    const char = split[i];
    // 0 to 9 are located at utf code U+03e2 and upwards, with comma trailing after 9 and % after comma
    switch (char) {
      case "0":
        result += "Ϣ";
        break;
      case "1":
        result += "ϣ";
        break;
      case "2":
        result += "Ϥ";
        break;
      case "3":
        result += "ϥ";
        break;
      case "4":
        result += "Ϧ";
        break;
      case "5":
        result += "ϧ";
        break;
      case "6":
        result += "Ϩ";
        break;
      case "7":
        result += "ϩ";
        break;
      case "8":
        result += "Ϫ";
        break;
      case "9":
        result += "ϫ";
        break;
      case ",":
        result += "Ϭ";
        break;
      default:
        result += char;
    }
  }

  if (percentage) {
    result += "ϭ";
  }

  return result;
};

const getBrowserRemSizeInPx = (rems: number = 1) => {
  return rems * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

export enum WealthCalculatorPeriodAdjustment {
  MONTHLY = 365 / 12,
  YEARLY = 365,
}
