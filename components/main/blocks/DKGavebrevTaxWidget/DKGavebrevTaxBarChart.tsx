import React, { useEffect, useRef, useState } from "react";
import { useRemSize } from "../../../../hooks/useRemSize";
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

export const DKGavebrevTaxBarChart: React.FC<BarChartProps> = ({
  donation,
  maximumDeduction,
  taxBenefit,
  labels,
  locale,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });
  const remSize = useRemSize();

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

  const padding: Padding = { left: 0, right: 0, top: 3 * remSize, bottom: 0 };
  const chartWidth = Math.max(dimensions.width - padding.left - padding.right, 0);
  const chartHeight = Math.max(dimensions.height - padding.top - padding.bottom, 0);

  // Scale function: everything is relative to maximum deduction
  const scale = (val: number): number => {
    if (maximumDeduction === 0) return 0;
    return (val / maximumDeduction) * chartHeight;
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {dimensions.width !== 0 && dimensions.height !== 0 && (
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

          {/* Maximum deduction tick (top) */}
          <line
            x1={-remSize * 0.5}
            y1={padding.top + 0.5}
            x2={0}
            y2={padding.top + 0.5}
            stroke="black"
            strokeWidth="1"
          />
          <text
            x={-remSize * 1}
            y={padding.top - remSize * 0.6}
            textAnchor="end"
            alignmentBaseline="middle"
          >
            {labels?.maximumDeduction || "Maksimalt fradrag muligt"}
          </text>
          <text
            x={-remSize * 1}
            y={padding.top + remSize * 0.6}
            textAnchor="end"
            alignmentBaseline="middle"
            fontSize={"0.75rem"}
          >
            {thousandize(maximumDeduction, locale)} kr
          </text>

          {/* Calculate positions for donation and tax benefit markers */}
          {(() => {
            const LABEL_HEIGHT = 2 * remSize;

            const donationY =
              dimensions.height -
              padding.bottom -
              scale(Math.min(donation, maximumDeduction)) +
              0.5;
            const benefitY = dimensions.height - padding.bottom - scale(taxBenefit);

            // Calculate overlap and adjustment
            const distance = Math.abs(donationY - benefitY);
            const labelOverlap = distance - LABEL_HEIGHT - remSize * 0.5;
            const isOverlapping = labelOverlap < 0;
            const overlapAdjustment = isOverlapping ? Math.abs(labelOverlap) / 2 : 0;

            return (
              <>
                {/* Donation marker */}
                <g
                  style={{
                    transition: "all 0.5s",
                    transform: `translateY(${donationY}px)`,
                    opacity: donation > 0 && donation < maximumDeduction ? 1 : 0,
                  }}
                >
                  <line x1={-remSize * 0.5} y1={0} x2={0} y2={0} stroke="black" strokeWidth="1" />
                  <g
                    style={{
                      transition: "all 0.5s",
                      transform: `translateY(${-overlapAdjustment}px)`,
                    }}
                  >
                    <text
                      x={-remSize * 1}
                      y={-remSize * 0.6}
                      textAnchor="end"
                      alignmentBaseline="middle"
                      paintOrder={"stroke"}
                      fill="black"
                      stroke="#fafafa"
                      strokeWidth="6"
                    >
                      {labels?.yourDonation || "Din donation"}
                    </text>
                    <text
                      x={-remSize * 1}
                      y={remSize * 0.6}
                      textAnchor="end"
                      alignmentBaseline="middle"
                      fontSize={"0.75rem"}
                      paintOrder={"stroke"}
                      fill="black"
                      stroke="#fafafa"
                      strokeWidth="6"
                    >
                      {thousandize(Math.min(donation, maximumDeduction), locale)} kr
                    </text>
                  </g>
                </g>

                {/* Tax benefit marker */}
                <g
                  style={{
                    transition: "all 0.5s",
                    transform: `translateY(${benefitY}px)`,
                    opacity: taxBenefit > 0 ? 1 : 0,
                  }}
                >
                  <line x1={-remSize * 0.5} y1={0} x2={0} y2={0} stroke="black" strokeWidth="1" />
                  <g
                    style={{
                      transition: "all 0.5s",
                      transform: `translateY(${overlapAdjustment}px)`,
                    }}
                  >
                    <text
                      x={-remSize * 1}
                      y={-remSize * 0.6}
                      textAnchor="end"
                      alignmentBaseline="middle"
                    >
                      {labels?.yourTaxBenefit || "Dit fradrag"}
                    </text>
                    <text
                      x={-remSize * 1}
                      y={remSize * 0.6}
                      textAnchor="end"
                      alignmentBaseline="middle"
                      fontSize={"0.75rem"}
                    >
                      {thousandize(taxBenefit, locale)} kr
                    </text>
                  </g>
                </g>
              </>
            );
          })()}

          {/* Main donation bar */}
          <rect
            x={padding.left}
            y={-(dimensions.height - padding.bottom)}
            width={Math.min(chartWidth, 160)}
            height={scale(Math.min(donation, maximumDeduction))}
            transform={"scale(1,-1)"}
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
      )}
    </div>
  );
};
