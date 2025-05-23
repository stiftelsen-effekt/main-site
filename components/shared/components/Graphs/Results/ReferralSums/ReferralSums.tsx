import { useCallback, useMemo } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import * as Plot from "@observablehq/plot";
import AnimateHeight from "react-animate-height";
import { BlockTablesContent } from "../../../../../main/blocks/BlockTable/BlockTablesContent";
import styles from "./ReferralSums.module.scss";
import resultsStyle from "../Shared.module.scss";
import { useDebouncedCallback } from "use-debounce";
import { GraphContext, GraphContextData } from "../../Shared/GraphContext/GraphContext";

export type ReferralSumsResult = {
  Year: number;
  Num_Donors: number;
  Total_sum: number;
  Num_Donors_ref: number;
  Total_sum_ref: number;
  Num_Donors_EA_ref: number;
  Total_sum_EA_ref: number;
  Median_yearly_ds_EA_ref: number;
  Avg_yearly_ds_EA_ref: number;
  Max_yearly_ds_EA_ref: number;
  Num_Donors_ac_ref: number;
  Total_sum_ac_ref: number;
  Num_Donors_some_ref: number;
  Total_sum_some_ref: number;
  Num_Donors_pod_ref: number;
  Total_sum_pod_ref: number;
  Num_Donors_tvr_ref: number;
  Total_sum_tvr_ref: number;
  Num_Donors_news_ref: number;
  Total_sum_news_ref: number;
  Num_Donors_web_ref: number;
  Total_sum_web_ref: number;
  Num_Donors_oth_ref: number;
  Total_sum_oth_ref: number;
  Inserted: string;
  Updated: string;
};

type ReferralGraphData = {
  type: string;
  sum: number;
  num: number;
  year: number;
};

export interface ReferralSumsTextConfig {
  millionAbbreviation?: string;
  referralTypeMappings?: Array<{
    apiKey: string;
    displayLabel: string;
  }>;
  tableText?: {
    yearColumnHeader?: string;
    typeColumnHeader?: string;
    donationSumColumnHeader?: string;
    donationCountColumnHeader?: string;
  };
}

export const ReferralSums: React.FC<{
  referralSums: ReferralSumsResult[];
  graphContext: GraphContextData;
  textConfig?: ReferralSumsTextConfig;
}> = ({ referralSums, graphContext, textConfig }) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const graphData = useMemo(() => {
    /**
     * Transform the referral sums into a format that can be used by the graph
     * We use type to indicate the type, sum to indicate sum for the type and num to indicate number of donors
     * Year is the year
     */
    const transformedReferralSums = referralSums.flatMap((el) => {
      return Object.entries(el)
        .filter(
          ([key, value]) =>
            (key.startsWith("Total") || key.startsWith("Num")) && key.endsWith("ref"),
        )
        .map(([key, value]) => {
          const split = key.split("_");
          const type = split[split.length - 2];
          return {
            type,
            sum: el[`Total_sum_${type}_ref` as keyof ReferralSumsResult] as number,
            num: el[`Num_Donors_${type}_ref` as keyof ReferralSumsResult] as number,
            year: el.Year,
          };
        });
    });

    /** Remove duplicates */
    const uniqueReferralSums = transformedReferralSums.filter(
      (el, i, arr) => arr.findIndex((e) => e.type === el.type && e.year === el.year) === i,
    );

    /** Filter those missing sum or number */
    const filteredReferralSums = uniqueReferralSums
      .filter((el) => el.sum && el.num)
      .sort((a, b) => b.sum - a.sum);

    return filteredReferralSums;
  }, [referralSums]);

  const tableContents = useMemo(
    () => getTableContents(graphData, textConfig),
    [graphData, textConfig],
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
    (graphData: ReferralGraphData[]) => {
      if (graphRef.current) {
        const config: Plot.PlotOptions = {
          width: size.width,
          height: size.height,
          marginRight: 0,
          marginLeft: 0,
          style: {
            background: "transparent",
            fontSize: getRemInPixels() * 0.8 + "px",
            overflow: "visible",
            fontFamily: "ESKlarheitGrotesk, sans-serif",
          },
          color: {
            legend: true,
          },
          y: {
            label: null,
            tickFormat: (t) => mapTypeToLabel(t, textConfig?.referralTypeMappings),
            domain: Array.from(new Set(graphData.map((el) => el.type))),
            ticks: size.width >= 760 ? undefined : [],
          },
          fx: {
            label: null,
            tickFormat: (t) => t.toString(),
          },
          fy: {
            label: null,
            ticks: [],
          },
          marks: [
            Plot.frame(),
            Plot.barX(graphData, {
              y: "type",
              x: "sum",
              fx: size.width >= 760 ? "year" : null,
              fy: size.width < 760 ? "year" : null,
            }),
          ],
        };

        if (size.width < 760 && config.marks) {
          config.marks.push(
            Plot.text(
              graphData,
              Plot.selectFirst({
                fy: "year",
                text: (d) => d.year.toString(),
                frameAnchor: "bottom-right",
                dx: -getRemInPixels() * 0.8,
                dy: -getRemInPixels() * 0.8,
                fontWeight: "bold",
                fontSize: getRemInPixels(),
              }),
            ),
          );
          config.marks.push(
            Plot.text(graphData, {
              x: (d) => 0,
              y: "type",
              fy: "year",
              text: (d) => mapTypeToLabel(d.type, textConfig?.referralTypeMappings),
              textAnchor: "start",
              dx: 5,
              mixBlendMode: "difference",
              fill: "white",
            }),
          );
          config.marks.push(
            Plot.axisX({
              textAnchor: "start",
              tickFormat: (t) =>
                Math.round(t / 1000000) + " " + (textConfig?.millionAbbreviation || "mill"),
              label: null,
              tickSpacing: 50,
            }),
          ),
            config.marks.push(
              Plot.axisX({
                anchor: "top",
                textAnchor: "start",
                tickFormat: (t) =>
                  Math.round(t / 1000000) + " " + (textConfig?.millionAbbreviation || "mill"),
                label: null,
                tickSpacing: 50,
              }),
            );
        } else if (config.marks) {
          config.marks.push(Plot.gridX({ strokeOpacity: 1, strokeWidth: 0.5, tickSpacing: 100 }));
          config.marks.push(
            Plot.axisX({
              tickFormat: (t) =>
                Math.round(t / 1000000) + " " + (textConfig?.millionAbbreviation || "mill"),
              label: null,
              tickSpacing: 100,
            }),
          );
        }

        const plot = Plot.plot(config);

        graphRef.current.innerHTML = "";
        graphRef.current.appendChild(plot);
      }
    },
    [graphRef, size],
  );

  useEffect(() => {
    drawGraph(graphData);
  }, [graphData, drawGraph]);

  return (
    <div className={resultsStyle.wrapper}>
      <div ref={graphRef} className={styles.graph} />
      <GraphContext context={graphContext} tableContents={tableContents}></GraphContext>
    </div>
  );
};

const mapTypeToLabel = (
  type: string,
  mappings?: Array<{ apiKey: string; displayLabel: string }>,
) => {
  if (mappings) {
    const mapping = mappings.find((m) => m.apiKey === type);
    if (mapping) {
      return mapping.displayLabel;
    }
  }

  // Fallback to hardcoded mappings for backwards compatibility
  switch (type) {
    case "EA":
      return "Effektiv Altruisme";
    case "ac":
      return "Bekjent";
    case "some":
      return "Sosiale medier";
    case "pod":
      return "Podcast";
    case "tvr":
      return "TV/radio";
    case "news":
      return "Nyheter";
    case "web":
      return "Internetsøk";
    case "oth":
      return "Annet";
    default:
      return type;
  }
};

const getTableContents = (graphData: ReferralGraphData[], textConfig?: ReferralSumsTextConfig) => {
  return {
    rows: [
      {
        _key: "header",
        _type: "row",
        cells: [
          textConfig?.tableText?.yearColumnHeader || "År",
          textConfig?.tableText?.typeColumnHeader || "Type",
          textConfig?.tableText?.donationSumColumnHeader || "Sum donasjoner",
          textConfig?.tableText?.donationCountColumnHeader || "Antall donasjoner",
        ],
      },
      ...graphData.map((r) => ({
        _key: r.year + r.type,
        _type: "row",
        cells: [
          r.year.toString(),
          mapTypeToLabel(r.type, textConfig?.referralTypeMappings),
          r.sum.toFixed(2),
          r.num.toFixed(0),
        ],
      })),
    ],
  };
};

const getRemInPixels = () => parseFloat(getComputedStyle(document.documentElement).fontSize);
