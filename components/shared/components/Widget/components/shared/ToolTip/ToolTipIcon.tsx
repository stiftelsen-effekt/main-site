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
  toggleTooltip: (state: boolean) => void;
  onClick: () => void;
}
export function ToolTipIcon({ toggleTooltip, onClick }: ToolIconProps) {
  return (
    <TooltipIconButton
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") {
          e.currentTarget.focus();
        }
      }}
      onFocus={() => toggleTooltip(true)}
      // Small timeout to prevent tooltip from closing when clicking on the tooltip link
      onBlur={() => setTimeout(() => toggleTooltip(false), 100)}
      onPointerDown={(e) => {
        if (e.pointerType === "mouse") {
          onClick();
        } else {
          if (e.currentTarget === document.activeElement) {
            e.currentTarget.blur();
            e.preventDefault();
          } else {
            e.currentTarget.focus();
            e.preventDefault();
          }
        }
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") {
          e.currentTarget.blur();
        }
      }}
    >
      <TooltipInnerIcon>?</TooltipInnerIcon>
    </TooltipIconButton>
  );
}
