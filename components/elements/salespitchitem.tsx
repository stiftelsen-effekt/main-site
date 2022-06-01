import React from "react";
import elements from "../../styles/Elements.module.css";

export type SalesPitchPoint = {
  number: number;
  heading: string;
  paragraph: string;
};
export const SalesPitchItem: React.FC<{ point: SalesPitchPoint }> = ({ point }) => {
  return (
    <div className={elements.salespitchitem}>
      <div>
        <h2>{point.number}</h2>
      </div>
      <div>
        <h2>{point.heading}</h2>
        <p>{point.paragraph}</p>
      </div>
    </div>
  );
};
