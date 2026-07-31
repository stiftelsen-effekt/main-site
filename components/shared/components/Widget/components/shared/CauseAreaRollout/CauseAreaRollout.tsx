import React, { useState } from "react";
import AnimateHeight from "react-animate-height";
import { ChevronDown } from "react-feather";
import { PortableText } from "next-sanity";
import { CauseAreaDisplayConfig, InfoBoxConfig } from "../../../types/WidgetProps";
import { NavLink } from "../../../../Navbar/Navbar";
import { Links, LinkType } from "../../../../../../main/blocks/Links/Links";
import { RolloutAccordion } from "../../panes/AmountPane.style";
import { useIsMobile } from "../../../../../../../hooks/useIsMobile";

interface CauseAreaRolloutProps {
  causeAreaId: number;
  config?: CauseAreaDisplayConfig;
  fallback?: InfoBoxConfig & { links?: (LinkType | NavLink)[] };
}

export const CauseAreaRollout: React.FC<CauseAreaRolloutProps> = ({
  causeAreaId,
  config,
  fallback,
}) => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const rollout = config?.cause_area_rollouts?.find((item) => item.cause_area_id === causeAreaId);
  const title = rollout?.title ?? fallback?.label_text;
  const text = rollout?.text ?? fallback?.description;
  const links = rollout?.links ?? fallback?.links ?? (fallback?.link ? [fallback.link] : undefined);

  if (!title) return null;

  return (
    <RolloutAccordion>
      <div onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <ChevronDown
          size={28}
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        />
      </div>
      <AnimateHeight height={open ? "auto" : 0}>
        <div>
          {text && <PortableText value={text} />}
          {links && <Links links={links} newtab={isMobile} />}
        </div>
      </AnimateHeight>
    </RolloutAccordion>
  );
};
