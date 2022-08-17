import React, { useContext, useState } from "react";
import styled from "styled-components";
import { WidgetTooltipContext } from "../../Widget";
import { ToolTipIcon } from "./ToolTipIcon";

const ToolTipWrapper = styled.div`
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  margin-bottom: 12px;
`;

export const ToolTip: React.FC<{ text: string }> = ({ text }) => {
  const [tooltip, setTooltip] = useContext(WidgetTooltipContext);
  return (
    <ToolTipWrapper>
      <ToolTipIcon
        handleTouch={() => setTooltip(tooltip === null ? setTooltip(text) : setTooltip(null))}
        handleHover={(state: boolean) => (state ? setTooltip(text) : setTooltip(null))}
        handleFocus={() => setTooltip(text)}
        handleBlur={() => setTooltip(null)}
      />
    </ToolTipWrapper>
  );
};
