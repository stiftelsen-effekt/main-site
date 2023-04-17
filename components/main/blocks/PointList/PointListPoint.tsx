import React from "react";
import elements from "./PointListPoint.module.scss";

export type PointListPointProps = {
  number?: number;
  layout: "left" | "top";
  heading: string;
  paragraph: string;
};
export const PointListPoint: React.FC<PointListPointProps> = ({
  number,
  layout,
  heading,
  paragraph,
}) => {
  return (
    <div className={[elements.pointlistpoint, layout === "top" ? elements.top : ""].join(" ")}>
      {number != null ? (
        <h5 className={elements.pointlistpoint__number}>
          {layout === "left" ? `${number}` : `0${number}.`}
        </h5>
      ) : null}
      <div>
        <h5 className={elements.pointlistpoint__heading}>{heading}</h5>
        <p className={elements.pointlistpoint__paragraph}>{paragraph}</p>
      </div>
    </div>
  );
};
