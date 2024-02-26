import { useCallback } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import * as Plot from "@observablehq/plot";
import AnimateHeight from "react-animate-height";
import { BlockTablesContent } from "../../../../../main/blocks/BlockTable/BlockTablesContent";
import styles from "./ReferralSums.module.scss";
import resultsStyle from "../Shared.module.scss";
import { useDebouncedCallback } from "use-debounce";

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

export const ReferralSums: React.FC<{ referralSums: ReferralSumsResult[] }> = ({
  referralSums,
}) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [explenationOpen, setExplenationOpen] = useState(false);
  const [tableDisplayed, setTableDisplayed] = useState(false);

  /**
   * Transform the referral sums into a format that can be used by the graph
   * We use type to indicate the type, sum to indicate sum for the type and num to indicate number of donors
   * Year is the year
   */
  const transformedReferralSums = referralSums.flatMap((el) => {
    return Object.entries(el)
      .filter(
        ([key, value]) => (key.startsWith("Total") || key.startsWith("Num")) && key.endsWith("ref"),
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
    (filteredReferralSums: { type: string; sum: number; num: number; year: number }[]) => {
      if (graphRef.current) {
        const plot = Plot.plot({
          width: size.width,
          height: size.height,
          marginRight: size.width >= 760 ? 0 : 80,
          marginLeft: size.width >= 760 ? 0 : 110,
          style: {
            background: "transparent",
            fontSize: getRemInPixels() * 0.8 + "px",
            overflow: "visible",
          },
          color: {
            legend: true,
          },
          y: {
            label: null,
            tickFormat: (t) => mapTypeToLabel(t),
            domain: Array.from(new Set(filteredReferralSums.map((el) => el.type))),
          },
          x: {
            legend: true,
            tickFormat: (t) => Math.round(t / 1000000) + " mill",
            label: null,
            tickSpacing: 100,
          },
          fx: {
            label: null,
            tickFormat: (t) => t.toString(),
          },
          fy: {
            label: null,
            tickFormat: (t) => t.toString(),
          },
          marks: [
            Plot.frame(),
            Plot.gridX({ strokeOpacity: 1, strokeWidth: 0.5, tickSpacing: 100 }),
            Plot.barX(filteredReferralSums, {
              y: "type",
              x: "sum",
              fx: size.width >= 760 ? "year" : null,
              fy: size.width < 760 ? "year" : null,
            }),
          ],
        });
        graphRef.current.innerHTML = "";
        graphRef.current.appendChild(plot);
      }
    },
    [graphRef, size],
  );

  useEffect(() => {
    drawGraph(filteredReferralSums);
  }, [filteredReferralSums, drawGraph]);

  return (
    <div className={resultsStyle.wrapper}>
      <div ref={graphRef} className={styles.graph} />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginTop: "2rem" }}>
        <i>
          Data: En kort beskrivelse av grafen her, med noen kilder muligerns som kan vises utdypet i
          som en fotnote.
        </i>
        <span
          onClick={(e) => {
            setExplenationOpen(!explenationOpen);
          }}
          style={{ cursor: "pointer" }}
        >
          Se detaljert beskrivelse av grafen{" "}
          <span
            style={{
              display: "inline-block",
              transition: "all 200ms",
              transform: `rotate(${explenationOpen ? "180deg" : "0deg"})`,
            }}
          >
            ↓
          </span>
        </span>
        <AnimateHeight height={explenationOpen ? "auto" : 0}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nunc nec varius
            tincidunt, nunc purus luct us odio, eget tincidunt nunc velit ac nunc nec varius
            tincidunt, nunc purus luctus odio, eget tincidunt nunc velit ac nunc nec varius
            tincidunt, nunc purus luctus odio, eget tincidunt nunc velit ac nunc nec varius
            tincidunt, nunc purus luctus odio, eget tincidunt nunc velit ac nunc nec varius
            tincidunt, nunc purus luctus odio, eget tincidunt nunc velit ac nunc nec varius
            tincidunt, nunc purus luctus odio, eget tincidunt nunc velit ac nunc nec varius
            tincidunt, nunc purus luctus odio, eget tincidunt nunc velit ac nunc nec varius
            tincidunt, nunc purus luctus odio, eget tincidunt nunc velit ac nunc nec varius
            tincidunt, nunc purus luctus odio, eget tincidunt nunc velit ac nunc nec varius
            tincidunt, nunc purus luctus odio, eget tincidunt nunc velit ac nunc nec varius
            tincidunt, nunc purus luctus odio, eget tincidunt nunc velit ac.
          </p>
        </AnimateHeight>
        <span
          onClick={(e) => {
            setTableDisplayed(!tableDisplayed);
          }}
          style={{ cursor: "pointer", textDecoration: "underline", marginBottom: "1rem" }}
        >
          {tableDisplayed ? "Skjul tabell" : "Få data som tabell"}
        </span>
        {tableDisplayed && (
          <BlockTablesContent
            fixedStyles={{}}
            config={{ headers: true }}
            contents={{
              rows: [
                {
                  _key: "header",
                  _type: "row",
                  cells: ["År", "Type", "Sum donasjoner", "Antall donasjoner"],
                },
                ...filteredReferralSums.map((r) => ({
                  _key: r.year + r.type,
                  _type: "row",
                  cells: [
                    r.year.toString(),
                    mapTypeToLabel(r.type),
                    r.sum.toFixed(2),
                    r.num.toFixed(0),
                  ],
                })),
              ],
            }}
          />
        )}
      </div>
    </div>
  );
};

const mapTypeToLabel = (type: string) => {
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

const getRemInPixels = () => parseFloat(getComputedStyle(document.documentElement).fontSize);
