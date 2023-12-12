import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";

const drawChart = (
  data: { x: number; y: number }[],
  lineInput: number,
  lineInputWealthPercentage: number,
  afterDonationWealthPercentage: number,
  donationPercentage: number,
  incomePercentileLabelTemplateString: string,
  afterDonationPercentileLabelTemplateString: string,
  exchangeRate: number,
  size: { width: number | undefined; height: number | undefined },
) => {
  const incomeXPositon = lineInput / 365 / exchangeRate;
  const incomeAfterDonationXPosition = (lineInput * (1 - donationPercentage)) / 365 / 10.5;
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

  const labelLineWidth = 12;
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
  if (lineInput >= 1000) {
    incomeMarkers = [
      Plot.ruleX([incomeXPositon], {
        y: adjustedBelowMax,
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

  const chart = Plot.plot({
    height: size.height,
    width: size.width,
    padding: 20,
    x: {
      type: "log",
      domain: [1000, isMobile ? Math.max(2000000, lineInput) : Math.max(4000000, lineInput)],
      insetRight: lineInput > 900000 && !isMobile ? 180 : 0,
      transform: (dailyIncome: number) => dailyIncome * 365 * 10.5,
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
      }),
      Plot.ruleX([incomeAfterDonationXPosition], {
        strokeDasharray: "4,4",
        y: adjustedMax,
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
  incomePercentileLabelTemplateString: string;
  afterDonationPercentileLabelTemplateString: string;
  size: { width: number | undefined; height: number | undefined };
  exchangeRate: number;
}> = ({
  data,
  lineInput,
  donationPercentage,
  wealthPercentile,
  afterDonationWealthPercentile,
  incomePercentileLabelTemplateString,
  afterDonationPercentileLabelTemplateString,
  size,
  exchangeRate,
}) => {
  const [chart, setChart] = useState<Plot.Plot | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current && !chart) {
      const newChart = drawChart(
        data,
        lineInput,
        wealthPercentile,
        afterDonationWealthPercentile,
        donationPercentage,
        incomePercentileLabelTemplateString,
        afterDonationPercentileLabelTemplateString,
        exchangeRate,
        size,
      );
      svgRef.current.replaceWith(newChart);
      setChart(newChart);
    } else if (svgRef.current && chart) {
      const newChart = drawChart(
        data,
        lineInput,
        wealthPercentile,
        afterDonationWealthPercentile,
        donationPercentage,
        incomePercentileLabelTemplateString,
        afterDonationPercentileLabelTemplateString,
        exchangeRate,
        size,
      );
      (chart as any).replaceWith(newChart);
      setChart(newChart);
    }
  }, [svgRef, lineInput, donationPercentage, size]);

  return (
    <div>
      <svg ref={svgRef} />
    </div>
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
