import { useCallback, useEffect, useRef, useState } from "react";
import { EffektSliderStdv } from "../../../shared/components/EffektSliderSdv/EffektSliderStdv";
import { discountRateSensitivitiesInterventions } from "./data";
import * as Plot from "@observablehq/plot";
import { useDebouncedCallback } from "use-debounce";
import styles from "./DiscountRateComparison.module.scss";

export const DiscountRateComparison: React.FC<{ min: number; max: number }> = ({ min, max }) => {
  const [discountRate, setDiscountRate] = useState({ mean: 4, stdv: 1 });
  const graphRef = useRef<HTMLDivElement>(null);
  const workerRef = useRef<Worker | null>(null);

  const startSimulation = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ min, max, discountRate });
    }
  }, [discountRate]);

  const drawGraph = useCallback(
    (data: { intervention: string; runningAverage: number }[]) => {
      if (graphRef.current) {
        const width = graphRef.current.getBoundingClientRect().width;
        const height = graphRef.current.getBoundingClientRect().height;
        const plot = Plot.plot({
          width: width,
          marginRight: getRemInPixels() * 0.75 * 10,
          marginLeft: 0,
          marginBottom: 0,
          height: height,
          inset: 0,
          style: "background: transparent; font-family: ESKlarheitGrotesk;",
          y: {
            insetBottom: 20 + getRemInPixels() * 0.75,
            axis: null,
          },
          marks: [
            Plot.barX(data, {
              y: "intervention",
              x: "runningAverage",
              sort: { y: "x", order: "descending" },
            }),
            Plot.text(data, {
              y: "intervention",
              x: "runningAverage",
              text: "intervention",
              dx: getRemInPixels() * 0.75,
              textAnchor: "start",
              fontSize: getRemInPixels() * 0.75,
            }),
            Plot.axisX({
              textAnchor: "middle",
              lineAnchor: "bottom",
              tickPadding: -10,
              dy: -10,
              labelOffset: -10,
              label: "Verdi per $",
            }),
          ],
        });

        graphRef.current.innerHTML = "";
        graphRef.current.appendChild(plot);
      }
    },
    [graphRef],
  );

  const debouncedStartSimulation = useDebouncedCallback(startSimulation, 50, {
    maxWait: 50,
  });

  useEffect(() => {
    // Start the drawing process
    if (graphRef.current) {
      if (!workerRef.current) {
        workerRef.current = new Worker(new URL("./montecarlo.worker.ts", import.meta.url));
        workerRef.current.addEventListener("message", (e) => {
          if (graphRef.current) {
            // Transform to graph data
            const graphData = discountRateSensitivitiesInterventions.map((intervention) => ({
              intervention,
              runningAverage: e.data.runningAverages[intervention],
            }));
            drawGraph(graphData);
          }
        });
        debouncedStartSimulation();
      } else {
        debouncedStartSimulation();
      }
    }
    () => workerRef.current?.terminate();
  }, [discountRate, workerRef, drawGraph, graphRef]);

  return (
    <div className={styles.wrapper}>
      <div ref={graphRef} className={styles.graph} />

      <EffektSliderStdv
        min={min}
        max={max}
        value={discountRate}
        onChange={(val) => setDiscountRate(val)}
      />
    </div>
  );
};

const getRemInPixels = () => parseFloat(getComputedStyle(document.documentElement).fontSize);
