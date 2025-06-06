import { useCallback, useMemo } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import * as Plot from "@observablehq/plot";
import styles from "./CumulativeDonations.module.scss";
import resultsStyle from "../Shared.module.scss";
import { useDebouncedCallback } from "use-debounce";
import { GraphContext, GraphContextData } from "../../Shared/GraphContext/GraphContext";
import { getRemInPixels } from "../../../../../main/blocks/Paragraph/Citation";
import * as d3 from "d3";
import { DateTime } from "luxon";
export type DailyDonations = { date: string; sum: string }[];

export interface CumulativeDonationsTextConfig {
  millionAbbreviation?: string;
  locale?: string;
  tableText?: {
    dateColumnHeader?: string;
    dayOfYearColumnHeader?: string;
    cumulativeSumColumnHeader?: string;
  };
}

export const CumulativeDonations: React.FC<{
  dailyDonations: DailyDonations;
  graphContext: GraphContextData;
  textConfig?: CumulativeDonationsTextConfig;
}> = ({ dailyDonations, graphContext, textConfig }) => {
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const resizeGraph = useCallback(() => {
    if (graphContainerRef.current) {
      setSize({ width: graphRef.current!.clientWidth, height: graphRef.current!.clientHeight });
    }
  }, [graphContainerRef.current]);
  const debouncedResizeGraph = useDebouncedCallback(() => resizeGraph(), 1000, { trailing: true });

  useEffect(() => {
    if (graphContainerRef.current) {
      setSize({
        width: graphContainerRef.current.clientWidth,
        height: graphContainerRef.current.clientHeight,
      });
      const resizeObserver = new ResizeObserver((entries) => {
        const newWidth = entries[0].contentRect.width;
        if (newWidth !== size.width) {
          debouncedResizeGraph();
        }
      });

      resizeGraph();
      resizeObserver.observe(graphContainerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [graphContainerRef.current]);

  const transformedDonations = useMemo(() => transformDonations(dailyDonations), [dailyDonations]);
  const cumulativebinneddonations = useMemo(
    () => binDonations(transformedDonations),
    [transformedDonations],
  );
  const yearlyMaxes = useMemo(
    () => computeYearlyMaxes(cumulativebinneddonations, size.height),
    [cumulativebinneddonations, size],
  );
  const tableContents = useMemo(
    () => computeTableContents(cumulativebinneddonations, textConfig?.tableText),
    [cumulativebinneddonations, textConfig?.tableText],
  );

  const drawGraph = useCallback(
    (
      cumulativeBinnedDonations: { doy: number; cumulativeSum: number; year: number }[],
      yearlyMaxes: any[],
    ) => {
      if (graphRef.current) {
        const isMobile = size.width < 760;

        const plot = Plot.plot({
          width: size.width,
          height: size.height,
          marginLeft: isMobile ? 50 : 0,
          marginRight: isMobile ? 70 : 0,
          style: {
            background: "transparent",
            fontSize: "12px",
            overflow: "visible",
            fontFamily: "ESKlarheitGrotesk, sans-serif",
          },
          color: {
            legend: true,
          },
          y: {
            legend: true,
            tickFormat: (t) =>
              Math.round(t / 1000000) + " " + (textConfig?.millionAbbreviation || "mill"),
            label: null,
            tickSpacing: 100,
            tickSize: 0,
          },
          x: {
            label: null,
            domain: [0, 366],
          },
          marks: [
            Plot.ruleY([0]),
            Plot.lineY(cumulativeBinnedDonations, {
              x: "doy",
              y: "cumulativeSum",
              z: "year",
              strokeWidth: 1,
              channels: {
                year: {
                  value: (d) => d.year.toString(),
                  label: "",
                },
                cumulativeSum: {
                  value: (d) =>
                    Intl.NumberFormat(textConfig?.locale || "no-NB", {
                      style: "currency",
                      currency: "NOK",
                      maximumFractionDigits: 0,
                    }).format(d.cumulativeSum),
                  label: "",
                },
              },
              tip: isMobile
                ? undefined
                : {
                    x: "doy",
                    y: "cumulativeSum",
                    dx: 60,
                    lineHeight: 1.5,
                    anchor: "middle",
                    textPadding: 12,
                    fontSize: 12,
                    format: {
                      y: false,
                      x: false,
                      z: false,
                    },
                    render: (index, scales, values, dimensions, context, next) => {
                      // Filter and highlight the paths with the same *z* as the hovered point.
                      const path = d3
                        .select(context.ownerSVGElement)
                        .selectAll("[aria-label=line] path");
                      if (index.length && values.z) {
                        const z = values.z[index[0]];
                        path
                          .style("stroke", "#ccc")
                          .filter((i: any) => (values as any).z[i[0]] === z)
                          .style("stroke", null)
                          .raise();
                      } else path.style("stroke", null);
                      if (!next) return null;
                      return next(index, scales, values, dimensions, context);
                    },
                  },
            }),
            Plot.gridY({ strokeOpacity: 1, strokeWidth: 0.5, tickSpacing: 100 }),
            Plot.axisX({
              ticks: [
                0,
                ...dayCount
                  .map((d) => d)
                  .filter((d, i) => (size.width >= 760 ? i : i % 2 === 0 && i > 1)),
              ],
              tickFormat: (t, i) =>
                Plot.formatMonth(textConfig?.locale || "no-NB")(
                  size.width >= 760 ? i : i * 2,
                ).padStart(5, " "),
              textAnchor: "start",
              tickSize: getRemInPixels(),
              tickPadding: -getRemInPixels() * 0.7,
            }),
            Plot.dot(yearlyMaxes, {
              y: "cumulativeSum",
              x: "doy",
              fill: "black",
              r: 2,
            }),
            Plot.dot(
              cumulativeBinnedDonations,
              Plot.selectLast({
                y: "cumulativeSum",
                x: "doy",
                fill: "black",
                r: 2,
              }),
            ),
            Plot.link(yearlyMaxes, {
              y1: "cumulativeSum",
              y2: "adjustedCumulativeSum",
              x1: "doy",
              x2: (d) =>
                d.doy + (size.width < 760 ? Math.round(10 + (size.width - 760) * (20 / -385)) : 10),
              dx: 5,
              strokeWidth: 0.5,
            }),
            Plot.link(
              cumulativeBinnedDonations,
              Plot.selectLast({
                y1: "cumulativeSum",
                y2: "cumulativeSum",
                x1: "doy",
                x2: (d) => d.doy + 2,
                dx: 5,
                strokeWidth: 0.5,
              }),
            ),
            Plot.text(yearlyMaxes, {
              y: "adjustedCumulativeSum",
              x: "doy",
              text: (d) => formatEndLabel(d, size.width, textConfig),
              textAnchor: "start",
              dx: size.width < 760 ? 30 : 35,
              fontSize: 12,
              lineHeight: 1.2,
            }),
            Plot.text(
              cumulativeBinnedDonations,
              Plot.selectLast({
                y: "cumulativeSum",
                x: "doy",
                text: (d) => formatEndLabel(d, size.width, textConfig),
                textAnchor: "start",
                fill: "black",
                stroke: "#fafafa",
                strokeWidth: 5,
                dx: 14,
                fontSize: 12,
              }),
            ),

            ...[
              Plot.ruleX(
                cumulativeBinnedDonations,
                Plot.pointerX({
                  x: "doy",
                  z: "year",
                  stroke: "black",
                  strokeWidth: 0.5,
                }),
              ),
              Plot.dot(
                cumulativeBinnedDonations,
                Plot.pointerX({
                  x: "doy",
                  y: "cumulativeSum",
                  z: "doy",
                  fill: "black",
                  r: 3,
                  px: "doy",
                  maxRadius: 10,
                }),
              ),
            ].filter((d) => (isMobile ? false : d)),
          ],
        });
        graphRef.current.innerHTML = "";
        graphRef.current.appendChild(plot);
      }
    },
    [graphRef, size],
  );

  useEffect(() => {
    drawGraph(cumulativebinneddonations, yearlyMaxes);
  }, [cumulativebinneddonations, yearlyMaxes, drawGraph]);

  return (
    <div className={resultsStyle.wrapper}>
      <div ref={graphContainerRef} className={styles.graphContainer}>
        <div ref={graphRef} className={styles.graph} />
      </div>
      <GraphContext context={graphContext} tableContents={tableContents} />
    </div>
  );
};

const formatEndLabel = (
  d: { cumulativeSum: number; year: number },
  width: number,
  textConfig?: CumulativeDonationsTextConfig,
) => {
  let label = d.year.toString();
  label += "\n";
  if (width < 760) {
    label +=
      (d.cumulativeSum / 1000000).toFixed(2) + " " + (textConfig?.millionAbbreviation || "mill");
  } else {
    label += d.cumulativeSum.toLocaleString(textConfig?.locale || "no-NB", {
      style: "currency",
      currency: "NOK",
      maximumFractionDigits: 0,
    });
  }
  return label;
};

const getDaysInMonth = (leap: boolean) => {
  return [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
};

const dayCount = getDaysInMonth(true).reduce(
  (acc, val, i) => {
    if (i !== 11) {
      acc.push(acc[i] + val);
    }
    return acc;
  },
  [0],
);

const getDOY = (date: Date) => {
  var mn = date.getMonth();
  var dn = date.getDate();
  var dayOfYear = dayCount[mn] + dn - 1;
  return dayOfYear;
};

const transformDonations = (don: any[]) =>
  don.map((d) => ({
    date: new Date(d.date),
    year: new Date(d.date).getFullYear(),
    sum: parseFloat(d.sum),
  }));

type CumulativeBinnedDonations = { date: Date; doy: number; year: number; cumulativeSum: number }[];

const binDonations = (don: any[]) =>
  don.reduce<CumulativeBinnedDonations>((acc, el, i) => {
    let sum = el.sum;
    if (i > 0 && acc[acc.length - 1].year === el.year) {
      sum += acc[acc.length - 1].cumulativeSum;
    }
    // Add missing datapoint if there is a gap in the data
    const currentDoy = getDOY(el.date);

    const prevIndex = acc.length - 1;

    if (prevIndex >= 0) {
      const gap = currentDoy - acc[prevIndex].doy;

      if (gap > 1) {
        for (let i = 1; i < gap; i++) {
          const date = DateTime.fromJSDate(el.date)
            .minus({ days: gap - i })
            .toJSDate();
          acc.push({
            date: date,
            doy: currentDoy - gap + i,
            year: el.year,
            cumulativeSum: acc[prevIndex].cumulativeSum,
          });
        }
      }
    }

    acc.push({
      date: el.date,
      doy: getDOY(el.date),
      year: el.year,
      cumulativeSum: sum,
    });
    return acc;
  }, []);

const computeYearlyMaxes = (don: any[], height: number) => {
  const firstYear = don[0].year;
  const lastYear = don[don.length - 1].year;
  const allYears = Array.from(new Array(lastYear - firstYear + 1)).map((el, i) => firstYear + i);

  const yearlyMaxes = allYears
    .filter((y) => y !== new Date().getFullYear())
    .map((y) => {
      const max = don
        .filter((d) => d.year === y)
        .reduce((acc, val) => (acc.cumulativeSum > val.cumulativeSum ? acc : val));
      return {
        doy: max.doy,
        year: max.year,
        cumulativeSum: max.cumulativeSum,
        adjustedCumulativeSum: max.cumulativeSum,
      };
    })
    .sort((a, b) => a.cumulativeSum - b.cumulativeSum);
  const maxCumulativeSum = yearlyMaxes.reduce((acc, val) =>
    acc.cumulativeSum > val.cumulativeSum ? acc : val,
  );

  const yScale = maxCumulativeSum.cumulativeSum;
  const labelHeight = (30 / height) * yScale;
  const labelPadding = 0.5 * labelHeight;
  const labelYs = (d: any, i: number, yearlyMaxes: any) => {
    if (i === 0) {
      return d.cumulativeSum;
    }
    if (d.cumulativeSum - yearlyMaxes[i - 1].adjustedCumulativeSum < labelHeight + labelPadding) {
      return yearlyMaxes[i - 1].adjustedCumulativeSum + labelHeight + labelPadding;
    }
    return d.cumulativeSum;
  };
  yearlyMaxes.forEach((d, i) => {
    d.adjustedCumulativeSum = labelYs(d, i, yearlyMaxes);
  });
  return yearlyMaxes;
};

const computeTableContents = (
  cumulativebinneddonations: CumulativeBinnedDonations,
  tableText?: {
    dateColumnHeader?: string;
    dayOfYearColumnHeader?: string;
    cumulativeSumColumnHeader?: string;
  },
) => {
  return {
    rows: [
      {
        _key: "header",
        _type: "row",
        cells: [
          tableText?.dateColumnHeader || "Dato (ISO 8601)",
          tableText?.dayOfYearColumnHeader || "Dag i året",
          tableText?.cumulativeSumColumnHeader || "Kumulativ sum",
        ],
      },
      ...cumulativebinneddonations.map((r) => ({
        _key: r.date.toISOString(),
        _type: "row",
        cells: [r.date.toISOString().split("T")[0], r.doy.toString(), r.cumulativeSum.toFixed(2)],
      })),
    ],
  };
};
