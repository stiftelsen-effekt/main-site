import { useCallback, useMemo } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import * as Plot from "@observablehq/plot";
import AnimateHeight from "react-animate-height";
import { BlockTablesContent } from "../../../../../main/blocks/BlockTable/BlockTablesContent";
import styles from "./CumulativeDonations.module.scss";
import resultsStyle from "../Shared.module.scss";
import { useDebouncedCallback } from "use-debounce";
import { GraphContext } from "../../Shared/GraphContext/GraphContext";

export type DailyDonations = { date: string; sum: string }[];

export const CumulativeDonations: React.FC<{ dailyDonations: DailyDonations }> = ({
  dailyDonations,
}) => {
  const [explenationOpen, setExplenationOpen] = useState(false);
  const [tableDisplayed, setTableDisplayed] = useState(false);
  const graphRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const resizeGraph = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.innerHTML = "";
      setSize({ width: graphRef.current!.clientWidth, height: graphRef.current!.clientHeight });
    }
  }, [graphRef]);
  const debouncedResizeGraph = useDebouncedCallback(() => resizeGraph(), 1000);

  useEffect(() => {
    if (graphRef.current) {
      setSize({ width: graphRef.current.clientWidth, height: graphRef.current.clientHeight });
      window.addEventListener("resize", () => {
        if (graphRef.current) {
          debouncedResizeGraph();
        }
      });
    }
  }, [graphRef]);

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
    () => computeTableContents(cumulativebinneddonations),
    [cumulativebinneddonations],
  );

  const drawGraph = useCallback(
    (
      cumulativeBinnedDonations: { doy: number; cumulativeSum: number; year: number }[],
      yearlyMaxes: any[],
    ) => {
      if (graphRef.current) {
        const plot = Plot.plot({
          width: size.width,
          height: size.height,
          marginLeft: size.width < 760 ? 50 : 0,
          marginRight: size.width < 760 ? 70 : 0,
          style: {
            background: "transparent",
            fontSize: "12px",
            overflow: "visible",
          },
          color: {
            legend: true,
          },
          y: {
            legend: true,
            tickFormat: (t) => Math.round(t / 1000000) + " mill",
            label: null,
            tickSpacing: 100,
            tickSize: 0,
          },
          x: {
            label: null,
          },
          marks: [
            Plot.ruleY([0]),
            Plot.lineY(cumulativeBinnedDonations, {
              x: "doy",
              y: "cumulativeSum",
              z: "year",
              strokeWidth: 1,
            }),
            Plot.gridY({ strokeOpacity: 1, strokeWidth: 0.5, tickSpacing: 100 }),
            Plot.axisX({
              ticks: dayCount
                .map((d) => d + 1)
                .filter((d, i) => (size.width >= 760 ? i : i % 2 === 0)),
              tickFormat: (t, i) => Plot.formatMonth("no-NB")(size.width >= 760 ? i : i * 2),
              textAnchor: "start",
            }),
            Plot.text(yearlyMaxes, {
              y: "adjustedCumulativeSum",
              x: "doy",
              text: (d) => formatEndLabel(d, size.width),
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
                text: (d) => formatEndLabel(d, size.width),
                textAnchor: "start",
                fill: "black",
                stroke: "#fafafa",
                strokeWidth: 5,
                dx: 14,
                fontSize: 12,
              }),
            ),
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
              x2: (d) => d.doy + (size.width < 760 ? 40 : 10),
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
            Plot.tip(
              cumulativeBinnedDonations,
              Plot.pointerX({
                x: "doy",
                y: "cumulativeSum",
                z: "year",
                dx: 60,
                lineHeight: 1.5,
                anchor: "middle",
                textPadding: 12,
                fontSize: 12,
                title: (d) =>
                  `${d.date.toLocaleDateString("no-NB")}\n${d.cumulativeSum.toLocaleString(
                    "no-NB",
                    {
                      style: "currency",
                      currency: "NOK",
                      maximumFractionDigits: 0,
                    },
                  )}`,
              }),
            ),
            Plot.dot(
              cumulativeBinnedDonations,
              Plot.pointerX({
                x: "doy",
                y: "cumulativeSum",
                z: "year",
                fill: "black",
                r: 3,
              }),
            ),
            Plot.ruleX(
              cumulativeBinnedDonations,
              Plot.pointerX({
                x: "doy",
                z: "year",
                stroke: "black",
                strokeWidth: 0.5,
              }),
            ),
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
      <div ref={graphRef} className={styles.graph} />
      <GraphContext
        context={{
          description: "Kumulativt donasjonsvolum per år",
          detailed_description_label: "Se detaljert beskrivelse av grafen",
          detailed_description: [],
          allow_table: true,
          table_label: "Se data som tabell",
          table_close_label: "Skjul tabell",
        }}
        tableContents={tableContents}
      />
    </div>
  );
};

const formatEndLabel = (d: { cumulativeSum: number; year: number }, width: number) => {
  let label = d.year.toString();
  label += "\n";
  if (width < 760) {
    label += (d.cumulativeSum / 1000000).toFixed(2) + " mill";
  } else {
    label += d.cumulativeSum.toLocaleString("no-NB", {
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
    if (i > 0) {
      acc.push(acc[i - 1] + val);
    }
    return acc;
  },
  [0],
);
const daysInYear = Array.from(new Array(366)).map((e, i) => i);

const isLeapYear = (year: number) => {
  if ((year & 3) != 0) return false;
  return year % 100 != 0 || year % 400 == 0;
};

const getDOY = (date: Date) => {
  var mn = date.getMonth();
  var dn = date.getDate();
  var dayOfYear = dayCount[mn] + dn;
  if (mn > 1 && isLeapYear(date.getFullYear())) dayOfYear++;
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
    acc.push({
      date: el.date,
      doy:
        getDOY(el.date) + (!isLeapYear(el.date.getFullYear()) && el.date.getMonth() >= 1 ? 1 : 0),
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
    .filter((y) => y !== 2024)
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

const computeTableContents = (cumulativebinneddonations: CumulativeBinnedDonations) => {
  return {
    rows: [
      {
        _key: "header",
        _type: "row",
        cells: ["Dato (ISO 8601)", "Dag i året", "Kumulativ sum"],
      },
      ...cumulativebinneddonations.map((r) => ({
        _key: r.date.toISOString(),
        _type: "row",
        cells: [r.date.toISOString().split("T")[0], r.doy.toString(), r.cumulativeSum.toFixed(2)],
      })),
    ],
  };
};
