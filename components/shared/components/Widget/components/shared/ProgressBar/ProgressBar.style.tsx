import styled from "styled-components";
import { orange20 } from "../../../config/colors";
import exp from "constants";
import Link from "next/link";

export const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 30px 40px;
  padding-bottom: 10px;
`;

export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-width: 200px;
  width: 100%;
  position: relative;
  margin: 0 auto;
`;

interface ProgressCircleProps {
  filled: string;
}

/** Typed */
export const ProgressCircle = styled.div.withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) => !["filled"].includes(prop),
})<ProgressCircleProps>`
  width: 20px;
  height: 20px;
  border: 1px solid var(--primary);
  background: ${(props: ProgressCircleProps) =>
    props.filled === "true" ? `var(--primary)` : `var(--secondary)`};
  border-radius: 50%;
  position: relative;
  z-index: 2;
`;

export const ProgressLine = styled.div`
  width: 100%;
  position: absolute;
  top: calc(50% - 0.5px);
  left: 0;
  height: 1px;
  background: var(--primary);
`;

interface ActionButtonProps {
  active?: string;
}

export const ActionButton = styled.button.withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) => !["active"].includes(prop),
})<ActionButtonProps>`
  font-size: 40px;
  line-height: 40px;
  padding: 8px;
  background: none;
  color: var(--primary);
  border: none;
  transition: all 200ms ease-in-out;
  transform: ${(props: ActionButtonProps) =>
    props.active === "true" ? `translateX(-50%)` : `translateX(0)`};
  opacity: ${(props: ActionButtonProps) => (props.active === "true" ? "0" : "1")};
  cursor: ${(props: ActionButtonProps) => (props.active === "true" ? "auto" : "pointer")};
  outline: none;

  &:focus {
    transition: none;
    outline: 2px solid var(--primary);
  }

  &:active {
    outline: none;
  }
`;

export const TooltipWrapper = styled.div<{
  top: number;
}>`
  position: absolute;
  top: ${(props) => Math.round(props.top)}px;
  margin-left: 30px;
  margin-right: 10px;
  right: 20px;
  font-size: 18px;
  z-index: 100;
  border-radius: 10px;
  overflow: hidden;
  pointer-events: none;
`;

export const TooltipContent = styled.div`
  background: var(--primary);
  color: var(--secondary);
  padding: 40px;
  /* pointer-events: none; */
  width: 100%;

  @media (pointer: coarse) {
    padding-bottom: 20px;
  }
`;

export const TooltipLink = styled(Link)`
  background: var(--primary);
  color: var(--secondary);
  padding: 20px 40px;
  width: 100%;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  display: block;
  z-index: 101;
  text-decoration: underline;

  @media (pointer: fine) {
    display: none;
  }
`;
