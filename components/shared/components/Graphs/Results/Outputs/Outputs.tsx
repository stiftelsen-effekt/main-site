import { useCallback, useMemo } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import textures from "textures";
import { thousandize } from "../../../../../../util/formatting";
import styles from "./Outputs.module.scss";
import resultsStyle from "../Shared.module.scss";
import { useDebouncedCallback } from "use-debounce";
import { GraphContext, GraphContextData } from "../../Shared/GraphContext/GraphContext";
import { TransformedMonthlyDonationsPerOutput } from "../../../ResultsOutput/ResultsOutput";

export type MonthlyDonationsPerOutputResult = {
  output: string;
  total: AggregatedOutputResult;
  monthly: AggregatedOutputResult[];
};

type AggregatedOutputResult = {
  period: string;
  numberOfOutputs: number;
  organizations: {
    [key: string]: {
      direct: {
        sum: number;
        numberOfOutputs: number;
      };
      smartDistribution: {
        sum: number;
        numberOfOutputs: number;
      };
    };
  }[];
};

export type OutputGraphAnnotation = {
  title: string;
  description: string;
  date_from?: string;
  date_to?: string;
};

export const Outputs: React.FC<{
  transformedMonthlyDonationsPerOutput: TransformedMonthlyDonationsPerOutput;
  output: string;
  startYear: number;
  locale?: string;
  graphAnnotations?: OutputGraphAnnotation[];
  graphContext: GraphContextData;
}> = ({
  transformedMonthlyDonationsPerOutput,
  output,
  startYear,
  locale,
  graphAnnotations,
  graphContext,
}) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const innerGraph = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [requiredWidth, setRequiredWidth] = useState<null | number>(null);

  const tableContents = useMemo(
    () => computeTableContents(transformedMonthlyDonationsPerOutput, output),
    [transformedMonthlyDonationsPerOutput, output],
  );

  const maxOutputsInYear = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = Array.from(new Array(currentYear + 1 - startYear)).map((_, i) => startYear + i);
    const yearlyMaxes = years.map((year) =>
      transformedMonthlyDonationsPerOutput
        .filter((d) => d.period.getFullYear() === year)
        .reduce((acc, el) => acc + el.numberOfOutputs, 0),
    );
    return Math.max(...yearlyMaxes);
  }, [transformedMonthlyDonationsPerOutput]);

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
      if (graphRef.current && legendRef.current && innerGraph.current) {
        const currentYear = new Date().getFullYear();
        const years = Array.from(new Array(currentYear + 1 - startYear), (x, i) => ({
          period: new Date(startYear + i, 0, 1),
          y: 0,
        }));

        const thresholds = [...years.map((y) => y.period), new Date(currentYear + 1, 0, 1)];

        // Filter years depending on the width of the graph
        const requiredWidthPerYear = getRemInPixels() * 3;

        let requiredWidth = years.length * requiredWidthPerYear;

        const annotationFill = "#fafafa";
        const annotationMarks =
          graphAnnotations?.flatMap((annotation) => {
            const from = annotation.date_from
              ? new Date(annotation.date_from)
              : new Date(years[0].period.getFullYear(), 0, 1);
            const to = annotation.date_to
              ? new Date(annotation.date_to)
              : new Date(currentYear + 1, 0, 1);

            const areaMark = Plot.rect(
              [
                {
                  x1: from,
                  x2: to,
                  y1: 0,
                  y2: maxOutputsInYear * 1.1,
                },
              ],
              {
                x1: "x1",
                x2: "x2",
                y1: "y1",
                y2: "y2",
                fill: annotationFill,
                stroke: "none",
              },
            );

            const ruleY = Plot.ruleX([from], {
              stroke: "black",
              strokeWidth: 1,
            });

            const titleText = Plot.text(
              [
                {
                  x: from,
                  y: maxOutputsInYear * 1.1,
                },
              ],
              {
                x: "x",
                y: "y",
                text: (d) => annotation.title,
                textAnchor: "start",
                dy: 15,
                dx: getRemInPixels(),
                fill: "black",
              },
            );

            const descriptionText = Plot.text(
              [
                {
                  x: from,
                  y: maxOutputsInYear * 1.1,
                },
              ],
              {
                x: "x",
                y: "y",
                text: (d) => annotation.description,
                textAnchor: "start",
                dy: getRemInPixels() * 2,
                dx: getRemInPixels(),
                lineWidth: 16,
                fontSize: getRemInPixels() * 0.6,
                lineAnchor: "top",
                lineHeight: 1.5,
                fill: "black",
              },
            );

            return [areaMark, ruleY, titleText, descriptionText];
          }) || [];

        /** We need to add additional margin to the right if we have annotations
         *  that are wider than the graph itself. This is because the annotations
         *  are drawn outside the graph, and we need to make sure they are visible.
         *  Check if the annotations start at the last or second to last year, and
         *  add the required margin to the right of the graph.
         */
        let additionalInsetRight = 0;
        if (graphAnnotations && graphAnnotations.length > 0 && size.width < 760) {
          const maximumAnnotationYearFrom = Math.max(
            0,
            ...graphAnnotations
              .filter((a) => a.date_from)
              .map((a) => new Date(a.date_from as string).getFullYear()),
          );

          if (maximumAnnotationYearFrom >= currentYear - 2) {
            // Line width is 16 rem * 0.5 (fontsize is 0.5rem), and we need to add some margin to the right
            // We subtract the width of each year from current date to the annotation start date
            // This is given by the requiredWidthPerYear variable
            additionalInsetRight =
              16 * (getRemInPixels() * 0.5) -
              (currentYear - maximumAnnotationYearFrom) * requiredWidthPerYear;
            // We then update the required width to include the additional margin
            requiredWidth += additionalInsetRight;
          }
        }

        if (requiredWidth > size.width) {
          setRequiredWidth(requiredWidth);
        } else {
          setRequiredWidth(null);
        }

        let plotConfig: Plot.PlotOptions = {
          width: Math.max(size.width, requiredWidth),
          height: size.height,
          color: {
            domain: ["direct", "smartDistribution"],
            range: [
              "#000",
              textures.circles().lighter().stroke("#000").background("#fafafa").size(5).id("dots"),
              annotationFill,
            ],
            tickFormat(t, i) {
              if (size.width < 760) {
                if (t === "direct") return "Direkte fra donorer";
                if (t === "smartDistribution") return "Fordelt via smart fordeling";
                return t;
              }
              if (t === "direct") return output + " direkte fra donorer";
              if (t === "smartDistribution") return output + " fordelt via smart fordeling";
              return t;
            },
            type: "ordinal",
          },
          marginRight: 0,
          marginLeft: 0,
          marginTop: 30,
          insetLeft: size.width < 760 ? window.outerWidth * 0.05 : 0,
          insetRight: (size.width < 760 ? window.outerWidth * 0.05 : 0) + additionalInsetRight,
          y: {
            label: null,
            labelAnchor: "top",
            tickSize: 0,
            tickFormat: (t) => thousandize(Math.round(t), locale),
            ticks: size.width < 760 ? 0 : 5,
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
            fontSize: getRemInPixels() * 0.8 + "px",
            overflow: "visible",
            fontFamily: "ESKlarheitGrotesk",
          },
          marks: [
            Plot.gridY({ strokeOpacity: 1, strokeWidth: 0.5, ticks: size.width < 760 ? 0 : 5 }),
            ...annotationMarks,
            Plot.rectY(
              data,
              Plot.binX({ y: "sum" }, {
                x: "period",
                thresholds: thresholds,
                y: "numberOfOutputs",
                fill: "via",
                stroke: "black",
                insetLeft: size.width < 760 ? 5 : 10,
                insetRight: size.width < 760 ? 5 : 10,
              } as any),
            ),
            Plot.text(
              data,
              Plot.binX({ y: "sum" }, {
                x: "period",
                thresholds: thresholds,
                y: "numberOfOutputs",
                stroke: "#fafafa",
                strokeWidth: 5,
                fill: "black",
                text: (d: any) =>
                  thousandize(
                    Math.round(d.reduce((acc: number, el: any) => acc + el.numberOfOutputs, 0)),
                    locale,
                  ),
                dy: -15,
              } as any),
            ),
            Plot.text(years, {
              // X is middle of the year to center it under bar
              x: (d) => new Date(d.period.getFullYear(), 6, 1),
              y: "y",
              text: (d) => d.period.getFullYear().toString(),
              dy: 15,
            }),
            Plot.ruleY([0]),
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

        const legend = Plot.legend({
          color: plotConfig.color,
          swatchSize: getRemInPixels(),
          style: { fontSize: getRemInPixels() + "px" },
        });

        if (range) {
          for (const val of range) {
            if (val.apply) {
              d3.select(plot).selectChild("svg").call(val);
              d3.select(legend).selectAll("svg").call(val);
            }
          }
        }

        legend.style.marginTop = "1rem";
        legend.style.marginBottom = "2rem";
        legend.style.fontFamily = "ESKlarheitGrotesk";

        innerGraph.current.innerHTML = "";
        innerGraph.current.appendChild(plot);
        legendRef.current.innerHTML = "";
        legendRef.current.appendChild(legend);
      }
    },
    [graphRef, legendRef, innerGraph, size],
  );

  useEffect(() => {
    drawGraph(transformedMonthlyDonationsPerOutput);
  }, [transformedMonthlyDonationsPerOutput, drawGraph]);

  useEffect(() => {
    if (requiredWidth && graphRef.current) {
      graphRef.current.scrollTo({ left: Number.MAX_SAFE_INTEGER });
    }
  }, [requiredWidth, graphRef]);

  return (
    <div className={resultsStyle.wrapper}>
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
      <div ref={legendRef}></div>
      <GraphContext context={graphContext} tableContents={tableContents} />
    </div>
  );
};

const computeTableContents = (data: TransformedMonthlyDonationsPerOutput, outputName: string) => {
  return {
    rows: [
      {
        _key: "header",
        _type: "row",
        cells: ["Periode", "Organisasjon", outputName, "Fordeling", "Sum donasjoner"],
      },
      ...data.map((r) => ({
        _key: r.period + r.organization,
        _type: "row",
        cells: [
          r.period.getFullYear().toString() + "-" + (r.period.getMonth() + 1).toString(),
          r.organization,
          r.numberOfOutputs.toFixed(2),
          r.via === "direct" ? "Direkte fordelt" : "Smart fordeling",
          r.sum.toFixed(2),
        ],
      })),
    ],
  };
};

const getRemInPixels = () => parseFloat(getComputedStyle(document.documentElement).fontSize);
