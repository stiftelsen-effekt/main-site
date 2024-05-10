import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Plot from "@observablehq/plot";
import styles from "./ITNCoverageGraph.module.scss";
import { useDebouncedCallback } from "use-debounce";

export const ITNCoverageGraph: React.FC<{ year: number }> = ({ year }) => {
  const container = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // Helper function to interpolate the mean values between years
  const interpolateData = (year: number, data: DataType[]) => {
    // Sort data by year to ensure correct interpolation
    data.sort((a, b) => a.year - b.year);

    for (let i = 0; i < data.length - 1; i++) {
      if (year >= data[i].year && year <= data[i + 1].year) {
        const range = data[i + 1].year - data[i].year;
        const progress = (year - data[i].year) / range;
        const interpolatedMean = data[i].mean + progress * (data[i + 1].mean - data[i].mean);
        const interpolatedYear =
          new Date(data[i].year, 0, 1).getTime() +
          progress *
            (new Date(data[i + 1].year, 0, 1).getTime() - new Date(data[i].year, 0, 1).getTime());
        return {
          date: new Date(interpolatedYear),
          mean: interpolatedMean,
        };
      }
    }
    return null;
  };

  const resizeGraph = useCallback(() => {
    if (container.current) {
      container.current.innerHTML = "";
      setSize({ width: container.current!.clientWidth, height: container.current!.clientHeight });
      drawGraph();
    }
  }, [container]);
  const debouncedResizeGraph = useDebouncedCallback(() => resizeGraph(), 1000);

  useEffect(() => {
    if (container.current) {
      setSize({ width: container.current.clientWidth, height: container.current.clientHeight });
      window.addEventListener("resize", () => {
        if (container.current) {
          debouncedResizeGraph();
        }
      });
    }
  }, [container]);

  const drawGraph = useCallback(() => {
    if (container.current) {
      const interpolated = interpolateData(year, data);

      const chart = Plot.plot({
        y: {
          ticks: [0, 20, 40, 60],
          tickSize: 0,
          domain: [0, 70],
          label: null,
          fontVariant: "normal",
          tickPadding: 15,
          tickFormat: (d) => `${d} %`,
        },
        x: { domain: [new Date(2010, 0, 1), new Date(2020, 1, 1)], ticks: 0 },
        width: size.width,
        height: size.height,
        marginLeft: window.innerWidth < 1180 ? window.innerWidth * 0.025 + 2 * getRemInPixels() : 0,
        marginRight: window.innerWidth < 1180 ? getRemInPixels() * 1.5 : 0,
        marginTop: window.innerWidth < 1180 ? getRemInPixels() * 2 : 0,
        marginBottom: window.innerWidth < 1180 ? getRemInPixels() * 2 : 0,
        insetLeft: window.innerWidth < 1180 ? window.innerWidth * 0.025 : 0,
        insetRight: window.innerWidth < 1180 ? window.innerWidth * 0.025 : 0,
        insetTop: 0,
        insetBottom: 0,
        style: { fontSize: "14", fontFamily: "ES Klarheit Grotesk", overflow: "visible" },
        marks: [
          Plot.gridY({ strokeOpacity: 1, strokeWidth: 0.5, ticks: [0, 20, 40, 60] }),
          Plot.line(data, {
            x: (d) => new Date(d.year, 0, 1),
            y: "mean",
            strokeWidth: 2,
          }),
          Plot.differenceY(data, {
            x: (d) => new Date(d.year, 0, 1),
            y1: "mean",
            y2: "upper",
            strokeWidth: 0.5,
            positiveFill: "none",
            strokeDasharray: "3 5",
          }),
          Plot.differenceY(data, {
            x: (d) => new Date(d.year, 0, 1),
            y1: "mean",
            y2: "lower",
            strokeWidth: 0.5,
            negativeFill: "none",
            strokeDasharray: "3 5",
          }),
          Plot.ruleX([0]),
          Plot.ruleY([0]),
          Plot.dot([interpolated], {
            x: "date",
            y: "mean",
            r: 4,
            fill: "black",
          }),
          Plot.text([interpolated], {
            x: "date",
            y: "mean",
            text: (d) => `${d.mean.toFixed(2)} %`,
            dx: 0,
            dy: -20,
            fontSize: 14,
            stroke: "#fafafa",
            strokeWidth: 6,
            fill: "black",
          }),
        ],
      });

      container.current.innerHTML = "";
      container.current.appendChild(chart);
    }
  }, [container, year, size]);

  useEffect(() => {
    if (container.current) {
      drawGraph();
    }
  }, [drawGraph, year]);

  return <div ref={container} className={styles.container}></div>;
};

type DataType = { year: number; lower: number; mean: number; upper: number };
const data: DataType[] = [
  {
    year: 2010,
    lower: 10.59327,
    mean: 20.8687,
    upper: 34.95015,
  },
  {
    year: 2011,
    lower: 14.96702,
    mean: 26.40105,
    upper: 40.21835,
  },
  {
    year: 2012,
    lower: 17.26394,
    mean: 29.05685,
    upper: 42.62767,
  },
  {
    year: 2013,
    lower: 18.14808,
    mean: 30.2207,
    upper: 44.12958,
  },
  {
    year: 2014,
    lower: 20.4809,
    mean: 33.7168,
    upper: 48.23245,
  },
  {
    year: 2015,
    lower: 23.6821,
    mean: 37.45777,
    upper: 51.43118,
  },
  {
    year: 2016,
    lower: 23.00667,
    mean: 38.57214,
    upper: 53.98943,
  },
  {
    year: 2017,
    lower: 24.79315,
    mean: 41.28997,
    upper: 57.10448,
  },
  {
    year: 2018,
    lower: 25.49276,
    mean: 39.52068,
    upper: 53.3367,
  },
  {
    year: 2019,
    lower: 21.58723,
    mean: 37.44549,
    upper: 53.58392,
  },
  {
    year: 2020,
    lower: 9.89164,
    mean: 35.24156,
    upper: 62.31916,
  },
];

const getRemInPixels = () => parseFloat(getComputedStyle(document.documentElement).fontSize);
