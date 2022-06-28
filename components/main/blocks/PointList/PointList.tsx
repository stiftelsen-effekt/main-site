import React from "react";
import elements from "./PointList.module.scss";
import { PointListPoint, PointListPointProps } from "./PointListPoint";

export const PointList: React.FC<{ points: PointListPointProps[] }> = ({ points }) => {
  return (
    <div className={elements.pointlistwrapper}>
      {points.map((point) => (
        <PointListPoint
          key={point.number || point.heading}
          number={point.number}
          heading={point.heading}
          paragraph={point.paragraph}
        />
      ))}
    </div>
  );
};
