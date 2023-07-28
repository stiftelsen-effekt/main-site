import { PortableText } from "@portabletext/react";
import { useState } from "react";
import AnimateHeight from "react-animate-height";
import style from "./FoldableDropDown.module.scss";

export const FoldableDropDown: React.FC<{
  title: string;
  dropDownText: any[];
  smallText: string;
  color?: string;
}> = ({ title, dropDownText, smallText, color }) => {
  const [showImpactEstimateExplanation, setShowImpactEstimateExplanation] = useState(false);
  return (
    <div className={style.timelineContainer} style={{ color: color }}>
      <span
        className={
          showImpactEstimateExplanation
            ? [style.caption, style.captionopen].join(" ")
            : style.caption
        }
        onClick={() => setShowImpactEstimateExplanation(!showImpactEstimateExplanation)}
      >
        {title}&nbsp;&nbsp;
      </span>
      <div className={style.smallText}> {smallText} </div>
      <AnimateHeight duration={500} height={showImpactEstimateExplanation ? "auto" : 0}>
        <div className={style.impactExplanationContainer}>{dropDownText}</div>
      </AnimateHeight>
    </div>
  );
};
