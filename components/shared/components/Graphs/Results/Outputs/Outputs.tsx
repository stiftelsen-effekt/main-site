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
import { GraphContext } from "../../Shared/GraphContext/GraphContext";

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

type TransformedMonthlyDonationsPerOutput = {
  via: string;
  organization: string;
  period: Date;
  numberOfOutputs: number;
  sum: number;
}[];

export const Outputs: React.FC<{ monthlyDonationsPerOutput: MonthlyDonationsPerOutputResult }> = ({
  monthlyDonationsPerOutput,
}) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const transformedMonthlyDonationsPerOutput: TransformedMonthlyDonationsPerOutput = useMemo(
    () =>
      monthlyDonationsPerOutput.monthly.flatMap((el) => {
        return el.organizations.flatMap((org) => {
          return Object.entries(org).flatMap(([key, value]) => {
            return [
              {
                via: "direct",
                organization: key,
                period: new Date(
                  parseInt(el.period.split("-")[0]),
                  parseInt(el.period.split("-")[1]),
                  1,
                ),
                numberOfOutputs: value.direct.numberOfOutputs,
                sum: value.direct.sum,
              },
              {
                via: "smartDistribution",
                organization: key,
                period: new Date(
                  parseInt(el.period.split("-")[0]),
                  parseInt(el.period.split("-")[1]),
                  1,
                ),
                numberOfOutputs: value.smartDistribution.numberOfOutputs,
                sum: value.smartDistribution.sum,
              },
            ];
          });
        });
      }),
    [monthlyDonationsPerOutput],
  );
  const tableContents = useMemo(
    () =>
      computeTableContents(transformedMonthlyDonationsPerOutput, monthlyDonationsPerOutput.output),
    [transformedMonthlyDonationsPerOutput, monthlyDonationsPerOutput.output],
  );

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

  const drawGraph = useCallback(
    (
      data: {
        via: string;
        organization: string;
        period: Date;
        numberOfOutputs: number;
        sum: number;
      }[],
    ) => {
      if (graphRef.current && legendRef.current) {
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
              if (t === "direct") return monthlyDonationsPerOutput.output + " direkte fra donorer";
              if (t === "smartDistribution")
                return monthlyDonationsPerOutput.output + " fordelt via smart fordeling";
              return t;
            },
            type: "ordinal",
          },
          marginLeft: 0,
          marginRight: 0,
          y: {
            label: null,
            labelAnchor: "top",
            tickSize: 0,
            tickFormat: (t) => thousandize(Math.round(t)),
            ticks: size.width < 760 ? 0 : 5,
          },
          x: {
            domain: [new Date(2016, 0, 1), new Date(currentYear + 1, 0, 1)],
            ticks: false,
            label: null,
          },
          style: {
            background: "transparent",
            fontSize: getRemInPixels() * 0.8 + "px",
            overflow: "visible",
          },
          marks: [
            Plot.ruleY([0]),
            Plot.gridY({ strokeOpacity: 1, strokeWidth: 0.5, ticks: size.width < 760 ? 0 : 5 }),
            Plot.rectY(
              data,
              Plot.binX(
                { y: "sum" },
                {
                  x: "period",
                  y: "numberOfOutputs",
                  fill: "via",
                  interval: "year",
                  stroke: "black",
                  insetLeft: 10,
                  insetRight: 10,
                },
              ),
            ),
            Plot.text(
              data,
              Plot.binX(
                { y: "sum" },
                {
                  x: "period",
                  y: "numberOfOutputs",
                  stroke: "#fafafa",
                  strokeWidth: 5,
                  fill: "black",
                  text: (d) =>
                    thousandize(Math.round(d.reduce((acc, el) => acc + el.numberOfOutputs, 0))),
                  dy: -15,
                  interval: "year",
                },
              ),
            ),
            Plot.text(years, {
              x: "period",
              y: "y",
              text: (d) => d.period.getFullYear().toString(),
              dy: 15,
            }),
          ],
        };

        const range = plotConfig.color?.range?.slice();

        if (range) {
          plotConfig.color.range.forEach(
            (texture, i) => texture.url && (plotConfig.color.range[i] = texture.url()),
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

        graphRef.current.innerHTML = "";
        graphRef.current.appendChild(plot);
        legendRef.current.innerHTML = "";
        legendRef.current.appendChild(legend);
      }
    },
    [graphRef, legendRef, size],
  );

  useEffect(() => {
    drawGraph(transformedMonthlyDonationsPerOutput);
  }, [transformedMonthlyDonationsPerOutput, drawGraph]);

  return (
    <div className={resultsStyle.wrapper}>
      <div ref={graphRef} className={styles.graph} />
      <div ref={legendRef}></div>
      <GraphContext
        context={{
          description:
            "Data: Estimert antall " +
            monthlyDonationsPerOutput.output +
            " per år fra donasjoner til Gi Effektivt.",
          detailed_description_label: "Hva ligger bak disse tallene?",
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
          r.period.getFullYear().toString() + "-" + r.period.getMonth().toString(),
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
