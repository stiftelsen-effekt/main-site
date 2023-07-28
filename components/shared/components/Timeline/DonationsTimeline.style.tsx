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

export const TimelineContainerLastNode = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  padding-top: 3.5rem;
  top: 0%;
`;

export const TimelineItem = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 1.3rem;
  justify-content: space-between;
  align-items: flex-start;
  max-height: 12.5rem;
  height: 100%;
  position: relative;
`;

export const TimelineItemBranch = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 1.3rem;
  align-items: flex-start;
  max-height: 12.5rem;
  height: 100%;
  position: relative;
  margin-bottom: 0.3125rem;
`;

export const TimelineRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 2.6rem;
`;

export const ProgressLineHorizontal = styled.div`
  width: 1.8rem;
  position: absolute;
  height: 0.0625rem;
  background: var(--primary);
  align-items: center;
  margin-left: 0.65rem;
  margin-top: 0.625rem;
`;
export const ProgressLineHorizontalDotted = styled.div`
  border-top: 0.125rem dotted black;
  width: 1.8rem;
  position: absolute;
  height: 0.0625rem;
  background: var(--primary);
  align-items: center;
  margin-left: 0.8rem;
  margin-top: 0.625rem;
`;

export const ProgressCircleLarge = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border: 0.0625rem solid var(--primary);
  background-color: ${(props: ProgressCircleProps) =>
    props.filled ? `var(--primary)` : `var(--secondary)`};
  border-radius: 50%;
  position: relative;
  z-index: 2;
  margin-bottom 2.5rem;
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
  margin-bottom 2.6rem;
  margin-left 0.21rem;
`;

export const ProgressCircleLast = styled.div`
  width: 1.1em;
  height: 1.1em;
  border: 0.0625rem solid var(--primary);
  background-color: ${(props: ProgressCircleProps) =>
    props.filled ? `var(--primary)` : `var(--secondary)`};
  border-radius: 50%;
  position: relative;
  z-index: 2;
  margin-left 0.21rem;
`;

export const ProgressCircleSmall = styled.div`
  width: .9em;
  height: .9em;
  border: 0.0625rem solid var(--primary);
  background-color: ${(props: ProgressCircleProps) =>
    props.filled ? `var(--primary)` : `var(--secondary)`};
  border-radius: 50%;
  position: relative;
  z-index: 2;
  margin-bottom 1.4rem;
  margin-left 2.3rem;
  margin-top: 0.3125rem;
`;

export const ProgressLine = styled.div`
  height: 96%;
  position: absolute;
  top: 50%;
  left: 0.66rem;
  width: 0.12rem;
  transform: translate(-50%, -50%);
  background: var(--primary);
`;

export const ProgressLineOverlay = styled.div`
  height: 117%;
  position: absolute;
  top: -35%;
  left: 0.66rem;
  width: 0.125rem;
  transform: translate(-50%, -50%);
  background: var(--primary);
`;

export const ProgressLineDotted = styled.div`
  height: 98%;
  border: none;
  border-left: 0.125rem dotted black;
  position: absolute;
  top: 50%;
  left: 0.66rem;
  width: 0.125rem;
  transform: translate(-50%, -50%);
  background: var(--primary);
`;

export const ProgressLineDottedLastNode = styled.div`
  height: 30%;
  border: none;
  border-left: 0.125rem dotted black;
  position: absolute;
  top: 35%;
  left: 0.66rem;
  width: 0.125rem;
  transform: translate(-50%, -50%);
  background: var(--primary);
`;

export const ProgressLineLastNode = styled.div`
  height: 30%;
  border: none;
  position: absolute;
  top: 35%;
  left: 0.66rem;
  width: 0.125rem;
  transform: translate(-50%, -50%);
  background: var(--primary);
`;

export const TextLarge = styled.div`
  font-size: 1.25rem;
}
`;

export const TextInfo = styled.div`
font-size: 1rem;
}
`;

export const TextInfo2 = styled.div`
  font-size: 0.875rem;
}
`;
export const TextInfo3 = styled.div`
  font-size: .9rem;

}
`;

export const TextSmall = styled.div`
  font-size: .6rem;
}
`;

export const TimelineContainerWithSplit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  position: relative;
  margin-top: 1.6rem;
`;
