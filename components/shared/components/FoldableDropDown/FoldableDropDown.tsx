import { PortableText } from "@portabletext/react";
import { useState } from "react";
import AnimateHeight from "react-animate-height";
import style from "./FoldableDropDown.module.scss";

export const FoldableDropDown: React.FC<{
  title: string;
  dropDownText: any[] | string;
  smallText?: string;
  color?: string;
}> = ({ title, dropDownText, smallText, color }) => {
  const [showImpactEstimateExplanation, setShowImpactEstimateExplanation] = useState(false);

  const renderDropDownText = () => {
    if (Array.isArray(dropDownText)) {
      return <PortableText value={dropDownText} />;
    } else if (typeof dropDownText === "string") {
      return <div className={style.popUpText}>{dropDownText}</div>;
    } else {
      return null; // Or some default content for unsupported types
    }
  };

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
        {renderDropDownText()}
      </AnimateHeight>
    </div>
  );
};
