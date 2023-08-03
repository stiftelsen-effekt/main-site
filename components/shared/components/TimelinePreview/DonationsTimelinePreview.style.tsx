import styled from "styled-components";

interface ProgressCircleProps {
  filled: boolean;
}
export const HeaderContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.625rem 0.125rem;
`;

export const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
`;

export const TimelineItem = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 1rem;
  justify-content: space-between;
  align-items: flex-start;
  max-height: 12.5rem;
  height: 100%;
  position: relative;
`;

export const TimelineItemSmall = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 1.45rem;
  justify-content: space-between;
  align-items: flex-start;
  max-height: 12.5rem;
  height: 100%;
  position: relative;
`;

export const ProgressCircleLarge = styled.div`
  width: 1.8rem;
  height: 1.8rem;
  border: 0.0625rem solid var(--primary);
  background-color: ${(props: ProgressCircleProps) =>
    props.filled ? `var(--primary)` : `var(--secondary)`};
  border-radius: 50%;
  position: relative;
  z-index: 2;
  margin-bottom 1rem;
`;

export const ProgressCircle = styled.div`
  width: 1.1em;
  height: 1.1em;
  border: 0.0625rem solid var(--primary);
  background-color: ${(props: ProgressCircleProps) =>
    props.filled ? `var(--primary)` : `var(--secondary)`};
  border-radius: 50%;
  position: relative;
  z-index: 2;
  margin-bottom 1rem;
  margin-left 0.38rem;
`;

export const ProgressLine = styled.div`
  height: 98%;
  position: absolute;
  top: 50%;
  left: 0.75rem;
  width: 0.125rem;
  transform: translate(-50%, -50%);
  background: var(--primary);
  margin-left 0.18rem;
`;

export const ProgressLineDotted = styled.div`
  height: 100%;
  border: none;
  border-left: 0.125rem dotted black;
  position: absolute;
  top: 50%;
  left: 0.75rem;
  width: 0.0625rem;
  transform: translate(-50%, -50%);
  background: var(--primary);
  margin-left 0.18rem;
`;

export const TextInfo = styled.div`
padding-top: 0.3rem;
font-size: 1rem;
}
`;
