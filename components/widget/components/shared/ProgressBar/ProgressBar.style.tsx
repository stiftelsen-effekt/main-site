import styled from "styled-components";
import { orange20 } from "../../../config/colors";

export const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 30px 40px;
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
  filled: boolean;
}
export const ProgressCircle = styled.div`
  width: 20px;
  height: 20px;
  border: 1px solid var(--primary);
  background: ${(props: ProgressCircleProps) =>
    props.filled ? `var(--primary)` : `var(--secondary)`};
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

export const ActionButton = styled.button`
  font-size: 40px;
  line-height: 40px;
  padding: 8px;
  background: none;
  color: var(--primary);
  border: none;
  transition: all 200ms ease-in-out;
  transform: ${(props: ActionButtonProps) => (props.active ? `translateX(-50%)` : `translateX(0)`)};
  opacity: ${(props: ActionButtonProps) => (props.active ? `0` : `1`)};
  cursor: pointer;
`;

interface ActionButtonProps {
  active?: boolean;
}
