import React, { useState } from "react";
import AnimateHeight from "react-animate-height";
import { PortableText } from "@portabletext/react";
import { LinkType, Links } from "../../../main/blocks/Links/Links";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
import style from "./ImpactEstimateExplanation.module.scss";

export type ImpactEstimateExplanationConfiguration = {
  impact_estimate_explanation_title?: string;
  impact_estimate_explanation_text?: any[];
  impact_estimate_explanation_links?: (LinkType | NavLink)[];
};

export const ImpactEstimateExplanation: React.FC<{
  explanations?: ImpactEstimateExplanationConfiguration[];
}> = ({ explanations }) => {
  const visibleExplanations = [
    ...new Map(
      (explanations ?? [])
        .filter((explanation) => explanation.impact_estimate_explanation_title)
        .map((explanation) => [explanation.impact_estimate_explanation_title, explanation]),
    ).values(),
  ];

  if (visibleExplanations.length === 0) return null;

  return (
    <div className={style.wrapper}>
      {visibleExplanations.map((explanation) => (
        <ImpactEstimateExplanationItem
          key={explanation.impact_estimate_explanation_title}
          explanation={explanation}
        />
      ))}
    </div>
  );
};

const titleWithAnchoredArrow = (title: string) => {
  const lastSpace = title.lastIndexOf(" ");
  if (lastSpace === -1) {
    return <span className={style.arrowAnchor}>{title}</span>;
  }

  return (
    <>
      {title.slice(0, lastSpace + 1)}
      <span className={style.arrowAnchor}>{title.slice(lastSpace + 1)}</span>
    </>
  );
};

const ImpactEstimateExplanationItem: React.FC<{
  explanation: ImpactEstimateExplanationConfiguration;
}> = ({ explanation }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span
        className={open ? [style.caption, style.captionopen].join(" ") : style.caption}
        onClick={() => setOpen((current) => !current)}
      >
        {titleWithAnchoredArrow(explanation.impact_estimate_explanation_title ?? "")}
      </span>
      <AnimateHeight duration={500} height={open ? "auto" : 0}>
        <div className={style.container}>
          <PortableText value={explanation.impact_estimate_explanation_text} />
          <Links links={explanation.impact_estimate_explanation_links ?? []} />
        </div>
      </AnimateHeight>
    </>
  );
};
