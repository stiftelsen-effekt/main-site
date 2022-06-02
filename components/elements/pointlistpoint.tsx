import React from "react"
import elements from "../../styles/Elements.module.css";

export type PointListPointProps = {
  number?: number; 
  heading: string;
  paragraph: string;
}
export const PointListPoint: React.FC<PointListPointProps> = ({ number = null, heading, paragraph }) => {
  return (<div className={elements.pointlistpoint}>
    {
      number !== null ?
      <div>
        <h2>{number}</h2>
      </div> :
      null
    }
    <div>
      <h2>{heading}</h2>
      <p>{paragraph}</p>
    </div>
  </div>)
}