import React, { useState } from "react";
import styled from "styled-components";
import { ToolTipIcon } from "./ToolTipIcon";

const ToolTipWrapper = styled.div`
  position: relative;
  display: inline;
  z-index: 2;
  vertical-align: middle;
`;

const ToolTipText = styled.span`
  font-size: 14px;
  background-color: var(--primary);
  color: var(--secondary);
  margin-left: -10px;
  line-height: 150%;
  bottom: 25px;
  height: auto;
  width: 250px;
  padding: 20px;
  position: absolute;
  display: none;
  white-space: pre-wrap;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  z-index: 5;
`;

interface ToolTipProps {
  text?: string;
  textMarginLeft?: string;
  textMarginTop?: string;
  marginLeft?: string;
  marginTop?: string;
}

export const ToolTip: React.FC<ToolTipProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ToolTipWrapper style={{ marginLeft: props.marginLeft, marginTop: props.marginTop }}>
      <ToolTipIcon handleTouch={() => setIsOpen(!isOpen)} handleHover={setIsOpen} />

      <ToolTipText
        style={{
          display: isOpen ? "block" : "none",
          marginLeft: props.textMarginLeft,
          marginTop: props.textMarginTop,
        }}
      >
        {props.text}
      </ToolTipText>
    </ToolTipWrapper>
  );
};
