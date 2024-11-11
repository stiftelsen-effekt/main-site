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

export const OrganizationSparkline: React.FC<{
  transformedMonthlyDonationsPerOutput: TransformedMonthlyDonationsPerOutput;
  maxY?: number;
}> = ({ transformedMonthlyDonationsPerOutput, maxY }) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const innerGraph = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [requiredWidth, setRequiredWidth] = useState<null | number>(null);

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

  const drawGraph = useCallback(
    (data: TransformedMonthlyDonationsPerOutput) => {
      if (graphRef.current && innerGraph.current) {
        const currentYear = new Date().getFullYear();
        const years = Array.from(new Array(currentYear + 1 - 2016), (x, i) => ({
          period: new Date(2016 + i, 0, 1),
          y: 0,
        }));

        const thresholds = [...years.map((y) => y.period), new Date(currentYear + 1, 0, 1)];

        const requiredWidthPerYear = getRemInPixels() * 3;

        const requiredWidth = years.length * requiredWidthPerYear;
        if (requiredWidth > size.width) {
          setRequiredWidth(requiredWidth);
        } else {
          setRequiredWidth(null);
        }

        let plotConfig: Plot.PlotOptions = {
          width:
            size.width < 1180
              ? requiredWidth > size.width
                ? requiredWidth
                : size.width
              : size.width,
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
            domain: [
              new Date(years[0].period.getFullYear(), 0, 1),
              new Date(currentYear + 1, 0, 1),
            ],
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
              data,
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
              data,
              Plot.binX({ y: "sum" }, {
                x: "period",
                y: "sum",
                thresholds: thresholds,
                stroke: "#fafafa",
                strokeWidth: 5,
                fill: "black",
                text: (d: any) =>
                  formatShortSum(d.reduce((acc: number, el: any) => acc + el.sum, 0)),
                dy: -15,
              } as any),
            ),
            // Full unrounded when hovering using Plot.pointerX
            Plot.text(
              data,
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
                    thousandize(Math.round(d.reduce((acc: number, el: any) => acc + el.sum, 0))),
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
              tickFormat: (t) => {
                if (t === 0) return "0";
                if (t < 1000) return t;
                if (t < 1000000) return t / 1000 + " k";
                if (t < 1000000000) return t / 1000000 + " mill";
                if (t < 1000000000000) return t / 1000000000 + " mrd";
                return t / 1000000000000 + " t";
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
    [graphRef, innerGraph, size, maxY],
  );

  useEffect(() => {
    drawGraph(transformedMonthlyDonationsPerOutput);
  }, [transformedMonthlyDonationsPerOutput, drawGraph]);

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.scrollTo({ left: Number.MAX_SAFE_INTEGER });
    }
  }, [graphRef, requiredWidth]);

  return (
    <div className={styles.graphWrapper}>
      <div ref={graphRef} className={styles.graph}>
        <div
          ref={innerGraph}
          className={styles.innerGraph}
          style={{ width: requiredWidth ?? undefined }}
        ></div>
      </div>
      {requiredWidth && (
        <div className={styles.swipeHint}>
          <span>←</span> <i>Sveip for å se hele grafen</i>
        </div>
      )}
    </div>
  );
};

export const OrganizationSparklineLegend: React.FC = () => {
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
            if (t === "direct") return "Donasjoner direkte fra donorer";
            if (t === "smartDistribution") return "Donasjoner via smart fordeling";
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
const formatShortSum = (sum: number) => {
  if (sum < 1000) return sum;
  if (sum < 1000000) return thousandize(Math.round(sum / 1000)) + " k";
  if (sum < 1000000000) return (sum / 1000000).toFixed(2) + " mill";
  return (sum / 1000000000).toFixed(2) + " mrd";
};
