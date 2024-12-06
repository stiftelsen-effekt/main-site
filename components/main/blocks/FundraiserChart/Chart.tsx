import { useEffect, useRef, useState } from "react";
import styles from "./Chart.module.scss";
import * as Plot from "@observablehq/plot";
import { FundraiserChartSkeleton } from "./ChartSkeleton";

export const FundraiserChartElement: React.FC<{
  sums: { fundraiserId: number; sum: number }[];
  fundraisers: Map<number, { name: string; page_slug: string }>;
  wrapperRef: React.MutableRefObject<HTMLDivElement | null>;
}> = ({ sums, fundraisers, wrapperRef }) => {
  const graphRef = useRef<HTMLDivElement | null>(null);
  const [graphSize, setGraphSize] = useState({ width: 0, height: 0 });

  const renderPlot = () => {
    if (!graphRef.current || !sums) return null;

    const plot = Plot.plot({
      width: graphSize.width,
      height: sums.length * getRemInPixels() * 8,
      marginBottom: getRemInPixels() * 2,
      insetTop: 0,
      marginLeft: 0,
      marginRight: 0,
      marginTop: 0,
      insetBottom: 0,
      y: {
        ticks: [],
        label: null,
        padding: 0,
      },
      style: {
        overflow: "visible",
        fontFamily: "ESKlarheitGrotesk",
      },
      marks: [
        Plot.barX(sums, {
          x: "sum",
          y: "fundraiserId",
          sort: { y: "-x" },
          href: (s) => fundraisers.get(s.fundraiserId)?.page_slug,
          target: "_blank",
          insetTop: getRemInPixels() * 3,
          insetBottom: getRemInPixels() * 1,
          margin: 0,
        }),
        Plot.textX(sums, {
          x: (s) => 0,
          y: "fundraiserId",
          text: (s) => fundraisers.get(s.fundraiserId)?.name + " ↗",
          href: (s) => fundraisers.get(s.fundraiserId)?.page_slug,
          target: "_blank",
          textAnchor: "start",
          lineAnchor: "top",
          fill: "black",
          fontSize: getRemInPixels(),
          dx: getRemInPixels(),
          render: (index, scales, values, dimensions, context, next) => {
            if (!scales?.y || !values?.y || !next) return null;

            const bandwidth = scales.scales.y?.bandwidth || 0;
            const element = next(index, scales, values, dimensions, context);

            if (!element) return null;
            // The element should be the group directly
            if (element && element.tagName === "g") {
              const currentTransform = element.getAttribute("transform");
              if (!currentTransform) return element;
              const match = currentTransform.match(/translate\((-?\d*\.?\d+),(-?\d*\.?\d+)\)/);
              if (match) {
                const [, x, y] = match;
                // Modify the y-translation by subtracting half the bandwidth
                element.setAttribute(
                  "transform",
                  `translate(${x},${parseFloat(y) - bandwidth / 2 + getRemInPixels() * 1})`,
                );
              }
            }
            return element;
          },
        }),
        Plot.textX(sums, {
          x: (s) => (window.innerWidth > 1180 ? s.sum : 0),
          y: "fundraiserId",
          text: (s) =>
            Intl.NumberFormat("no-NB", {
              style: "currency",
              currency: "NOK",
              maximumFractionDigits: 0,
            }).format(s.sum),
          textAnchor: "start",
          fill: (s) => (window.innerWidth > 1180 ? "black" : "white"),
          fontSize: getRemInPixels(),
          dx: getRemInPixels(),
          dy: getRemInPixels(),
          mixBlendMode: window.innerWidth > 1180 ? "normal" : "difference",
          href: (s) => fundraisers.get(s.fundraiserId)?.page_slug,
          target: "_blank",
        }),
        Plot.axisX({
          tickFormat: (t) =>
            Intl.NumberFormat("no-NB", {
              style: "currency",
              currency: "NOK",
              maximumFractionDigits: 0,
            }).format(t),
          fontSize: getRemInPixels() * 0.8,
          tickSpacing: getRemInPixels() * 6,
          tickPadding: getRemInPixels() * 0.5,
          label: null,
        }),
        Plot.ruleX([0]),
      ],
    });

    graphRef.current.innerHTML = "";
    graphRef.current.appendChild(plot);
  };

  useEffect(() => {
    if (graphRef.current && sums) {
      renderPlot();
    }
  }, [sums, graphSize, graphRef.current]);

  useEffect(() => {
    let resizeObserver: ResizeObserver;
    if (wrapperRef.current) {
      setGraphSize({
        width: wrapperRef.current.clientWidth,
        height: wrapperRef.current.clientHeight,
      });
      resizeObserver = new ResizeObserver((entries) => {
        setGraphSize({
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height,
        });
      });
      resizeObserver.observe(wrapperRef.current);
    }
    () => {
      resizeObserver.disconnect();
    };
  }, [wrapperRef.current]);

  return (
    <>
      <div className={styles.graph} ref={graphRef} />
      {graphSize.height === 0 && <FundraiserChartSkeleton numberOfFundraisers={fundraisers.size} />}
    </>
  );
};

const getRemInPixels = () => parseFloat(getComputedStyle(document.documentElement).fontSize);
