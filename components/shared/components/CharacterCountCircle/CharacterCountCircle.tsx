import React, { useMemo } from "react";
import styles from "./CharacterCountCircle.module.scss";
import { useRemSize } from "../../../../hooks/useRemSize";

interface CharacterCountCircleProps {
  count: number;
  max: number;
}

const CharacterCountCircle: React.FC<CharacterCountCircleProps> = ({ count, max }) => {
  const remInPixels = useRemSize();

  const { SVG_SIZE, STROKE_WIDTH, radius, circumference } = useMemo(() => {
    const size = Math.round(remInPixels);
    const stroke = Math.max(1.5, Math.round(size / 7));
    const rad = size / 2 - stroke / 2;
    const circ = 2 * Math.PI * rad;
    return { SVG_SIZE: size, STROKE_WIDTH: stroke, radius: rad, circumference: circ };
  }, [remInPixels]);

  const clampedCount = Math.min(count, max);
  const percentage = max > 0 ? (clampedCount / max) * 100 : 0;
  const offset = circumference - (percentage / 100) * circumference;

  let strokeColorClass = styles.normal;
  if (percentage >= 100) {
    strokeColorClass = styles.warning;
  } else if (percentage >= 90) {
    strokeColorClass = styles.warning;
  }

  const safeOffset = Math.max(0, offset);

  return (
    <div className={styles.characterCountContainer} aria-live="polite" aria-atomic="true">
      <span className={styles.countText}>{`${clampedCount}/${max}`}</span>
      <svg
        width={SVG_SIZE}
        height={SVG_SIZE}
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        className={styles.circleSvg}
        role="img"
        aria-label={`Character count progress: ${percentage.toFixed(0)}%`}
      >
        <circle
          className={styles.backgroundCircle}
          strokeWidth={STROKE_WIDTH}
          fill="transparent"
          r={radius}
          cx={SVG_SIZE / 2}
          cy={SVG_SIZE / 2}
        />
        <circle
          className={`${styles.progressCircle} ${strokeColorClass}`}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={circumference}
          strokeDashoffset={safeOffset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={SVG_SIZE / 2}
          cy={SVG_SIZE / 2}
        />
      </svg>
    </div>
  );
};

export default CharacterCountCircle;
