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
  width: 1.5625rem;
  position: absolute;
  height: 0.0625rem;
  background: var(--primary);
  align-items: center;
  margin-left: 0.9rem;
  margin-top: 0.625rem;
`;
export const ProgressLineHorizontalDotted = styled.div`
  border-top: 0.125rem dotted black;
  width: 1.5625rem;
  position: absolute;
  height: 0.0625rem;
  background: var(--primary);
  align-items: center;
  margin-left: 1.25rem;
  margin-top: 0.625rem;
`;

export const ProgressCircleLarge = styled.div`
  width: 2.2rem;
  height: 2.2rem;
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
  margin-left 0.6rem;
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
  height: 98%;
  position: absolute;
  top: 50%;
  left: 0.75rem;
  width: 0.125rem;
  transform: translate(-50%, -50%);
  background: var(--primary);
  margin-left 0.38rem;
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
  margin-left 0.44rem;
`;

export const TextLarge = styled.div`
  font-size: 1.25rem;
}
`;

export const TextInfo = styled.div`
padding-top: 0.5rem;
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
