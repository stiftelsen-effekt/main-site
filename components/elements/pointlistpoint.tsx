import React from "react";
import elements from "../../styles/Elements.module.css";

export type PointListPointProps = {
  number?: number;
  heading: string;
  paragraph: string;
};
export const PointListPoint: React.FC<PointListPointProps> = ({
  number = null,
  heading,
  paragraph,
}) => {
  return (
    <div className={elements.pointlistpoint}>
      {number !== null ? (
        <div>
          <h5>{number}</h5>
        </div>
      ) : null}
      <div>
        <h5>{heading}</h5>
        <p>{paragraph}</p>
      </div>
    </div>
  );
};
