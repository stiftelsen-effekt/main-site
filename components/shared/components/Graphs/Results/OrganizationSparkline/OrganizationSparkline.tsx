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
}> = ({ transformedMonthlyDonationsPerOutput }) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const innerGraph = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

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
          period: new Date(2016 + i, 6, 1),
          y: 0,
        }));

        let plotConfig: Plot.PlotOptions = {
          width: size.width,
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
          marginBottom: 0,
          insetLeft: 0,
          insetRight: 0,
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
            label: null,
            ticks: [],
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
                  y: "sum",
                  x: "period",
                  fill: "via",
                  interval: "year",
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
                stroke: "#fafafa",
                strokeWidth: 5,
                fill: "black",
                text: (d: any) =>
                  thousandize(Math.round(d.reduce((acc: number, el: any) => acc + el.sum, 0))),
                dy: -15,
                interval: "year",
              } as any),
            ),
            Plot.text(years, {
              x: "period",
              y: "y",
              text: (d) => d.period.getFullYear().toString(),
              dy: 15,
            }),
            Plot.axisY({
              anchor: "right",
              tickFormat: (t) => {
                if (t < 1000000) return thousandize(t);
                if (t < 1000000000) return t / 1000000 + " mill";
                if (t < 1000000000000) return t / 1000000000 + " mrd";
                return t / 1000000000000 + " t";
              },
            }),
          ],
        };

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
    [graphRef, innerGraph, size],
  );

  useEffect(() => {
    console.log(transformedMonthlyDonationsPerOutput);
    drawGraph(transformedMonthlyDonationsPerOutput);
  }, [transformedMonthlyDonationsPerOutput, drawGraph]);

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.scrollTo({ left: Number.MAX_SAFE_INTEGER });
    }
  }, [graphRef]);

  return (
    <div ref={graphRef} className={styles.graph}>
      <div ref={innerGraph} className={styles.innerGraph}></div>
    </div>
  );
};

const getRemInPixels = () => parseFloat(getComputedStyle(document.documentElement).fontSize);
