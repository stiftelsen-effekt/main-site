import styled from "styled-components";
import { orange20 } from "../../../config/colors";

export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 160px;
  position: relative;
  margin: 0 auto;
  margin-bottom: 20px;
`;

interface ProgressCircleProps {
  filled: boolean;
}
export const ProgressCircle = styled.div`
  width: 13px;
  height: 13px;
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
