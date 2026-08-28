import React, { useState } from "react";
import AnimateHeight from "react-animate-height";
import { ChevronDown } from "react-feather";
import { PortableText } from "next-sanity";
import { CauseAreaDisplayConfig } from "../../../types/WidgetProps";
import { Links } from "../../../../../../main/blocks/Links/Links";
import { RolloutAccordion } from "../../panes/AmountPane.style";
import { useIsMobile } from "../../../../../../../hooks/useIsMobile";

interface CauseAreaRolloutProps {
  causeAreaId: number;
  config?: CauseAreaDisplayConfig;
}

export const CauseAreaRollout: React.FC<CauseAreaRolloutProps> = ({ causeAreaId, config }) => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const rollout = config?.cause_area_rollouts?.find((item) => item.cause_area_id === causeAreaId);

  if (!rollout?.title) return null;

  return (
    <RolloutAccordion>
      <div onClick={() => setOpen(!open)}>
        <span>{rollout.title}</span>
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
          {rollout.text && <PortableText value={rollout.text} />}
          {rollout.links && <Links links={rollout.links} newtab={isMobile} />}
        </div>
      </AnimateHeight>
    </RolloutAccordion>
  );
};
