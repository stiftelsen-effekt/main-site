import React from "react";
import elements from "../../styles/Elements.module.css";
import { PointListPoint, PointListPointProps } from "./pointlistpoint";

export const PointList: React.FC<{ points: PointListPointProps[] }> = ({ points }) => {
  return (
    <div className={elements.pointlistwrapper}>
      {points.map(point => <PointListPoint 
        key={point.number || point.heading} 
        number={point.number}
        heading={point.heading}
        paragraph={point.paragraph}
      />)}
    </div>
  )
}