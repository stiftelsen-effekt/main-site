import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";

const drawChart = (
  data: { x: number; y: number }[],
  lineInput: number,
  lineInputWealthPercentage: number,
  donationPercentage: number,
  size: { width: number | undefined; height: number | undefined },
) => {
  const incomeXPositon = lineInput / 365 / 10;
  const incomeAfterDonationXPosition = (lineInput * (1 - donationPercentage)) / 365 / 10;
  const dataMax = Math.max(...data.map((d) => d.y));

  let incomeMarkers: any[] = [];
  if (lineInput >= 1000) {
    incomeMarkers = [
      Plot.ruleX([incomeXPositon], { y: dataMax * 1.15 }),

      Plot.text(
        [
          `Deg i dag, blant de ${lineInputWealthPercentage.toLocaleString(
            "no-NB",
          )}% rikeste i verden`,
        ],
        {
          lineWidth: 10,
          lineHeight: 1.3,
          textAnchor: "start",
          frameAnchor: "top",
          x: incomeXPositon,
          y: dataMax * 1.15,
          dx: "10",
          background: "var(--secondary)",
        },
      ),
      Plot.text([`Deg om du donerte ${Math.round(donationPercentage * 100)}% av inntekten din`], {
        lineWidth: 10,
        lineHeight: 1.3,
        textAnchor: "start",
        frameAnchor: "top",
        x: incomeAfterDonationXPosition,
        y: dataMax * 1.3,
        dx: "10",
        style: {
          background: "var(--secondary)",
        },
        paddingRight: 10,
      }),
    ];
  }

  const chart = Plot.plot({
    height: size.height,
    width: size.width,
    x: {
      type: "log",
      domain: [1000, Math.max(2000000, lineInput)],
      label: `Årsinntekt i kroner (logaritmisk skala) →`,
      insetRight: lineInput > 1000000 ? 100 : 0,
      transform: (dailyIncome: number) => dailyIncome * 365 * 10,
    },
    y: {
      axis: null,
    },
    style: {
      background: "var(--secondary)",
    },
    marks: [
      Plot.areaY(data, {
        curve: "natural",
        x: "x",
        y: "y",
        range: [0, incomeXPositon],
      }),
      Plot.ruleX([incomeAfterDonationXPosition], { strokeDasharray: "4,4", y: dataMax * 1.3 }),
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
  size: { width: number | undefined; height: number | undefined };
}> = ({ data, lineInput, donationPercentage, wealthPercentile, size }) => {
  const [chart, setChart] = useState(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current && !chart) {
      const newChart = drawChart(data, lineInput, wealthPercentile, donationPercentage, size);
      svgRef.current.replaceWith(newChart);
      setChart(newChart);
    } else if (svgRef.current && chart) {
      const newChart = drawChart(data, lineInput, wealthPercentile, donationPercentage, size);
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
