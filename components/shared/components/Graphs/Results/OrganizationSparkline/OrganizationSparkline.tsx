import { useCallback, useMemo } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import textures from "textures";
import { thousandize } from "../../../../../../util/formatting";
import styles from "./OrganizationSparkline.module.scss";
import { useDebouncedCallback } from "use-debounce";
import { TransformedMonthlyDonationsPerOutput } from "../../../ResultsOutput/ResultsOutput";
import { useIsMobile } from "../../../../../../hooks/useIsMobile";

export const OrganizationSparkline: React.FC<{
  transformedMonthlyDonationsPerOutput: TransformedMonthlyDonationsPerOutput;
  maxY?: number;
  startYear: number;
  locale: string;
}> = ({ transformedMonthlyDonationsPerOutput, maxY, startYear, locale }) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const innerGraph = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [requiredWidth, setRequiredWidth] = useState<null | number>(null);
  const [startYearIndex, setStartYearIndex] = useState(0);
  const isMobile = useIsMobile();

  const resizeGraph = useCallback(() => {
    if (innerGraph.current && graphRef.current) {
      innerGraph.current.innerHTML = "";
      setSize({ width: graphRef.current!.clientWidth, height: graphRef.current!.clientHeight });
    }
  }, [graphRef, innerGraph]);
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

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const allYears = useMemo(() => {
    return Array.from(new Array(currentYear + 1 - startYear), (x, i) => ({
      period: new Date(startYear + i, 0, 1),
      y: 0,
    }));
  }, [currentYear]);

  // Calculate visible years for desktop
  const yearsPerPage = useMemo(() => {
    if (isMobile || !size.width) return allYears.length;
    const requiredWidthPerYear = getRemInPixels() * 3;
    return Math.floor(size.width / requiredWidthPerYear);
  }, [isMobile, size.width, allYears.length]);

  // Set initial view to most recent years and handle resize cases
  useEffect(() => {
    if (startYearIndex + yearsPerPage < allYears.length) {
      setStartYearIndex(Math.max(0, allYears.length - yearsPerPage));
    }
  }, [yearsPerPage, allYears.length]);

  const visibleYears = useMemo(() => {
    if (isMobile) return allYears;
    return allYears.slice(startYearIndex, startYearIndex + yearsPerPage);
  }, [isMobile, allYears, startYearIndex, yearsPerPage]);

  const isAtStart = startYearIndex === 0;
  const isAtEnd = startYearIndex + yearsPerPage >= allYears.length;

  const handlePrevClick = useCallback(() => {
    setStartYearIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNextClick = useCallback(() => {
    setStartYearIndex((prev) => Math.min(prev + 1, allYears.length - yearsPerPage));
  }, [allYears.length, yearsPerPage]);

  const drawGraph = useCallback(
    (data: TransformedMonthlyDonationsPerOutput) => {
      if (graphRef.current && innerGraph.current) {
        // Create thresholds based on visible years
        const years = isMobile ? allYears : visibleYears;
        const thresholds = [...years.map((y) => y.period)];

        // Always add the next year for the last threshold
        if (years.length > 0) {
          const lastYear = years[years.length - 1].period.getFullYear();
          thresholds.push(new Date(lastYear + 1, 0, 1));
        }

        const requiredWidthPerYear = getRemInPixels() * 3;
        const requiredWidth = years.length * requiredWidthPerYear;

        if (isMobile && requiredWidth > size.width) {
          setRequiredWidth(requiredWidth);
        } else {
          setRequiredWidth(null);
        }

        // Filter data to only include data for visible years
        const filteredData = !isMobile
          ? data.filter((d) => {
              const year = new Date(d.period).getFullYear();
              return (
                year >= years[0].period.getFullYear() &&
                year <= years[years.length - 1].period.getFullYear()
              );
            })
          : data;

        let plotConfig: Plot.PlotOptions = {
          width: !isMobile ? size.width : requiredWidth > size.width ? requiredWidth : size.width,
          height: size.height,
          color: {
            domain: ["direct", "smartDistribution"],
            range: [
              "#000",
              textures.circles().lighter().stroke("#000").background("#fafafa").size(5).id("dots"),
            ],
            tickFormat(t, i) {
              if (t === "direct") return "Direkte fra donorer";
              if (t === "smartDistribution") return "Fordelt via smart fordeling";
              return t;
            },
            type: "ordinal",
          },
          marginRight: 0,
          marginLeft: 0,
          marginBottom: window.innerWidth < 1180 ? getRemInPixels() * 1.5 : 0,
          insetLeft: window.innerWidth < 1180 ? window.innerWidth * 0.025 : 0,
          insetRight: window.innerWidth < 1180 ? window.innerWidth * 0.025 : 0,
          y: {
            label: null,
            labelAnchor: "top",
            nice: true,
          },
          x: {
            domain: !isMobile
              ? [years[0].period, thresholds[thresholds.length - 1]]
              : [new Date(allYears[0].period.getFullYear(), 0, 1), new Date(currentYear + 1, 0, 1)],
            ticks: [],
            label: null,
          },
          style: {
            background: "transparent",
            fontSize: getRemInPixels() * 0.6 + "px",
            overflow: "visible",
            fontFamily: "ESKlarheitGrotesk",
          },
          marks: [
            Plot.ruleY([0]),
            Plot.rectY(
              filteredData,
              Plot.binX(
                { y: "sum" },
                {
                  x: "period",
                  y: "sum",
                  thresholds: thresholds,
                  fill: "via",
                  stroke: "black",
                  insetLeft: getRemInPixels() * 0.5,
                  insetRight: getRemInPixels() * 0.5,
                },
              ) as any,
            ),
            Plot.text(
              filteredData,
              Plot.binX({ y: "sum" }, {
                x: "period",
                y: "sum",
                thresholds: thresholds,
                stroke: "#fafafa",
                strokeWidth: 5,
                fill: "black",
                text: (d: any) =>
                  formatShortSum(
                    d.reduce((acc: number, el: any) => acc + el.sum, 0),
                    locale,
                  ),
                dy: -15,
              } as any),
            ),
            // Full unrounded when hovering using Plot.pointerX
            Plot.text(
              filteredData,
              Plot.pointerX(
                Plot.binX({ y: "sum" }, {
                  x: "period",
                  y: "sum",
                  thresholds: thresholds,
                  stroke: "#fafafa",
                  strokeWidth: 20,
                  fontWeight: "bold",
                  fill: "black",
                  text: (d: any) =>
                    thousandize(
                      Math.round(d.reduce((acc: number, el: any) => acc + el.sum, 0)),
                      locale,
                    ),
                  dy: -15,
                } as any),
              ),
            ),
            Plot.text(years, {
              // X is middle of the year to center it under bar
              x: (d) => new Date(d.period.getFullYear(), 6, 1),
              y: "y",
              text: (d) => d.period.getFullYear().toString(),
              dy: 15,
            }),
            // Bold year when hovering using Plot.pointerX
            Plot.text(
              years,
              Plot.pointerX({
                x: (d) => new Date(d.period.getFullYear(), 6, 1),
                y: "y",
                text: (d) => d.period.getFullYear().toString(),
                dy: 15,
                fontWeight: "bold",
              }),
            ),
            Plot.axisY({
              anchor: "right",
              tickFormat: (d) => {
                if (d === 0) return "0";
                return formatTick(d, locale);
              },
            }),
          ],
        };

        if (maxY) {
          plotConfig.y = {
            ...plotConfig.y,
            domain: [0, maxY],
          };
        }

        const range = (plotConfig.color?.range as any).slice();

        if (range) {
          ((plotConfig.color as any).range as any[]).forEach(
            (texture, i) =>
              texture.url && (((plotConfig.color as any).range as any)[i] = texture.url()),
          );
        }

        const plot = Plot.plot(plotConfig);

        innerGraph.current.innerHTML = "";
        innerGraph.current.appendChild(plot);
      }
    },
    [
      graphRef,
      innerGraph,
      size,
      maxY,
      visibleYears,
      allYears,
      isMobile,
      currentYear,
      startYearIndex,
      yearsPerPage,
    ],
  );

  useEffect(() => {
    drawGraph(transformedMonthlyDonationsPerOutput);
  }, [transformedMonthlyDonationsPerOutput, drawGraph]);

  useEffect(() => {
    if (isMobile && graphRef.current && requiredWidth) {
      graphRef.current.scrollTo({ left: Number.MAX_SAFE_INTEGER });
    }
  }, [graphRef, requiredWidth, isMobile]);

  return (
    <div className={styles.graphWrapper}>
      {!isMobile && (
        <div className={styles.yearNavigation}>
          <button
            onClick={handlePrevClick}
            className={styles.navButton}
            style={{ opacity: isAtStart ? 0.3 : 0.7 }}
            disabled={isAtStart}
          >
            ←
          </button>
          <button
            onClick={handleNextClick}
            className={styles.navButton}
            style={{ opacity: isAtEnd ? 0.3 : 0.7 }}
            disabled={isAtEnd}
          >
            →
          </button>
        </div>
      )}
      <div ref={graphRef} className={styles.graph}>
        <div
          ref={innerGraph}
          className={styles.innerGraph}
          style={{ width: requiredWidth ?? undefined }}
        ></div>
      </div>
      {isMobile && requiredWidth && (
        <div className={styles.swipeHint}>
          <span>←</span> <i>Sveip for å se hele grafen</i>
        </div>
      )}
    </div>
  );
};

export const OrganizationSparklineLegend: React.FC<{
  textConfig?: {
    directDonationsText?: string;
    smartDistributionText?: string;
    locale?: string;
  };
}> = ({ textConfig }) => {
  const legendRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (legendRef.current) {
      const plotConfig: Plot.PlotOptions = {
        color: {
          domain: ["direct", "smartDistribution"],
          range: [
            "#000",
            textures.circles().lighter().stroke("#000").background("#fafafa").size(5).id("dots"),
          ],
          tickFormat(t, i) {
            if (t === "direct")
              return textConfig?.directDonationsText ?? "Donasjoner direkte fra donorer";
            if (t === "smartDistribution")
              return textConfig?.smartDistributionText ?? "Donasjoner via smart fordeling";
            return t;
          },
          type: "ordinal",
        },
      };

      const range = (plotConfig.color?.range as any).slice();

      if (range) {
        ((plotConfig.color as any).range as any[]).forEach(
          (texture, i) =>
            texture.url && (((plotConfig.color as any).range as any)[i] = texture.url()),
        );
      }

      const legend = Plot.legend({
        color: plotConfig.color,
        swatchSize: getRemInPixels() * 0.8,
        style: { fontSize: getRemInPixels() * 0.8 + "px" },
      });

      if (range) {
        for (const val of range) {
          if (val.apply) {
            d3.select(legend).selectAll("svg").call(val);
          }
        }
      }

      legend.style.marginTop = "0rem";
      legend.style.marginBottom = "0rem";
      legend.style.fontFamily = "ESKlarheitGrotesk";

      legendRef.current.innerHTML = "";
      legendRef.current.appendChild(legend);
    }
  }, [legendRef]);

  return (
    <div className={styles.legendWrapper}>
      <div ref={legendRef} className={styles.legend}></div>
    </div>
  );
};

const getRemInPixels = () => parseFloat(getComputedStyle(document.documentElement).fontSize);

// Locale-specific abbreviations
const ABBREVIATIONS = {
  "en-US": ["k", "M", "B", "T"], // thousand, million, billion, trillion
  "en-GB": ["k", "M", "B", "T"],
  "nb-NO": ["k", "mill", "mrd", "t"], // thousand, million, milliard, trillion
  "nn-NO": ["k", "mill", "mrd", "t"],
  no: ["k", "mill", "mrd", "t"], // fallback for Norwegian
  "de-DE": ["T", "Mio", "Mrd", "Bio"], // Tausend, Million, Milliarde, Billion
  "fr-FR": ["k", "M", "Md", "T"], // thousand, million, milliard, trillion
  "es-ES": ["k", "M", "MM", "B"], // thousand, million, million million, billion
  "it-IT": ["k", "M", "Mrd", "T"],
  "sv-SE": ["k", "M", "Md", "T"], // Swedish miljarder
  "da-DK": ["k", "M", "Mia", "T"], // Danish milliarder
};
const getAbbreviation = (locale: string) => {
  if (Object.keys(ABBREVIATIONS).includes(locale)) {
    return ABBREVIATIONS[locale as keyof typeof ABBREVIATIONS];
  }
  return ABBREVIATIONS["en-US"];
};
const formatShortSum = (sum: number, locale: string) => {
  const abbreviations = getAbbreviation(locale);
  const formatter = Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  if (sum < 1000) return formatter.format(sum);
  if (sum < 1000000) return formatter.format(sum / 1000) + " " + abbreviations[0];
  if (sum < 1000000000) return formatter.format(sum / 1000000) + " " + abbreviations[1];
  return formatter.format(sum / 1000000000) + " " + abbreviations[2];
};
const formatTick = (value: number, locale: string) => {
  const abbreviations = getAbbreviation(locale);
  const formatter = Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  if (value < 1000) return formatter.format(value);
  if (value < 1000000) return formatter.format(value / 1000) + " " + abbreviations[0];
  if (value < 1000000000) return formatter.format(value / 1000000) + " " + abbreviations[1];
  if (value < 1000000000000) return formatter.format(value / 1000000000) + " " + abbreviations[2];
  return formatter.format(value / 1000000000000) + " " + abbreviations[3];
};
