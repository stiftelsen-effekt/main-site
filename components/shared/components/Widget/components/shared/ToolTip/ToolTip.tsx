import React, { useContext, useState } from "react";
import styled from "styled-components";
import { WidgetTooltipContext } from "../../Widget";
import { ToolTipIcon } from "./ToolTipIcon";

const ToolTipWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
`;

export const ToolTip: React.FC<{ text: string; linkUrl?: string }> = ({ text, linkUrl }) => {
  const [tooltip, setTooltip] = useContext(WidgetTooltipContext);
  return (
    <ToolTipWrapper>
      <ToolTipIcon
        toggleTooltip={(state: boolean) =>
          state ? setTooltip({ text, link: linkUrl }) : setTooltip(null)
        }
        onClick={() => linkUrl && window.open(linkUrl, "_blank")}
      />
    </ToolTipWrapper>
  );
};
