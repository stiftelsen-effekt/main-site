import React from "react";
import styled from "styled-components";

const TooltipIconButton = styled.button.attrs({
  name: "Info om skattefradrag",
  type: "button",
})`
  z-index: 4;
  pointer-events: all;
  background: transparent;
  height: 100%;
  vertical-align: center;
  margin-left: 10px;
  padding: 0 10px;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

const TooltipInnerIcon = styled.div`
  border: 1px solid var(--primary);
  width: 34px;
  height: 34px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-size: 20px;
`;

interface ToolIconProps {
  handleTouch: () => void;
  handleHover: (open: boolean) => void;
}
export function ToolTipIcon({ handleTouch, handleHover }: ToolIconProps) {
  return (
    <TooltipIconButton
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <TooltipInnerIcon>?</TooltipInnerIcon>
    </TooltipIconButton>
  );
}
