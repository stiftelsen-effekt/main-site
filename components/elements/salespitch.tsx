import React from "react";
import elements from "../../styles/Elements.module.css";
import { SalesPitchItem, SalesPitchPoint } from "./salespitchitem";

export const SalesPitch: React.FC<{ points: SalesPitchPoint[] }> = ({ points }) => {
  return (
    <div className={elements.salespitchwrapper}>
      {points.map(point => <SalesPitchItem key={point.number} point={point} />)}
    </div>
  )
}