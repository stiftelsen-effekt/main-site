import {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import * as Plot from "@observablehq/plot";
import styles from "./CumulativeDonations.module.scss";
import resultsStyle from "../Shared.module.scss";
import { useDebouncedCallback } from "use-debounce";
import { GraphContext, GraphContextData } from "../../Shared/GraphContext/GraphContext";
import { getRemInPixels } from "../../../../../main/blocks/Paragraph/Citation";
import * as d3 from "d3";
import { DateTime } from "luxon";
import { BarChart2, TrendingUp } from "react-feather";
import { Cumulativedonationstableheaders } from "../../../../../../studio/sanity.types";
import { thousandize } from "../../../../../../util/formatting";
import { useIsMobile } from "../../../../../../hooks/useIsMobile";

export type DailyDonations = { date: string; sum: string }[];

export interface CumulativeDonationsTextConfig {
  millionAbbreviation?: string;
  locale?: string;
  currency?: string;
  textConfig?: {
    normalizeYAxisText?: string;
    directDonationsText?: string;
  };
  cumulativeChartLabel?: string;
  yearlyChartLabel?: string;
  ytdLabel?: string;
  fullYearLabel?: string;
}

type ChartMode = "cumulative" | "yearly";
type BarScope = "ytd" | "full";
type TransformedDonation = { date: Date; year: number; sum: number };
type CumulativeBinnedDonation = {
  date: Date;
  doy: number;
  year: number;
  cumulativeSum: number;
};
type YearlyTotal = { year: number; full: number; ytd: number };

const CUMULATIVE_DEFAULT_YEARS = 8;

/** Match Results Output graph label sizing (`getRemInPixels() * 0.8`). */
const plotLabelFontSize = () => getRemInPixels() * 0.8;

/** Shared plot chrome so the zero/x-axis line stays put when switching chart types. */
const PLOT_MARGIN_BOTTOM = 56;
const PLOT_MARGIN_BOTTOM_MOBILE = 40;
/** Cumulative keeps right room for end labels on mobile; bars stay flush. */
const plotHorizontalMargins = (isMobile: boolean, mode: ChartMode = "cumulative") => ({
  marginLeft: 0,
  marginRight: isMobile && mode === "cumulative" ? 70 : 0,
});

/** Zero-line that spans the full SVG width on mobile (including side margins). */
const zeroLineMark = (isMobile: boolean) =>
  Plot.ruleY([0], {
    stroke: "black",
    strokeWidth: 1,
    ...(isMobile
      ? {
          render: (_index: number[], scales: any, _values: any, dimensions: any) => {
            const y = scales.y(0);
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.setAttribute("aria-label", "rule");
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", "0");
            line.setAttribute("x2", String(dimensions.width));
            line.setAttribute("y1", String(y));
            line.setAttribute("y2", String(y));
            line.setAttribute("stroke", "black");
            line.setAttribute("stroke-width", "1");
            g.appendChild(line);
            return g;
          },
        }
      : {}),
  });

export const CumulativeDonations: React.FC<{
  dailyDonations: DailyDonations;
  graphContext: GraphContextData;
  textConfig?: CumulativeDonationsTextConfig;
  tableHeaders?: Cumulativedonationstableheaders;
}> = ({ dailyDonations, graphContext, textConfig, tableHeaders }) => {
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const innerGraphRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [requiredWidth, setRequiredWidth] = useState<number | null>(null);
  const [chartMode, setChartMode] = useState<ChartMode>("yearly");
  const [barScope, setBarScope] = useState<BarScope>("full");
  const [yearRange, setYearRange] = useState<{ start: number; end: number } | null>(null);
  const isMobileLayout = useIsMobile();

  const resizeGraph = useCallback(() => {
    if (graphContainerRef.current) {
      setSize({
        width: graphContainerRef.current.clientWidth,
        height: graphContainerRef.current.clientHeight,
      });
    }
  }, []);
  const debouncedResizeGraph = useDebouncedCallback(() => resizeGraph(), 1000, { trailing: true });

  useEffect(() => {
    if (graphContainerRef.current) {
      setSize({
        width: graphContainerRef.current.clientWidth,
        height: graphContainerRef.current.clientHeight,
      });
      const resizeObserver = new ResizeObserver((entries) => {
        const newWidth = entries[0].contentRect.width;
        if (newWidth !== size.width) {
          debouncedResizeGraph();
        }
      });

      resizeGraph();
      resizeObserver.observe(graphContainerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [graphContainerRef.current]);

  const transformedDonations = useMemo(() => transformDonations(dailyDonations), [dailyDonations]);
  const cumulativebinneddonations = useMemo(
    () => binDonations(transformedDonations),
    [transformedDonations],
  );
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(transformedDonations.map((d) => d.year))).sort(
      (a, b) => a - b,
    );
    return years;
  }, [transformedDonations]);

  // Yearly bars default to the full history (same as the Results Output graphs).
  const defaultYearCount =
    chartMode === "cumulative" ? CUMULATIVE_DEFAULT_YEARS : availableYears.length;

  const buildDefaultRange = useCallback(
    (count: number) => {
      if (availableYears.length === 0) return null;
      const end = availableYears[availableYears.length - 1];
      const startIndex = Math.max(0, availableYears.length - count);
      return { start: availableYears[startIndex], end };
    },
    [availableYears],
  );

  const defaultRange = useMemo(
    () => buildDefaultRange(defaultYearCount),
    [buildDefaultRange, defaultYearCount],
  );

  // When donation years first arrive (or change), seed the selection before paint.
  const availableYearsKey = availableYears.join(",");
  useLayoutEffect(() => {
    setYearRange(buildDefaultRange(defaultYearCount));
    // chartMode changes are handled synchronously in selectChartMode to avoid a flash.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableYearsKey]);

  const selectChartMode = useCallback(
    (mode: ChartMode) => {
      const count = mode === "cumulative" ? CUMULATIVE_DEFAULT_YEARS : availableYears.length;
      // Batch with mode change so the first paint already uses the mode's default window.
      setChartMode(mode);
      setYearRange(buildDefaultRange(count));
    },
    [availableYears.length, buildDefaultRange],
  );

  // Mobile: bars always show the full history (swipe); cumulative is a fixed last-N window.
  const effectiveRange = useMemo(() => {
    if (availableYears.length === 0) return null;
    if (isMobileLayout) {
      if (chartMode === "yearly") {
        return {
          start: availableYears[0],
          end: availableYears[availableYears.length - 1],
        };
      }
      return buildDefaultRange(CUMULATIVE_DEFAULT_YEARS);
    }
    return yearRange ?? defaultRange;
  }, [availableYears, isMobileLayout, chartMode, buildDefaultRange, yearRange, defaultRange]);

  const startYear = effectiveRange?.start ?? availableYears[0];
  const endYear = effectiveRange?.end ?? availableYears[availableYears.length - 1];

  const clampYearRange = useCallback(
    (nextStart: number, nextEnd: number) => {
      if (availableYears.length === 0) return;

      let startIndex = availableYears.indexOf(nextStart);
      let endIndex = availableYears.indexOf(nextEnd);
      if (startIndex < 0) startIndex = 0;
      if (endIndex < 0) endIndex = availableYears.length - 1;

      // Allow any window size down to a single year.
      if (endIndex < startIndex) {
        const swap = startIndex;
        startIndex = endIndex;
        endIndex = swap;
      }

      setYearRange({
        start: availableYears[startIndex],
        end: availableYears[endIndex],
      });
    },
    [availableYears],
  );

  const visibleCumulativeDonations = useMemo(
    () => cumulativebinneddonations.filter((d) => d.year >= startYear && d.year <= endYear),
    [cumulativebinneddonations, startYear, endYear],
  );

  const yearlyMaxes = useMemo(
    () => computeYearlyMaxes(visibleCumulativeDonations, size.height),
    [visibleCumulativeDonations, size.height],
  );

  const yearlyTotals = useMemo(
    () => computeYearlyTotals(transformedDonations, getDOY(new Date())),
    [transformedDonations],
  );

  const visibleYearlyTotals = useMemo(
    () => yearlyTotals.filter((d) => d.year >= startYear && d.year <= endYear),
    [yearlyTotals, startYear, endYear],
  );

  const tableContents = useMemo(() => {
    if (chartMode === "yearly") {
      return computeYearlyTableContents(visibleYearlyTotals, barScope, textConfig);
    }
    return computeTableContents(visibleCumulativeDonations, tableHeaders);
  }, [
    chartMode,
    visibleCumulativeDonations,
    visibleYearlyTotals,
    barScope,
    tableHeaders,
    textConfig,
  ]);

  const drawGraph = useCallback(() => {
    if (!innerGraphRef.current || size.width === 0 || size.height === 0) return;

    // Same as Results Output bars: give each year enough width, scroll when it won't fit.
    const requiredWidthPerYear = getRemInPixels() * 3;
    const yearsRequiredWidth = visibleYearlyTotals.length * requiredWidthPerYear;
    const plotWidth =
      chartMode === "yearly" ? Math.max(size.width, yearsRequiredWidth) : size.width;

    if (chartMode === "yearly" && yearsRequiredWidth > size.width) {
      setRequiredWidth(yearsRequiredWidth);
    } else {
      setRequiredWidth(null);
    }

    const plot =
      chartMode === "cumulative"
        ? createCumulativePlot({
            data: visibleCumulativeDonations,
            yearlyMaxes,
            size,
            isMobile: isMobileLayout,
            textConfig,
          })
        : createYearlyBarPlot({
            data: visibleYearlyTotals,
            barScope,
            size: { width: plotWidth, height: size.height },
            isMobile: isMobileLayout,
            textConfig,
          });

    innerGraphRef.current.innerHTML = "";
    innerGraphRef.current.appendChild(plot);
  }, [
    chartMode,
    barScope,
    visibleCumulativeDonations,
    visibleYearlyTotals,
    yearlyMaxes,
    size,
    isMobileLayout,
    textConfig,
  ]);

  // Before paint, so mode/range switches don't flash the previous (or unfiltered) plot.
  useLayoutEffect(() => {
    drawGraph();
  }, [drawGraph]);

  // Match Outputs / sparklines: land on the most recent years when the chart is scrollable.
  useEffect(() => {
    if (requiredWidth && graphContainerRef.current) {
      graphContainerRef.current.scrollTo({ left: Number.MAX_SAFE_INTEGER });
    }
  }, [requiredWidth, chartMode, visibleYearlyTotals.length]);

  const cumulativeChartLabel = textConfig?.cumulativeChartLabel || "Kumulativ";
  const yearlyChartLabel = textConfig?.yearlyChartLabel || "Per år";
  const ytdLabel = textConfig?.ytdLabel || "Hittil i år";
  const fullYearLabel = textConfig?.fullYearLabel || "Hele året";

  const chartTypeToggle = (
    <div className={styles.chartTypeToggle} role="group" aria-label="Diagramtype">
      <button
        type="button"
        className={styles.chartTypeButton}
        aria-pressed={chartMode === "yearly"}
        aria-label={yearlyChartLabel}
        title={yearlyChartLabel}
        onClick={() => selectChartMode("yearly")}
      >
        <BarChart2 />
      </button>
      <button
        type="button"
        className={styles.chartTypeButton}
        aria-pressed={chartMode === "cumulative"}
        aria-label={cumulativeChartLabel}
        title={cumulativeChartLabel}
        onClick={() => selectChartMode("cumulative")}
      >
        <TrendingUp />
      </button>
    </div>
  );

  const barScopeToggle =
    chartMode === "yearly" ? (
      <div className={styles.barScopeToggle} role="group" aria-label="Årsvisning">
        <button
          type="button"
          className={styles.barScopeButton}
          aria-pressed={barScope === "ytd"}
          onClick={() => setBarScope("ytd")}
        >
          {ytdLabel}
        </button>
        <button
          type="button"
          className={styles.barScopeButton}
          aria-pressed={barScope === "full"}
          onClick={() => setBarScope("full")}
        >
          {fullYearLabel}
        </button>
      </div>
    ) : null;

  return (
    <div className={resultsStyle.wrapper}>
      <div ref={graphContainerRef} className={styles.graphContainer}>
        <div className={styles.graph}>
          <div
            ref={innerGraphRef}
            className={styles.innerGraph}
            style={{ width: requiredWidth ?? undefined }}
          />
        </div>
      </div>

      {isMobileLayout ? (
        <div className={styles.mobileChartMeta}>
          <div className={styles.swipeHint}>
            {requiredWidth ? (
              <>
                <span>←</span> <i>Sveip for å se hele grafen</i>
              </>
            ) : null}
          </div>
          <div className={styles.mobileChartMetaRight}>
            {chartTypeToggle}
            {/* Always reserve this row so GraphContext below doesn't jump on mode toggle. */}
            <div className={styles.mobileBarScope} aria-hidden={chartMode !== "yearly"}>
              {barScopeToggle}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.controls}>
          {availableYears.length > 0 && yearRange && (
            <YearRail
              years={availableYears}
              startYear={startYear}
              endYear={endYear}
              onChangeRange={clampYearRange}
            />
          )}

          <div className={styles.rightControls}>
            {barScopeToggle}
            {chartTypeToggle}
          </div>
        </div>
      )}

      <GraphContext context={graphContext} tableContents={tableContents} />
    </div>
  );
};

type HandleSide = "start" | "end";

const YearRail: React.FC<{
  years: number[];
  startYear: number;
  endYear: number;
  onChangeRange: (start: number, end: number) => void;
}> = ({ years, startYear, endYear, onChangeRange }) => {
  const railRef = useRef<HTMLDivElement>(null);
  const yearRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const draggingSideRef = useRef<HandleSide | null>(null);
  // Gap offsets from the rail's left edge. Using start/end (not width) so only the
  // moving edge transitions — animating translateX+width makes the far edge drift.
  const [range, setRange] = useState({ start: 0, end: 0 });
  const [draggingSide, setDraggingSide] = useState<HandleSide | null>(null);

  const startIndex = years.indexOf(startYear);
  const endIndex = years.indexOf(endYear);

  const getYearEl = useCallback((year: number) => yearRefs.current.get(year) ?? null, []);

  const getRailGap = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return 0;
    return Number.parseFloat(getComputedStyle(rail).columnGap || getComputedStyle(rail).gap) || 0;
  }, []);

  /** Local X of the gap before `yearIndex` (or after last year when yearIndex === years.length). */
  const getGapOffsetLeft = useCallback(
    (yearIndex: number) => {
      const gap = getRailGap();
      if (yearIndex <= 0) {
        const first = getYearEl(years[0]);
        // Sit in the leading gap — may be slightly outside the content column.
        if (!first) return -gap / 2;
        return first.offsetLeft - gap / 2;
      }
      if (yearIndex >= years.length) {
        const last = getYearEl(years[years.length - 1]);
        if (!last) return 0;
        return last.offsetLeft + last.offsetWidth + gap / 2;
      }
      const left = getYearEl(years[yearIndex - 1]);
      const right = getYearEl(years[yearIndex]);
      if (!left || !right) return 0;
      return (left.offsetLeft + left.offsetWidth + right.offsetLeft) / 2;
    },
    [years, getYearEl, getRailGap],
  );

  /** Viewport X of the same gap — used for pointer snapping while dragging. */
  const getGapClientX = useCallback(
    (yearIndex: number) => {
      const gap = getRailGap();
      if (yearIndex <= 0) {
        const first = getYearEl(years[0]);
        if (!first) return 0;
        return first.getBoundingClientRect().left - gap / 2;
      }
      if (yearIndex >= years.length) {
        const last = getYearEl(years[years.length - 1]);
        if (!last) return 0;
        return last.getBoundingClientRect().right + gap / 2;
      }
      const left = getYearEl(years[yearIndex - 1]);
      const right = getYearEl(years[yearIndex]);
      if (!left || !right) return 0;
      const leftRect = left.getBoundingClientRect();
      const rightRect = right.getBoundingClientRect();
      return (leftRect.right + rightRect.left) / 2;
    },
    [years, getYearEl, getRailGap],
  );

  const setRangeToIndices = useCallback(
    (nextStartIndex: number, nextEndIndex: number) => {
      if (nextStartIndex < 0 || nextEndIndex < 0) return;
      const start = getGapOffsetLeft(nextStartIndex);
      const end = getGapOffsetLeft(nextEndIndex + 1);
      setRange((prev) => {
        if (prev.start === start && prev.end === end) return prev;
        return { start, end };
      });
    },
    [getGapOffsetLeft],
  );

  const measureRange = useCallback(() => {
    setRangeToIndices(startIndex, endIndex);
  }, [setRangeToIndices, startIndex, endIndex]);

  const yearsKey = years.join(",");

  // Initial placement before paint (and when the year list itself changes).
  useLayoutEffect(() => {
    measureRange();
    // Do not depend on selection — updating `left` before paint kills CSS transitions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearsKey]);

  // When selection changes without an optimistic range update (e.g. year click),
  // move handles after paint so the transition has a "from" frame.
  useEffect(() => {
    measureRange();
  }, [startIndex, endIndex, measureRange]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const resizeObserver = new ResizeObserver(() => measureRange());
    resizeObserver.observe(rail);
    window.addEventListener("resize", measureRange);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measureRange);
    };
  }, [measureRange]);

  const snapHandleToNearestGap = useCallback(
    (side: HandleSide, clientX: number) => {
      if (side === "start") {
        // Start may meet the end year (single-year selection), but not pass it.
        let bestIndex = 0;
        let bestDist = Number.POSITIVE_INFINITY;
        for (let i = 0; i <= endIndex; i++) {
          const dist = Math.abs(clientX - getGapClientX(i));
          if (dist < bestDist) {
            bestDist = dist;
            bestIndex = i;
          }
        }
        // Update handle position in the same commit as the selection change so
        // CSS can transition from the previously painted gap.
        setRangeToIndices(bestIndex, endIndex);
        const nextStart = years[bestIndex];
        if (nextStart !== startYear) onChangeRange(nextStart, endYear);
        return;
      }

      let bestIndex = startIndex;
      let bestDist = Number.POSITIVE_INFINITY;
      for (let i = startIndex; i < years.length; i++) {
        // End handle snaps to the gap *after* year i
        const dist = Math.abs(clientX - getGapClientX(i + 1));
        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = i;
        }
      }
      setRangeToIndices(startIndex, bestIndex);
      const nextEnd = years[bestIndex];
      if (nextEnd !== endYear) onChangeRange(startYear, nextEnd);
    },
    [
      years,
      startIndex,
      endIndex,
      startYear,
      endYear,
      onChangeRange,
      getGapClientX,
      setRangeToIndices,
    ],
  );

  const onHandlePointerDown =
    (side: HandleSide) => (event: ReactPointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      draggingSideRef.current = side;
      setDraggingSide(side);
      snapHandleToNearestGap(side, event.clientX);
    };

  const onHandlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const side = draggingSideRef.current;
    if (!side) return;
    snapHandleToNearestGap(side, event.clientX);
  };

  const onHandlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!draggingSideRef.current) return;
    draggingSideRef.current = null;
    setDraggingSide(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const nudgeHandle = (side: HandleSide, delta: number) => {
    if (side === "start") {
      const nextIndex = Math.max(0, Math.min(endIndex, startIndex + delta));
      setRangeToIndices(nextIndex, endIndex);
      if (years[nextIndex] !== startYear) onChangeRange(years[nextIndex], endYear);
    } else {
      const nextIndex = Math.max(startIndex, Math.min(years.length - 1, endIndex + delta));
      setRangeToIndices(startIndex, nextIndex);
      if (years[nextIndex] !== endYear) onChangeRange(startYear, years[nextIndex]);
    }
  };

  const handleYearClick = (year: number) => {
    const yearIndex = years.indexOf(year);
    if (yearIndex < 0) return;

    if (year < startYear) {
      setRangeToIndices(yearIndex, endIndex);
      onChangeRange(year, endYear);
      return;
    }
    if (year > endYear) {
      setRangeToIndices(startIndex, yearIndex);
      onChangeRange(startYear, year);
      return;
    }

    // Inside the range: move the nearer edge
    const distToStart = yearIndex - startIndex;
    const distToEnd = endIndex - yearIndex;
    if (distToStart <= distToEnd) {
      setRangeToIndices(yearIndex, endIndex);
      onChangeRange(year, endYear);
    } else {
      setRangeToIndices(startIndex, yearIndex);
      onChangeRange(startYear, year);
    }
  };

  const setYearRef = (year: number) => (el: HTMLButtonElement | null) => {
    if (el) yearRefs.current.set(year, el);
    else yearRefs.current.delete(year);
  };

  return (
    <div
      ref={railRef}
      className={`${styles.yearRail}${draggingSide ? ` ${styles.yearRailDragging}` : ""}`}
      role="group"
      aria-label="Velg årstall"
    >
      {years.map((year) => {
        const active = year >= startYear && year <= endYear;
        return (
          <button
            key={year}
            ref={setYearRef(year)}
            type="button"
            className={`${styles.yearRailYear}${active ? ` ${styles.yearRailYearActive}` : ""}`}
            aria-pressed={active}
            onClick={() => handleYearClick(year)}
            title={`Vis ${year}`}
          >
            {year}
          </button>
        );
      })}

      {/* Underline on the track; handles sit in the year-row gaps above it */}
      <div
        className={styles.yearRailRange}
        style={{ left: range.start, right: `calc(100% - ${range.end}px)` }}
        aria-hidden="true"
      />

      <button
        type="button"
        className={`${styles.yearRailHandle} ${styles.yearRailHandleStart}`}
        style={{ left: range.start }}
        aria-label={`Dra for å velge startår, nå ${startYear}`}
        title="Dra startår"
        onPointerDown={onHandlePointerDown("start")}
        onPointerMove={onHandlePointerMove}
        onPointerUp={onHandlePointerUp}
        onPointerCancel={onHandlePointerUp}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            nudgeHandle("start", -1);
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            nudgeHandle("start", 1);
          } else if (event.key === "Home") {
            event.preventDefault();
            nudgeHandle("start", -startIndex);
          } else if (event.key === "End") {
            event.preventDefault();
            nudgeHandle("start", endIndex - startIndex);
          }
        }}
      >
        <span className={styles.yearRailHandleGlyph} aria-hidden="true">
          <span className={styles.yearRailHandleGrip}>
            <span />
            <span />
            <span />
          </span>
        </span>
      </button>
      <button
        type="button"
        className={`${styles.yearRailHandle} ${styles.yearRailHandleEnd}`}
        style={{ left: range.end }}
        aria-label={`Dra for å velge sluttår, nå ${endYear}`}
        title="Dra sluttår"
        onPointerDown={onHandlePointerDown("end")}
        onPointerMove={onHandlePointerMove}
        onPointerUp={onHandlePointerUp}
        onPointerCancel={onHandlePointerUp}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            nudgeHandle("end", -1);
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            nudgeHandle("end", 1);
          } else if (event.key === "Home") {
            event.preventDefault();
            nudgeHandle("end", startIndex - endIndex);
          } else if (event.key === "End") {
            event.preventDefault();
            nudgeHandle("end", years.length - 1 - endIndex);
          }
        }}
      >
        <span className={styles.yearRailHandleGlyph} aria-hidden="true">
          <span className={styles.yearRailHandleGrip}>
            <span />
            <span />
            <span />
          </span>
        </span>
      </button>
    </div>
  );
};

const createCumulativePlot = ({
  data,
  yearlyMaxes,
  size,
  isMobile = false,
  textConfig,
}: {
  data: CumulativeBinnedDonation[];
  yearlyMaxes: ReturnType<typeof computeYearlyMaxes>;
  size: { width: number; height: number };
  isMobile?: boolean;
  textConfig?: CumulativeDonationsTextConfig;
}) => {
  // Highlight the latest year in the visible range (not always the calendar year),
  // so dragging the upper year handle keeps one end label and a black "focus" series.
  const focusYear = data.length ? data[data.length - 1].year : new Date().getFullYear();
  const dimmed = "#ccc";
  const labelFontSize = plotLabelFontSize();

  return Plot.plot({
    width: size.width,
    height: size.height,
    ...plotHorizontalMargins(isMobile, "cumulative"),
    marginBottom: isMobile ? PLOT_MARGIN_BOTTOM_MOBILE : PLOT_MARGIN_BOTTOM,
    style: {
      background: "transparent",
      fontSize: labelFontSize + "px",
      overflow: "visible",
      fontFamily: "ESKlarheitGrotesk, sans-serif",
    },
    color: {
      legend: true,
    },
    y: {
      legend: true,
      // Hide the baseline "0 mill" tick; keep the rest.
      tickFormat: (t) => (t === 0 ? "" : formatMillionTick(t, textConfig)),
      label: null,
      tickSpacing: 100,
      tickSize: 0,
    },
    x: {
      label: null,
      domain: [0, 366],
    },
    marks: [
      zeroLineMark(isMobile),
      // Default matches "latest year hovered": focus year black, others dimmed.
      // Tip is used only for hover highlighting (no balloon); point label is a pointer text mark.
      Plot.lineY(data, {
        x: "doy",
        y: "cumulativeSum",
        z: "year",
        stroke: (d: CumulativeBinnedDonation) => (d.year === focusYear ? "black" : dimmed),
        strokeWidth: 1,
        tip: isMobile
          ? undefined
          : {
              format: { y: false, x: false, z: false },
              render: (
                index: number[],
                _scales: any,
                values: any,
                _dimensions: any,
                context: any,
              ) => {
                const svg = d3.select(context.ownerSVGElement);
                const path = svg.selectAll("[aria-label=line] path");
                const endLabels = svg.selectAll("g.year-end-label text");
                const endLinks = svg.selectAll("g.year-end-link path");
                const endLinkCurrent = svg.selectAll("g.year-end-link-current path");
                if (index.length && values.z) {
                  const z = values.z[index[0]];
                  const zNum = Number(z);
                  path
                    .style("stroke", dimmed)
                    .filter((i: any) => values.z[i[0]] === z)
                    .style("stroke", "black")
                    .raise();
                  // Hide that year's end label + leader line so the hover label can take its place.
                  endLabels.style("opacity", function (this: SVGTextElement) {
                    return (this.textContent || "").startsWith(String(z)) ? 0 : null;
                  });
                  endLinks.style("opacity", (i: number) =>
                    yearlyMaxes[i]?.year === zNum ? 0 : null,
                  );
                  endLinkCurrent.style("opacity", zNum === focusYear ? 0 : null);
                } else {
                  path.style("stroke", null);
                  endLabels.style("opacity", null);
                  endLinks.style("opacity", null);
                  endLinkCurrent.style("opacity", null);
                }
                return null;
              },
            },
      }),
      Plot.gridY({ strokeOpacity: 1, strokeWidth: 0.5, tickSpacing: 100 }),
      Plot.axisX({
        ticks: [
          0,
          ...dayCount
            .map((d) => d)
            .filter((d, i) => (size.width >= 760 ? i : i % 2 === 0 && i > 1)),
        ],
        tickFormat: (t, i) =>
          Plot.formatMonth(textConfig?.locale || "no-NB")(size.width >= 760 ? i : i * 2).padStart(
            5,
            " ",
          ),
        textAnchor: "start",
        tickSize: getRemInPixels(),
        tickPadding: -getRemInPixels() * 0.7,
      }),
      Plot.dot(yearlyMaxes, {
        y: "cumulativeSum",
        x: "doy",
        fill: "black",
        r: 2,
      }),
      Plot.dot(
        data,
        Plot.selectLast({
          y: "cumulativeSum",
          x: "doy",
          fill: "black",
          r: 2,
        }),
      ),
      Plot.link(yearlyMaxes, {
        y1: "cumulativeSum",
        y2: "adjustedCumulativeSum",
        x1: "doy",
        x2: (d) =>
          d.doy + (size.width < 760 ? Math.round(10 + (size.width - 760) * (20 / -385)) : 10),
        dx: 5,
        strokeWidth: 0.5,
        className: "year-end-link",
      }),
      Plot.link(
        data,
        Plot.selectLast({
          y1: "cumulativeSum",
          y2: "cumulativeSum",
          x1: "doy",
          x2: (d) => d.doy + 2,
          dx: 5,
          strokeWidth: 0.5,
          className: "year-end-link-current",
        }),
      ),
      Plot.text(yearlyMaxes, {
        y: "adjustedCumulativeSum",
        x: "doy",
        text: (d) => formatEndLabel(d, size.width, textConfig),
        textAnchor: "start",
        dx: size.width < 760 ? 30 : 35,
        // Keep compact — denser than the Results Output bar labels on purpose.
        fontSize: 12,
        lineHeight: 1.2,
        className: "year-end-label",
      }),
      Plot.text(
        data,
        Plot.selectLast({
          y: "cumulativeSum",
          x: "doy",
          text: (d) => formatEndLabel(d, size.width, textConfig),
          textAnchor: "start",
          fill: "black",
          stroke: "#fafafa",
          strokeWidth: 5,
          dx: 14,
          fontSize: 12,
          lineHeight: 1.2,
          className: "year-end-label",
        }),
      ),
      ...[
        Plot.ruleX(
          data,
          Plot.pointerX({
            x: "doy",
            z: "year",
            stroke: "black",
            strokeWidth: 0.5,
          }),
        ),
        Plot.dot(
          data,
          Plot.pointerX({
            x: "doy",
            y: "cumulativeSum",
            z: "year",
            fill: "black",
            r: 3,
            px: "doy",
            maxRadius: 20,
          }),
        ),
        // Same chrome as year-end labels, pinned to the active point.
        Plot.text(
          data,
          Plot.pointerX({
            x: "doy",
            y: "cumulativeSum",
            z: "year",
            px: "doy",
            maxRadius: 20,
            text: (d: CumulativeBinnedDonation) => formatEndLabel(d, size.width, textConfig),
            textAnchor: "start",
            fill: "black",
            stroke: "#fafafa",
            strokeWidth: 5,
            dx: 14,
            fontSize: 12,
            lineHeight: 1.2,
          }),
        ),
      ].filter((d) => (isMobile ? false : d)),
    ],
  });
};

const createYearlyBarPlot = ({
  data,
  barScope,
  size,
  isMobile = false,
  textConfig,
}: {
  data: YearlyTotal[];
  barScope: BarScope;
  size: { width: number; height: number };
  isMobile?: boolean;
  textConfig?: CumulativeDonationsTextConfig;
}) => {
  const pageBackground = "#fafafa";
  const values = data.map((d) => ({
    year: d.year,
    value: barScope === "ytd" ? d.ytd : d.full,
  }));
  const locale = textConfig?.locale || "no-NB";
  const ytdPeriodLabel = barScope === "ytd" ? formatYtdPeriodLabel(locale) : null;
  const labelFontSize = plotLabelFontSize();

  return Plot.plot({
    width: size.width,
    height: size.height,
    ...plotHorizontalMargins(isMobile, "yearly"),
    // Keep room for YTD sub-labels; shared with cumulative so the zero-line stays put.
    marginBottom: isMobile ? PLOT_MARGIN_BOTTOM_MOBILE : PLOT_MARGIN_BOTTOM,
    style: {
      background: "transparent",
      fontSize: labelFontSize + "px",
      overflow: "visible",
      fontFamily: "ESKlarheitGrotesk, sans-serif",
    },
    x: {
      label: null,
      type: "band",
      axis: null,
      padding: values.length <= 4 ? 0.35 : values.length >= 9 ? 0.15 : 0.25,
      domain: values.map((d) => d.year.toString()),
    },
    y: {
      label: null,
      nice: true,
      tickFormat: (t) => (t === 0 ? "" : formatMillionTick(t, textConfig)),
      // Match Outputs / mobile layout: no y-axis ticks/labels on mobile.
      ...(isMobile ? { axis: null as const, ticks: 0 } : { tickSpacing: 80, tickSize: 0 }),
      domain: [0, Math.max(...values.map((d) => d.value), 0) * 1.12],
    },
    marks: [
      zeroLineMark(isMobile),
      ...(isMobile
        ? []
        : [
            Plot.gridY({
              strokeOpacity: 1,
              strokeWidth: 0.5,
              tickSpacing: 80,
            }),
          ]),
      Plot.barY(values, {
        x: (d) => d.year.toString(),
        y: "value",
        fill: "black",
      }),
      // Short labels by default (org sparkline pattern).
      // Keep dy large enough that even the hover halo stays above the bar.
      Plot.text(values, {
        x: (d) => d.year.toString(),
        y: "value",
        text: (d) => formatBarLabel(d.value, textConfig, { compact: isMobile }),
        dy: -16,
        fontSize: labelFontSize,
        fill: "black",
        stroke: pageBackground,
        strokeWidth: 5,
      }),
      // Full number on hover — modest halo so it covers the short label without eating into the bar.
      ...(isMobile
        ? []
        : [
            Plot.text(
              values,
              Plot.pointerX({
                x: (d: { year: number; value: number }) => d.year.toString(),
                y: "value",
                text: (d: { year: number; value: number }) =>
                  thousandize(Math.round(d.value), locale),
                dy: -16,
                fontSize: labelFontSize,
                fontWeight: "bold",
                fill: "black",
                stroke: pageBackground,
                strokeWidth: 8,
              }),
            ),
          ]),
      Plot.axisX({
        tickSize: 0,
        tickPadding: 8,
        fontSize: labelFontSize,
      }),
      ...(ytdPeriodLabel
        ? [
            // Separate mark (not tickFormat) so we can use a smaller type; clip:false
            // so labels in the bottom margin aren't cut off by the plot frame.
            Plot.text(values, {
              x: (d) => d.year.toString(),
              y: 0,
              // Must be a function — a string is treated as a field name.
              text: () => ytdPeriodLabel,
              dy: isMobile ? 22 : 28,
              lineAnchor: "top",
              fontSize: getRemInPixels() * 0.65,
              fill: "black",
              opacity: 0.5,
              clip: false,
            }),
          ]
        : []),
    ],
  });
};

const formatMillionTick = (t: number, textConfig?: CumulativeDonationsTextConfig) => {
  const millions = t / 1000000;
  const formatted = millions % 1 === 0 ? millions.toString() : millions.toFixed(1);
  return formatted + " " + (textConfig?.millionAbbreviation || "mill");
};

/** YTD end date in the platform locale, e.g. "24. juli" (nb) / "Jul 24" (en). */
const formatYtdPeriodLabel = (locale: string) =>
  DateTime.now().setLocale(locale).toLocaleString({ day: "numeric", month: "short" });

/** Default bar label: millions with one decimal, e.g. "14,5 mill". */
const formatBarLabel = (
  sum: number,
  textConfig?: CumulativeDonationsTextConfig,
  options?: { compact?: boolean },
) => {
  const locale = textConfig?.locale || "no-NB";
  const formatted = (sum / 1000000).toLocaleString(locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  });
  const abbreviation = options?.compact ? "m" : textConfig?.millionAbbreviation || "mill";
  return formatted + " " + abbreviation;
};

const formatEndLabel = (
  d: { cumulativeSum: number; year: number },
  width: number,
  textConfig?: CumulativeDonationsTextConfig,
) => {
  let label = d.year.toString();
  label += "\n";
  if (width < 760) {
    label +=
      (d.cumulativeSum / 1000000).toFixed(2) + " " + (textConfig?.millionAbbreviation || "mill");
  } else {
    label += d.cumulativeSum.toLocaleString(textConfig?.locale || "no-NB", {
      style: "currency",
      currency: textConfig?.currency || "NOK",
      maximumFractionDigits: 0,
    });
  }
  return label;
};

const getDaysInMonth = (leap: boolean) => {
  return [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
};

const dayCount = getDaysInMonth(true).reduce(
  (acc, val, i) => {
    if (i !== 11) {
      acc.push(acc[i] + val);
    }
    return acc;
  },
  [0],
);

const getDOY = (date: Date) => {
  var mn = date.getMonth();
  var dn = date.getDate();
  var dayOfYear = dayCount[mn] + dn - 1;
  return dayOfYear;
};

const transformDonations = (don: DailyDonations): TransformedDonation[] =>
  don.map((d) => ({
    date: new Date(d.date),
    year: new Date(d.date).getFullYear(),
    sum: parseFloat(d.sum),
  }));

const binDonations = (don: TransformedDonation[]) =>
  don.reduce<CumulativeBinnedDonation[]>((acc, el, i) => {
    let sum = el.sum;
    if (i > 0 && acc[acc.length - 1].year === el.year) {
      sum += acc[acc.length - 1].cumulativeSum;
    }
    // Add missing datapoint if there is a gap in the data
    const currentDoy = getDOY(el.date);

    const prevIndex = acc.length - 1;

    if (prevIndex >= 0) {
      const gap = currentDoy - acc[prevIndex].doy;

      if (gap > 1) {
        for (let i = 1; i < gap; i++) {
          const date = DateTime.fromJSDate(el.date)
            .minus({ days: gap - i })
            .toJSDate();
          acc.push({
            date: date,
            doy: currentDoy - gap + i,
            year: el.year,
            cumulativeSum: acc[prevIndex].cumulativeSum,
          });
        }
      }
    }

    acc.push({
      date: el.date,
      doy: getDOY(el.date),
      year: el.year,
      cumulativeSum: sum,
    });
    return acc;
  }, []);

const computeYearlyTotals = (don: TransformedDonation[], currentDoy: number): YearlyTotal[] => {
  const byYear = new Map<number, YearlyTotal>();

  for (const d of don) {
    const entry = byYear.get(d.year) ?? { year: d.year, full: 0, ytd: 0 };
    entry.full += d.sum;
    if (getDOY(d.date) <= currentDoy) {
      entry.ytd += d.sum;
    }
    byYear.set(d.year, entry);
  }

  return Array.from(byYear.values()).sort((a, b) => a.year - b.year);
};

const computeYearlyMaxes = (don: CumulativeBinnedDonation[], height: number) => {
  if (!don.length || height <= 0) return [];

  const firstYear = don[0].year;
  const lastYear = don[don.length - 1].year;
  const allYears = Array.from(new Array(lastYear - firstYear + 1)).map((el, i) => firstYear + i);
  // Exclude the focus (latest visible) year — that series uses Plot.selectLast end chrome instead.
  // Using calendar year here duplicated labels when the upper handle ended earlier than today.

  const yearlyMaxes = allYears
    .filter((y) => y !== lastYear)
    .map((y) => {
      const yearDonations = don.filter((d) => d.year === y);
      if (!yearDonations.length) return null;
      const max = yearDonations.reduce((acc, val) =>
        acc.cumulativeSum > val.cumulativeSum ? acc : val,
      );
      return {
        doy: max.doy,
        year: max.year,
        cumulativeSum: max.cumulativeSum,
        adjustedCumulativeSum: max.cumulativeSum,
      };
    })
    .filter((d): d is NonNullable<typeof d> => d !== null)
    .sort((a, b) => a.cumulativeSum - b.cumulativeSum);

  if (!yearlyMaxes.length) return [];

  const maxCumulativeSum = yearlyMaxes.reduce((acc, val) =>
    acc.cumulativeSum > val.cumulativeSum ? acc : val,
  );

  const yScale = maxCumulativeSum.cumulativeSum;
  const labelHeight = (30 / height) * yScale;
  const labelPadding = 0.5 * labelHeight;
  const labelYs = (d: typeof yearlyMaxes[number], i: number, items: typeof yearlyMaxes) => {
    if (i === 0) {
      return d.cumulativeSum;
    }
    if (d.cumulativeSum - items[i - 1].adjustedCumulativeSum < labelHeight + labelPadding) {
      return items[i - 1].adjustedCumulativeSum + labelHeight + labelPadding;
    }
    return d.cumulativeSum;
  };
  yearlyMaxes.forEach((d, i) => {
    d.adjustedCumulativeSum = labelYs(d, i, yearlyMaxes);
  });
  return yearlyMaxes;
};

const computeTableContents = (
  cumulativebinneddonations: CumulativeBinnedDonation[],
  headers?: Cumulativedonationstableheaders,
) => {
  return {
    rows: [
      {
        _key: "header",
        _type: "row",
        cells: [
          headers?.date || "Dato (ISO 8601)",
          headers?.day_of_year || "Dag i året",
          headers?.cumulative_sum || "Kumulativ sum",
        ],
      },
      ...cumulativebinneddonations.map((r) => ({
        _key: r.date.toISOString(),
        _type: "row",
        cells: [r.date.toISOString().split("T")[0], r.doy.toString(), r.cumulativeSum.toFixed(2)],
      })),
    ],
  };
};

const computeYearlyTableContents = (
  yearlyTotals: YearlyTotal[],
  barScope: BarScope,
  textConfig?: CumulativeDonationsTextConfig,
) => {
  const valueHeader =
    barScope === "ytd"
      ? textConfig?.ytdLabel || "Hittil i år"
      : textConfig?.fullYearLabel || "Hele året";

  return {
    rows: [
      {
        _key: "header",
        _type: "row",
        cells: ["År", valueHeader],
      },
      ...yearlyTotals.map((r) => ({
        _key: r.year.toString(),
        _type: "row",
        cells: [r.year.toString(), (barScope === "ytd" ? r.ytd : r.full).toFixed(2)],
      })),
    ],
  };
};
