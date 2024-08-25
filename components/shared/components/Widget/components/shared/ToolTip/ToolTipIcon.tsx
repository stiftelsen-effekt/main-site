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
  vertical-align: middle;
  padding: 0 10px;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }

  &:focus > div {
    outline: 2px solid var(--primary);
  }
`;

const TooltipInnerIcon = styled.div`
  border: 1px solid var(--primary);
  width: 2em;
  height: 2em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-size: 0.8em;
  vertical-align: middle;
`;

interface ToolIconProps {
  handleTouch: () => void;
  handleHover: (open: boolean) => void;
  handleFocus: () => void;
  handleBlur: () => void;
}
export function ToolTipIcon({ handleTouch, handleHover, handleFocus, handleBlur }: ToolIconProps) {
  return (
    <TooltipIconButton
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      onFocus={() => handleFocus()}
      onBlur={() => handleBlur()}
    >
      <TooltipInnerIcon>?</TooltipInnerIcon>
    </TooltipIconButton>
  );
}
