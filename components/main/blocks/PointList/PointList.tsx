import React from "react";
import elements from "./PointList.module.scss";
import { PointListPoint, PointListPointProps } from "./PointListPoint";

type PointListProps = {
  points: {
    heading: string;
    paragraph: string;
  }[];
  numbered?: boolean;
  options?: {
    layout?: "left" | "top";
  };
};

export const PointList: React.FC<PointListProps> = ({ points, options, numbered }) => {
  const layout = options?.layout || "left";

  const classes = [elements.pointlistwrapper];

  if (layout === "top") {
    classes.push(elements.top);
  }

  /**
   * We've used explicit rules for layouts up to 12 points.
   * For layouts with more than 12 points, we'll use a auto grid layout.
   */
  if (points.length > 12) {
    classes.push(elements.autogrid);
  }

  return (
    <div className={classes.join(" ")}>
      {points.map((point, index) => (
        <PointListPoint
          key={`${index}-${point.heading}`}
          number={numbered ? index + 1 : undefined}
          heading={point.heading}
          paragraph={point.paragraph}
          layout={layout}
        />
      ))}
    </div>
  );
};
