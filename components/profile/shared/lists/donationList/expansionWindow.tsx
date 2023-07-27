import React, { useState } from "react";
import style from "./DonationDetails.module.scss";
import AnimateHeight from "react-animate-height";
import { PortableText } from "@portabletext/react";
import { LinkType, Links } from "../../../../main/blocks/Links/Links";
import { NavLink } from "../../../../main/layout/navbar";
import { TextInfo } from "../../../../shared/components/Timeline/DonationsTimeline.style";
interface Props {
  explanation_title: string;
  text_input: any[];
  title_style: string;
  text_style: string;
}

export const ExpansionWindow: React.FC<Props> = ({
  explanation_title,
  text_input,
  title_style,
  text_style,
}) => {
  const [showStatusEstimateExplanation, setShowStatusEstimateExplanation] = useState(false);

  const handleSpanClick = () => {
    setShowStatusEstimateExplanation(!showStatusEstimateExplanation);
  };

  return (
    <div>
      <span
        className={
          showStatusEstimateExplanation ? [text_style, style.captionopen].join(" ") : text_style
        }
        onClick={handleSpanClick}
      >
        {explanation_title}&nbsp;&nbsp;
      </span>
      <AnimateHeight duration={500} height={showStatusEstimateExplanation ? "auto" : 0}>
        <div className={title_style}>
          <PortableText value={text_input} />
        </div>
      </AnimateHeight>
    </div>
  );
};
