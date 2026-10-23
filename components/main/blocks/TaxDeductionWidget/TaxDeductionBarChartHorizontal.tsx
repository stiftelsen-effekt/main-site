import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

interface BarChartProps {
  value: number;
  minimumThreshold: number;
  maximumThreshold: number;
  taxBenefit: number;
  labels?: {
    maximumThresholdLabel?: string;
    minimumThresholdLabel?: string;
    currentValueLabel?: string;
    taxBenefitLabel?: string;
  };
  locale?: string;
}

interface Dimensions {
  width: number;
  height: number;
}

interface Padding {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface LabelPosition {
  translateX: number;
  alignmentOffset: number;
}

export const HorizontalTaxDeductionBarChart: React.FC<BarChartProps> = ({
  value,
  minimumThreshold,
  maximumThreshold,
  taxBenefit,
  labels,
  locale,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<SVGTextElement>(null);
  const sublabelRef = useRef<SVGTextElement>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const currentValue = Math.min(value, maximumThreshold);

  // Measure the label widths whenever their text changes, so the labels can be clamped to the
  // chart. Measuring happens after commit, as refs must not be read during render.
  const [maxLabelWidth, setMaxLabelWidth] = useState(0);
  useLayoutEffect(() => {
    if (!labelRef.current || !sublabelRef.current) return;
    const labelWidth = labelRef.current.getBBox().width;
    const sublabelWidth = sublabelRef.current.getBBox().width;
    setMaxLabelWidth(Math.max(labelWidth, sublabelWidth));
  }, [dimensions.width, currentValue, labels?.currentValueLabel, locale]);

  const padding: Padding = { left: 0, right: 10, top: 50, bottom: 0 };
  const chartWidth = dimensions.width - padding.left - padding.right;
  const barHeight = 40;

  const scale = (val: number): number => (val / maximumThreshold) * chartWidth;

  // Calculate label positions with smooth alignment transition
  const getLabelPositions = (): LabelPosition => {
    if (!dimensions.width) {
      return { translateX: 0, alignmentOffset: 0 };
    }

    const basePosition = scale(currentValue);

    // Calculate if we need to clamp
    const maxPosition = dimensions.width - padding.right;
    const wouldOverflow = basePosition + maxLabelWidth + 6 > maxPosition;

    if (wouldOverflow) {
      // When clamped, calculate how much we need to move left to right-align
      const alignmentOffset = maxLabelWidth;
      return {
        translateX: maxPosition,
        alignmentOffset: alignmentOffset,
      };
    }

    return {
      translateX: basePosition,
      alignmentOffset: 0,
    };
  };

  const labelPosition = getLabelPositions();

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        position: "relative",
        fontSize: "0.9rem",
      }}
    >
      <svg width={dimensions.width} height={"auto"}>
        <defs>
          <pattern id="mobileDiagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4">
            <path
              d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2"
              style={{ stroke: "#fafafa", strokeWidth: 1 }}
            />
          </pattern>
        </defs>

        {/* X-axis lines */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={dimensions.width - padding.right}
          y2={padding.top}
          stroke="black"
          strokeWidth="1"
        />
        <line
          x1={padding.left}
          y1={padding.top + barHeight}
          x2={dimensions.width - padding.right}
          y2={padding.top + barHeight}
          stroke="black"
          strokeWidth="1"
        />

        {/* Minimum threshold tick (top) */}
        <g
          style={{
            transition: "all 0.5s",
            opacity: value >= minimumThreshold ? 0 : 1,
          }}
        >
          <line
            x1={scale(minimumThreshold)}
            y1={padding.top - 5}
            x2={scale(minimumThreshold)}
            y2={padding.top}
            stroke="black"
            strokeWidth="1"
          />
          <text
            x={scale(minimumThreshold)}
            y={padding.top - 30}
            textAnchor="start"
            alignmentBaseline="middle"
            transform={`translate(-3, 0)`}
          >
            {labels?.minimumThresholdLabel || "Minstegrense"}
          </text>
          <text
            x={scale(minimumThreshold)}
            y={padding.top - 15}
            textAnchor="start"
            alignmentBaseline="middle"
            fontSize="0.75rem"
            transform={`translate(-3, 0)`}
          >
            {Intl.NumberFormat(locale || "no-NB").format(minimumThreshold)} kr
          </text>
        </g>

        {/* Current value tick and labels (top track) */}
        <g
          style={{
            transition: "all 0.5s",
            opacity: value >= minimumThreshold ? 1 : 0,
          }}
        >
          {/* Tick mark - not clamped */}
          <g
            style={{
              transform: `translateX(${scale(currentValue) - 0.5}px)`,
              transition: "all 0.5s",
            }}
          >
            <line
              x1={0}
              y1={padding.top - 5}
              x2={0}
              y2={padding.top}
              stroke="black"
              strokeWidth="1"
              style={{ transition: "all 0.5s" }}
              opacity={labelPosition.alignmentOffset > 0 ? 0 : 1}
            />
          </g>

          {/* Labels - with smooth alignment transition */}
          <g
            style={{
              transform: `translateX(${labelPosition.translateX}px)`,
              transition: "all 0.5s",
            }}
          >
            <text
              ref={labelRef}
              x={0}
              y={padding.top - 30}
              textAnchor="start"
              alignmentBaseline="middle"
              style={{
                transform: `translateX(${-labelPosition.alignmentOffset}px)`,
                transition: "all 0.5s",
              }}
            >
              {labels?.currentValueLabel || "Skattefradrag"}
            </text>

            <text
              ref={sublabelRef}
              x={0}
              y={padding.top - 15}
              textAnchor="start"
              alignmentBaseline="middle"
              fontSize="0.75rem"
              style={{
                transform: `translateX(${-labelPosition.alignmentOffset}px)`,
                transition: "all 0.5s",
              }}
            >
              {Intl.NumberFormat(locale || "no-NB").format(currentValue)} kr
            </text>
          </g>
        </g>

        {/* Tax benefit tick (bottom track) */}
        <g
          style={{
            transition: "all 0.5s",
            opacity: taxBenefit > 0 ? 1 : 0,
            transform: `translateX(${scale(taxBenefit)}px)`,
          }}
        >
          <line
            x1={0}
            y1={padding.top + barHeight}
            x2={0}
            y2={padding.top + barHeight + 5}
            stroke="black"
            strokeWidth="1"
          />
          <text
            x={0}
            y={padding.top + barHeight + 20}
            textAnchor="start"
            alignmentBaseline="middle"
          >
            {labels?.taxBenefitLabel || "Du får tilbake"}
          </text>
          <text
            x={0}
            y={padding.top + barHeight + 36}
            textAnchor="start"
            alignmentBaseline="middle"
            fontSize="0.75rem"
          >
            {Intl.NumberFormat(locale || "no-NB").format(taxBenefit)} kr
          </text>
        </g>

        {/* Main deduction bar */}
        <rect
          x={padding.left}
          y={padding.top}
          width={scale(Math.min(value, maximumThreshold))}
          height={barHeight}
          fill="#000"
          opacity={value < minimumThreshold ? 0.3 : 1}
          style={{
            transition: "all 0.5s",
          }}
        />

        {/* Tax benefit overlay bar */}
        {taxBenefit > 0 && (
          <rect
            x={padding.left}
            y={padding.top}
            width={scale(taxBenefit)}
            height={barHeight}
            fill="url(#mobileDiagonalHatch)"
            style={{
              transition: "all 0.5s",
            }}
          />
        )}
      </svg>
    </div>
  );
};
