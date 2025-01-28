import React, { useEffect, useRef, useState } from "react";

interface BarChartProps {
  value: number;
  minimumThreshold: number;
  maximumThreshold: number;
  taxBenefit: number;
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

export const TaxDeductionBarChart: React.FC<BarChartProps> = ({
  value,
  minimumThreshold,
  maximumThreshold,
  taxBenefit,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
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

  const padding: Padding = { left: 0, right: 0, top: 10, bottom: 0 };
  const chartWidth = dimensions.width - padding.left - padding.right;
  const chartHeight = dimensions.height - padding.top - padding.bottom;

  const scale = (val: number): number => (val / maximumThreshold) * chartHeight;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        fontSize: "0.75rem",
      }}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "visible",
        }}
      >
        <defs>
          <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4">
            <path
              d="M-1,1 l2,-2
                     M0,4 l4,-4
                     M3,5 l2,-2"
              style={{ stroke: "#fafafa", strokeWidth: 1 }}
            />
          </pattern>
        </defs>

        {/* Y-axis */}
        <line
          x1={0}
          y1={padding.top}
          x2={0}
          y2={dimensions.height - padding.bottom}
          stroke="black"
          strokeWidth="1"
        />

        {/* Maximum threshold tick */}
        <line x1={-5} y1={padding.top} x2={0} y2={padding.top} stroke="black" strokeWidth="1" />
        <text x={-8} y={padding.top - 8} textAnchor="end" alignmentBaseline="middle">
          Maks skattefradrag
        </text>
        <text
          x={-8}
          y={padding.top + 8}
          textAnchor="end"
          alignmentBaseline="middle"
          fontSize={"0.6rem"}
        >
          {Intl.NumberFormat("no-NB").format(maximumThreshold)} kr
        </text>

        {/* Minimum threshold tick */}
        <g
          style={{
            transition: "all 0.5s",
            opacity: value >= minimumThreshold ? 0 : 1,
          }}
        >
          <line
            x1={-5}
            y1={dimensions.height - padding.bottom - scale(minimumThreshold)}
            x2={0}
            y2={dimensions.height - padding.bottom - scale(minimumThreshold)}
            stroke="black"
            strokeWidth="1"
          />
          <text
            x={-12}
            y={dimensions.height - padding.bottom - scale(minimumThreshold) - 8}
            textAnchor="end"
            alignmentBaseline="middle"
          >
            Minstegrense
          </text>
          <text
            x={-12}
            y={dimensions.height - padding.bottom - scale(minimumThreshold) + 8}
            textAnchor="end"
            alignmentBaseline="middle"
            fontSize={"0.6rem"}
          >
            {Intl.NumberFormat("no-NB").format(minimumThreshold)} kr
          </text>
        </g>

        {/* Calculate positions and check for overlap */}
        {(() => {
          const LABEL_HEIGHT = 34; // Total height of label (including both text elements)
          const OVERLAP_THRESHOLD = LABEL_HEIGHT + 4; // Add small buffer

          const deductionY =
            dimensions.height - padding.bottom - scale(Math.min(value, maximumThreshold));
          const benefitY = dimensions.height - padding.bottom - scale(taxBenefit);

          // Calculate the distance between the two ticks
          const distance = Math.abs(deductionY - benefitY);

          // Calculate the overlap between the two labels
          const labelOverlap = distance - LABEL_HEIGHT;
          const isOverlapping = labelOverlap < 0;
          const overlapAdjustment = isOverlapping ? Math.abs(labelOverlap) / 2 : 0;
          console.log(labelOverlap, isOverlapping, overlapAdjustment);

          return (
            <>
              {/* Current value tick */}
              <g
                style={{
                  transition: "all 0.5s",
                  transform: `translateY(${deductionY}px)`,
                  opacity: value >= minimumThreshold && value < maximumThreshold ? 1 : 0,
                }}
              >
                <line x1={-5} y1={0} x2={0} y2={0} stroke="black" strokeWidth="1" />
                <g
                  style={{
                    transition: "all 0.5s",
                    transform: `translateY(${-overlapAdjustment}px)`,
                  }}
                >
                  <text
                    x={-12}
                    y={-8}
                    textAnchor="end"
                    alignmentBaseline="middle"
                    paintOrder={"stroke"}
                    fill="black"
                    stroke="white"
                    strokeWidth="6"
                  >
                    Donasjoner
                  </text>
                  <text
                    x={-12}
                    y={8}
                    textAnchor="end"
                    alignmentBaseline="middle"
                    fontSize={"0.6rem"}
                    paintOrder={"stroke"}
                    fill="black"
                    stroke="#fafafa"
                    strokeWidth="6"
                  >
                    {Intl.NumberFormat("no-NB").format(Math.min(value, maximumThreshold))} kr
                  </text>
                </g>
              </g>

              {/* Tax benefit tick */}
              <g
                style={{
                  transition: "all 0.5s",
                  transform: `translateY(${benefitY}px)`,
                  opacity: taxBenefit > 0 ? 1 : 0,
                }}
              >
                <line x1={-5} y1={0} x2={0} y2={0} stroke="black" strokeWidth="1" />
                <g
                  style={{
                    transition: "all 0.5s",
                    transform: `translateY(${overlapAdjustment}px)`,
                  }}
                >
                  <text x={-12} y={-8} textAnchor="end" alignmentBaseline="middle">
                    Du får tilbake
                  </text>
                  <text
                    x={-12}
                    y={8}
                    textAnchor="end"
                    alignmentBaseline="middle"
                    fontSize={"0.6rem"}
                  >
                    {Intl.NumberFormat("no-NB").format(taxBenefit)} kr
                  </text>
                </g>
              </g>
            </>
          );
        })()}

        {/* Main deduction bar */}
        <rect
          x={padding.left}
          y={-(dimensions.height - padding.bottom)}
          width={Math.min(chartWidth, 160)}
          height={scale(Math.min(value, maximumThreshold))}
          transform={"scale(1,-1)"}
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
            y={-(dimensions.height - padding.bottom)}
            width={Math.min(chartWidth, 160)}
            height={scale(taxBenefit)}
            transform={"scale(1,-1)"}
            fill="url(#diagonalHatch)"
            style={{
              transition: "all 0.5s",
            }}
          />
        )}
      </svg>
    </div>
  );
};
