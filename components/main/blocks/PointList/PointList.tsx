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
  return (
    <div className={[elements.pointlistwrapper, layout === "top" ? elements.top : ""].join(" ")}>
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
