import { useCallback, useMemo, useRef, useEffect, useState } from "react";
import * as Plot from "@observablehq/plot";
import styles from "./CumulativeDonations.module.scss";
import resultsStyle from "../Shared.module.scss";
import { useDebouncedCallback } from "use-debounce";
import { GraphContext, GraphContextData } from "../../Shared/GraphContext/GraphContext";
import { getRemInPixels } from "../../../../../main/blocks/Paragraph/Citation";
import * as d3 from "d3";
import { DateTime } from "luxon";
import { BarChart2, TrendingUp } from "react-feather";
import { Cumulativedonationstableheaders } from "../../../../../../studio/sanity.types";

export type DailyDonations = { date: string; sum: string }[];

export interface CumulativeDonationsTextConfig {
  millionAbbreviation?: string;
  locale?: string;
  currency?: string;
  textConfig?: {
    normalizeYAxisText?: string;
    directDonationsText?: string;
  };
  showMoreYearsText?: string;
  showFewerYearsText?: string;
  cumulativeChartLabel?: string;
  yearlyChartLabel?: string;
  ytdLabel?: string;
  fullYearLabel?: string;
}

type ChartMode = "cumulative" | "yearly";
type BarScope = "ytd" | "full";
type TransformedDonation = { date: Date; year: number; sum: number };
type CumulativeBinnedDonation = {
  date: Date;
  doy: number;
  year: number;
  cumulativeSum: number;
};
type YearlyTotal = { year: number; full: number; ytd: number };

const CUMULATIVE_DEFAULT_YEARS = 5;
const YEARLY_DEFAULT_YEARS = 10;

export const CumulativeDonations: React.FC<{
  dailyDonations: DailyDonations;
  graphContext: GraphContextData;
  textConfig?: CumulativeDonationsTextConfig;
  tableHeaders?: Cumulativedonationstableheaders;
}> = ({ dailyDonations, graphContext, textConfig, tableHeaders }) => {
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [chartMode, setChartMode] = useState<ChartMode>("cumulative");
  const [barScope, setBarScope] = useState<BarScope>("ytd");
  const [visibleYearCount, setVisibleYearCount] = useState(CUMULATIVE_DEFAULT_YEARS);

  const resizeGraph = useCallback(() => {
    if (graphContainerRef.current && graphRef.current) {
      setSize({ width: graphRef.current.clientWidth, height: graphRef.current.clientHeight });
    }
  }, []);
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
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(transformedDonations.map((d) => d.year))).sort(
      (a, b) => a - b,
    );
    return years;
  }, [transformedDonations]);

  const defaultYearCount =
    chartMode === "cumulative" ? CUMULATIVE_DEFAULT_YEARS : YEARLY_DEFAULT_YEARS;

  useEffect(() => {
    setVisibleYearCount(Math.min(defaultYearCount, availableYears.length || defaultYearCount));
  }, [chartMode, defaultYearCount, availableYears.length]);

  const visibleYears = useMemo(() => {
    const count = Math.min(Math.max(visibleYearCount, 1), availableYears.length || 1);
    return availableYears.slice(-count);
  }, [availableYears, visibleYearCount]);

  const startYear = visibleYears[0];
  const endYear = visibleYears[visibleYears.length - 1];
  const canShowMoreYears = visibleYearCount < availableYears.length;
  const canShowFewerYears = visibleYearCount > Math.min(defaultYearCount, availableYears.length);

  const visibleCumulativeDonations = useMemo(
    () => cumulativebinneddonations.filter((d) => d.year >= startYear),
    [cumulativebinneddonations, startYear],
  );

  const yearlyMaxes = useMemo(
    () => computeYearlyMaxes(visibleCumulativeDonations, size.height),
    [visibleCumulativeDonations, size.height],
  );

  const yearlyTotals = useMemo(
    () => computeYearlyTotals(transformedDonations, getDOY(new Date())),
    [transformedDonations],
  );

  const visibleYearlyTotals = useMemo(
    () => yearlyTotals.filter((d) => d.year >= startYear),
    [yearlyTotals, startYear],
  );

  const tableContents = useMemo(() => {
    if (chartMode === "yearly") {
      return computeYearlyTableContents(visibleYearlyTotals, barScope, textConfig);
    }
    return computeTableContents(visibleCumulativeDonations, tableHeaders);
  }, [
    chartMode,
    visibleCumulativeDonations,
    visibleYearlyTotals,
    barScope,
    tableHeaders,
    textConfig,
  ]);

  const drawGraph = useCallback(() => {
    if (!graphRef.current || size.width === 0 || size.height === 0) return;

    const plot =
      chartMode === "cumulative"
        ? createCumulativePlot({
            data: visibleCumulativeDonations,
            yearlyMaxes,
            size,
            textConfig,
          })
        : createYearlyBarPlot({
            data: visibleYearlyTotals,
            barScope,
            size,
            textConfig,
          });

    graphRef.current.innerHTML = "";
    graphRef.current.appendChild(plot);
  }, [
    chartMode,
    barScope,
    visibleCumulativeDonations,
    visibleYearlyTotals,
    yearlyMaxes,
    size,
    textConfig,
  ]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  const showMoreYearsText = textConfig?.showMoreYearsText || "Vis flere år";
  const showFewerYearsText = textConfig?.showFewerYearsText || "Vis færre år";
  const cumulativeChartLabel = textConfig?.cumulativeChartLabel || "Kumulativ";
  const yearlyChartLabel = textConfig?.yearlyChartLabel || "Per år";
  const ytdLabel = textConfig?.ytdLabel || "Hittil i år";
  const fullYearLabel = textConfig?.fullYearLabel || "Hele året";

  return (
    <div className={resultsStyle.wrapper}>
      <div className={styles.controls}>
        <div className={styles.yearControls}>
          {availableYears.length > 0 && (
            <span className={styles.yearRange}>
              {startYear === endYear ? startYear : `${startYear}–${endYear}`}
            </span>
          )}
          {availableYears.length > defaultYearCount && (
            <>
              <button
                type="button"
                className={styles.yearButton}
                onClick={() =>
                  setVisibleYearCount((count) => Math.min(count + 1, availableYears.length))
                }
                disabled={!canShowMoreYears}
              >
                {showMoreYearsText}
              </button>
              <button
                type="button"
                className={styles.yearButton}
                onClick={() =>
                  setVisibleYearCount((count) => Math.max(count - 1, defaultYearCount))
                }
                disabled={!canShowFewerYears}
              >
                {showFewerYearsText}
              </button>
            </>
          )}
        </div>

        <div className={styles.rightControls}>
          <div className={styles.chartTypeToggle} role="group" aria-label="Diagramtype">
            <button
              type="button"
              className={styles.chartTypeButton}
              aria-pressed={chartMode === "cumulative"}
              aria-label={cumulativeChartLabel}
              title={cumulativeChartLabel}
              onClick={() => setChartMode("cumulative")}
            >
              <TrendingUp />
            </button>
            <button
              type="button"
              className={styles.chartTypeButton}
              aria-pressed={chartMode === "yearly"}
              aria-label={yearlyChartLabel}
              title={yearlyChartLabel}
              onClick={() => setChartMode("yearly")}
            >
              <BarChart2 />
            </button>
          </div>

          {chartMode === "yearly" && (
            <div className={styles.barScopeToggle} role="group" aria-label="Årsvisning">
              <button
                type="button"
                className={styles.barScopeButton}
                aria-pressed={barScope === "ytd"}
                onClick={() => setBarScope("ytd")}
              >
                {ytdLabel}
              </button>
              <button
                type="button"
                className={styles.barScopeButton}
                aria-pressed={barScope === "full"}
                onClick={() => setBarScope("full")}
              >
                {fullYearLabel}
              </button>
            </div>
          )}
        </div>
      </div>

      <div ref={graphContainerRef} className={styles.graphContainer}>
        <div ref={graphRef} className={styles.graph} />
      </div>
      <GraphContext context={graphContext} tableContents={tableContents} />
    </div>
  );
};

const createCumulativePlot = ({
  data,
  yearlyMaxes,
  size,
  textConfig,
}: {
  data: CumulativeBinnedDonation[];
  yearlyMaxes: ReturnType<typeof computeYearlyMaxes>;
  size: { width: number; height: number };
  textConfig?: CumulativeDonationsTextConfig;
}) => {
  const isMobile = size.width < 760;
  const currentYear = new Date().getFullYear();
  const historical = data.filter((d) => d.year !== currentYear);
  const current = data.filter((d) => d.year === currentYear);
  const pageBackground = "#fafafa";

  const tipConfig = isMobile
    ? undefined
    : {
        x: "doy" as const,
        y: "cumulativeSum" as const,
        dx: 60,
        lineHeight: 1.5,
        anchor: "middle" as const,
        textPadding: 12,
        fontSize: 12,
        format: {
          y: false,
          x: false,
          z: false,
        },
        render: (
          index: number[],
          scales: any,
          values: any,
          dimensions: any,
          context: any,
          next: any,
        ) => {
          const path = d3.select(context.ownerSVGElement).selectAll("[aria-label=line] path");
          if (index.length && values.z) {
            const z = values.z[index[0]];
            path
              .style("opacity", 0.2)
              .filter((i: any) => values.z[i[0]] === z)
              .style("opacity", 1)
              .raise();
          } else path.style("opacity", null);
          if (!next) return null;
          return next(index, scales, values, dimensions, context);
        },
      };

  const lineChannels = {
    year: {
      value: (d: CumulativeBinnedDonation) => d.year.toString(),
      label: "",
    },
    cumulativeSum: {
      value: (d: CumulativeBinnedDonation) =>
        Intl.NumberFormat(textConfig?.locale || "no-NB", {
          style: "currency",
          currency: textConfig?.currency || "NOK",
          maximumFractionDigits: 0,
        }).format(d.cumulativeSum),
      label: "",
    },
  };

  return Plot.plot({
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
      tickFormat: (t) => formatMillionTick(t, textConfig),
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
      Plot.lineY(historical, {
        x: "doy",
        y: "cumulativeSum",
        z: "year",
        stroke: "black",
        strokeWidth: 1,
        channels: lineChannels,
        tip: tipConfig,
      }),
      // White outline under the current-year line for contrast against overlapping years
      Plot.lineY(current, {
        x: "doy",
        y: "cumulativeSum",
        z: "year",
        stroke: pageBackground,
        strokeWidth: 6,
        strokeLinejoin: "round",
        strokeLinecap: "round",
      }),
      Plot.lineY(current, {
        x: "doy",
        y: "cumulativeSum",
        z: "year",
        stroke: "black",
        strokeWidth: 2.5,
        strokeLinejoin: "round",
        strokeLinecap: "round",
        channels: lineChannels,
        tip: tipConfig,
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
          Plot.formatMonth(textConfig?.locale || "no-NB")(size.width >= 760 ? i : i * 2).padStart(
            5,
            " ",
          ),
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
        historical,
        Plot.selectLast({
          y: "cumulativeSum",
          x: "doy",
          fill: "black",
          r: 2,
        }),
      ),
      // Halo + larger end-dot for the current year
      Plot.dot(
        current,
        Plot.selectLast({
          y: "cumulativeSum",
          x: "doy",
          fill: pageBackground,
          r: 6,
        }),
      ),
      Plot.dot(
        current,
        Plot.selectLast({
          y: "cumulativeSum",
          x: "doy",
          fill: "black",
          r: 4,
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
        current,
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
        current,
        Plot.selectLast({
          y: "cumulativeSum",
          x: "doy",
          text: (d) => formatEndLabel(d, size.width, textConfig),
          textAnchor: "start",
          fill: "black",
          stroke: pageBackground,
          strokeWidth: 5,
          dx: 14,
          fontSize: 12,
          fontWeight: 600,
        }),
      ),
      ...[
        Plot.ruleX(
          data,
          Plot.pointerX({
            x: "doy",
            z: "year",
            stroke: "black",
            strokeWidth: 0.5,
          }),
        ),
        Plot.dot(
          data,
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
};

const createYearlyBarPlot = ({
  data,
  barScope,
  size,
  textConfig,
}: {
  data: YearlyTotal[];
  barScope: BarScope;
  size: { width: number; height: number };
  textConfig?: CumulativeDonationsTextConfig;
}) => {
  const isMobile = size.width < 760;
  const currentYear = new Date().getFullYear();
  const pageBackground = "#fafafa";
  const values = data.map((d) => ({
    year: d.year,
    value: barScope === "ytd" ? d.ytd : d.full,
    isCurrent: d.year === currentYear,
  }));

  return Plot.plot({
    width: size.width,
    height: size.height,
    marginLeft: isMobile ? 50 : 40,
    marginRight: isMobile ? 20 : 20,
    marginBottom: 40,
    style: {
      background: "transparent",
      fontSize: "12px",
      overflow: "visible",
      fontFamily: "ESKlarheitGrotesk, sans-serif",
    },
    x: {
      label: null,
      type: "band",
      axis: null,
      padding: values.length <= 4 ? 0.35 : values.length >= 9 ? 0.15 : 0.25,
      domain: values.map((d) => d.year.toString()),
    },
    y: {
      label: null,
      nice: true,
      tickFormat: (t) => formatMillionTick(t, textConfig),
      tickSpacing: 80,
      tickSize: 0,
      domain: [0, Math.max(...values.map((d) => d.value), 0) * 1.08],
    },
    marks: [
      Plot.ruleY([0]),
      Plot.gridY({ strokeOpacity: 1, strokeWidth: 0.5, tickSpacing: 80 }),
      Plot.barY(
        values.filter((d) => !d.isCurrent),
        {
          x: (d) => d.year.toString(),
          y: "value",
          fill: "black",
          fillOpacity: 0.35,
          channels: {
            year: { value: (d) => d.year.toString(), label: "" },
            amount: {
              value: (d) => formatCurrency(d.value, textConfig),
              label: "",
            },
          },
          tip: isMobile
            ? undefined
            : {
                format: { y: false, x: false },
              },
        },
      ),
      Plot.barY(
        values.filter((d) => d.isCurrent),
        {
          x: (d) => d.year.toString(),
          y: "value",
          fill: "black",
          channels: {
            year: { value: (d) => d.year.toString(), label: "" },
            amount: {
              value: (d) => formatCurrency(d.value, textConfig),
              label: "",
            },
          },
          tip: isMobile
            ? undefined
            : {
                format: { y: false, x: false },
              },
        },
      ),
      Plot.text(values, {
        x: (d) => d.year.toString(),
        y: "value",
        text: (d) =>
          size.width < 760 || values.length > 8 ? "" : formatMillionTick(d.value, textConfig),
        dy: -8,
        fontSize: 11,
        fill: "black",
        stroke: pageBackground,
        strokeWidth: 3,
      }),
      Plot.axisX({
        tickSize: 0,
        tickPadding: 8,
      }),
    ],
  });
};

const formatMillionTick = (t: number, textConfig?: CumulativeDonationsTextConfig) => {
  const millions = t / 1000000;
  const formatted = millions % 1 === 0 ? millions.toString() : millions.toFixed(1);
  return formatted + " " + (textConfig?.millionAbbreviation || "mill");
};

const formatCurrency = (value: number, textConfig?: CumulativeDonationsTextConfig) =>
  Intl.NumberFormat(textConfig?.locale || "no-NB", {
    style: "currency",
    currency: textConfig?.currency || "NOK",
    maximumFractionDigits: 0,
  }).format(value);

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
      currency: textConfig?.currency || "NOK",
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

const transformDonations = (don: DailyDonations): TransformedDonation[] =>
  don.map((d) => ({
    date: new Date(d.date),
    year: new Date(d.date).getFullYear(),
    sum: parseFloat(d.sum),
  }));

const binDonations = (don: TransformedDonation[]) =>
  don.reduce<CumulativeBinnedDonation[]>((acc, el, i) => {
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

const computeYearlyTotals = (don: TransformedDonation[], currentDoy: number): YearlyTotal[] => {
  const byYear = new Map<number, YearlyTotal>();

  for (const d of don) {
    const entry = byYear.get(d.year) ?? { year: d.year, full: 0, ytd: 0 };
    entry.full += d.sum;
    if (getDOY(d.date) <= currentDoy) {
      entry.ytd += d.sum;
    }
    byYear.set(d.year, entry);
  }

  return Array.from(byYear.values()).sort((a, b) => a.year - b.year);
};

const computeYearlyMaxes = (don: CumulativeBinnedDonation[], height: number) => {
  if (!don.length || height <= 0) return [];

  const firstYear = don[0].year;
  const lastYear = don[don.length - 1].year;
  const allYears = Array.from(new Array(lastYear - firstYear + 1)).map((el, i) => firstYear + i);
  const currentYear = new Date().getFullYear();

  const yearlyMaxes = allYears
    .filter((y) => y !== currentYear)
    .map((y) => {
      const yearDonations = don.filter((d) => d.year === y);
      if (!yearDonations.length) return null;
      const max = yearDonations.reduce((acc, val) =>
        acc.cumulativeSum > val.cumulativeSum ? acc : val,
      );
      return {
        doy: max.doy,
        year: max.year,
        cumulativeSum: max.cumulativeSum,
        adjustedCumulativeSum: max.cumulativeSum,
      };
    })
    .filter((d): d is NonNullable<typeof d> => d !== null)
    .sort((a, b) => a.cumulativeSum - b.cumulativeSum);

  if (!yearlyMaxes.length) return [];

  const maxCumulativeSum = yearlyMaxes.reduce((acc, val) =>
    acc.cumulativeSum > val.cumulativeSum ? acc : val,
  );

  const yScale = maxCumulativeSum.cumulativeSum;
  const labelHeight = (30 / height) * yScale;
  const labelPadding = 0.5 * labelHeight;
  const labelYs = (d: typeof yearlyMaxes[number], i: number, items: typeof yearlyMaxes) => {
    if (i === 0) {
      return d.cumulativeSum;
    }
    if (d.cumulativeSum - items[i - 1].adjustedCumulativeSum < labelHeight + labelPadding) {
      return items[i - 1].adjustedCumulativeSum + labelHeight + labelPadding;
    }
    return d.cumulativeSum;
  };
  yearlyMaxes.forEach((d, i) => {
    d.adjustedCumulativeSum = labelYs(d, i, yearlyMaxes);
  });
  return yearlyMaxes;
};

const computeTableContents = (
  cumulativebinneddonations: CumulativeBinnedDonation[],
  headers?: Cumulativedonationstableheaders,
) => {
  return {
    rows: [
      {
        _key: "header",
        _type: "row",
        cells: [
          headers?.date || "Dato (ISO 8601)",
          headers?.day_of_year || "Dag i året",
          headers?.cumulative_sum || "Kumulativ sum",
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

const computeYearlyTableContents = (
  yearlyTotals: YearlyTotal[],
  barScope: BarScope,
  textConfig?: CumulativeDonationsTextConfig,
) => {
  const valueHeader =
    barScope === "ytd"
      ? textConfig?.ytdLabel || "Hittil i år"
      : textConfig?.fullYearLabel || "Hele året";

  return {
    rows: [
      {
        _key: "header",
        _type: "row",
        cells: ["År", valueHeader],
      },
      ...yearlyTotals.map((r) => ({
        _key: r.year.toString(),
        _type: "row",
        cells: [r.year.toString(), (barScope === "ytd" ? r.ytd : r.full).toFixed(2)],
      })),
    ],
  };
};
