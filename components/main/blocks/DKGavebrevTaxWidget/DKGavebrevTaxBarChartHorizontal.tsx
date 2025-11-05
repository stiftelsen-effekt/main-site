import React, { useEffect, useRef, useState } from "react";
import { thousandize } from "../../../../util/formatting";

interface BarChartProps {
  donation: number;
  maximumDeduction: number;
  taxBenefit: number;
  labels?: {
    maximumDeduction?: string;
    yourDonation?: string;
    yourTaxBenefit?: string;
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

export const HorizontalDKGavebrevTaxBarChart: React.FC<BarChartProps> = ({
  donation,
  maximumDeduction,
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

  const padding: Padding = { left: 0, right: 10, top: 50, bottom: 0 };
  const chartWidth = dimensions.width - padding.left - padding.right;
  const barHeight = 40;

  // Scale function relative to maximum deduction
  const scale = (val: number): number => {
    if (maximumDeduction === 0) return 0;
    return (val / maximumDeduction) * chartWidth;
  };

  // Calculate label positions with smooth alignment transition
  const getLabelPositions = (): LabelPosition => {
    if (!labelRef.current || !sublabelRef.current || !dimensions.width) {
      return { translateX: 0, alignmentOffset: 0 };
    }

    const currentValue = Math.min(donation, maximumDeduction);
    const basePosition = scale(currentValue);

    // Get widths of both labels
    const labelWidth = labelRef.current.getBBox().width;
    const sublabelWidth = sublabelRef.current.getBBox().width;
    const maxLabelWidth = Math.max(labelWidth, sublabelWidth);

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
  const currentValue = Math.min(donation, maximumDeduction);

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

        {/* Donation value tick and labels (top track) */}
        <g
          style={{
            transition: "all 0.5s",
            opacity: donation > 0 ? 1 : 0,
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
              {labels?.yourDonation || "Din donation"}
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
              {thousandize(currentValue, locale)} kr
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
            {labels?.yourTaxBenefit || "Dit fradrag"}
          </text>
          <text
            x={0}
            y={padding.top + barHeight + 36}
            textAnchor="start"
            alignmentBaseline="middle"
            fontSize="0.75rem"
          >
            {thousandize(taxBenefit, locale)} kr
          </text>
        </g>

        {/* Main donation bar */}
        <rect
          x={padding.left}
          y={padding.top}
          width={scale(Math.min(donation, maximumDeduction))}
          height={barHeight}
          fill="#000"
          opacity={donation > 0 ? 1 : 0.3}
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
