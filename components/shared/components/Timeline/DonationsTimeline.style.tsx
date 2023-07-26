import styled from "styled-components";
import { DonationStatusModal } from "../../../profile/donations/DonationsStatus/DonationStatusModal";

import { TimelineProps } from "../../../profile/donations/DonationsStatus/DonationStatusJson/DonationStatusJsonProps";

interface ProgressCircleProps {
  filled: boolean;
}
export const HeaderContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 10px 2px;
`;

export const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  position: relative;
`;

export const TimelineItem = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 30px;
  justify-content: space-between;
  align-items: flex-start;
  max-height: 200px;
  height: 100%;
  position: relative;
`;

export const TimelineItemBranch = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 30px;
  justify-content: space-between;
  align-items: flex-start;
  max-height: 200px;
  height: 100%;
  position: relative;
  margin-bottom: 5px;
`;

export const TimelineRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 40px;
`;

export const ProgressLineHorizontal = styled.div`
  width: 25px;
  position: absolute;
  height: 1px;
  background: var(--primary);
  align-items: center;
  margin-left: 20px;
  margin-top: 10px;
`;
export const ProgressLineHorizontalDotted = styled.div`
  border-top: 2px dotted black;
  width: 25px;
  position: absolute;
  height: 1px;
  background: var(--primary);
  align-items: center;
  margin-left: 20px;
  margin-top: 10px;
`;

export const ProgressCircleLarge = styled.div`
  width: 40px;
  height: 40px;
  border: 1px solid var(--primary);
  background-color: ${(props: ProgressCircleProps) =>
    props.filled ? `var(--primary)` : `var(--secondary)`};
  border-radius: 50%;
  position: relative;
  z-index: 2;
  margin-bottom 40px;
`;

export const ProgressCircle = styled.div`
  width: 1.1em;
  height: 1.1em;
  border: 1px solid var(--primary);
  background-color: ${(props: ProgressCircleProps) =>
    props.filled ? `var(--primary)` : `var(--secondary)`};
  border-radius: 50%;
  position: relative;
  z-index: 2;
  margin-bottom 2.6rem;
  margin-left 0.3rem;
`;

export const ProgressCircleSmall = styled.div`
  width: .9em;
  height: .9em;
  border: 1px solid var(--primary);
  background-color: ${(props: ProgressCircleProps) =>
    props.filled ? `var(--primary)` : `var(--secondary)`};
  border-radius: 50%;
  position: relative;
  z-index: 2;
  margin-bottom 1.4rem;
  margin-left 45px;
  margin-top: 5px;
`;

export const ProgressLine = styled.div`
  height: 98%;
  position: absolute;
  top: 50%;
  left: 0.75rem;
  width: 2px;
  transform: translate(-50%, -50%);
  background: var(--primary);
`;

export const ProgressLineDotted = styled.div`
  height: 100%;
  border: none;
  border-left: 2px dotted black;
  position: absolute;
  top: 50%;
  left: 0.75rem;
  width: 1px;
  transform: translate(-50%, -50%);
  background: var(--primary);
`;

export const TextLarge = styled.div`
  font-size: 20px;
  margin: 8px;
}
`;

export const TextInfo = styled.div`
font-size: 1rem;
}
`;

export const TextInfo2 = styled.div`
  font-size: 14px;
}
`;
export const TextInfo3 = styled.div`
  font-size: .9rem;

}
`;

export const TextSmall = styled.div`
  font-size: .6rem;
  margin-bottom: 2px;
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

export default function DonationsTimelinePreview({ description, data }: TimelineProps) {
  return (
    <HeaderContainer>
      <TimelineContainer>
        <TimelineContainer>
          <ProgressCircle filled={true} />
          <ProgressLine />
        </TimelineContainer>
        <TimelineContainer>
          <TimelineItem>
            <ProgressCircleLarge filled={true} />
            <TextLarge>{description}</TextLarge>
          </TimelineItem>
          <ProgressLineDotted />
        </TimelineContainer>
        <TimelineItem>
          <ProgressCircle filled={false} />
          <DonationStatusModal description="Se mer her" data={data}></DonationStatusModal>
        </TimelineItem>
      </TimelineContainer>
    </HeaderContainer>
  );
}

//<ProgressLine style={{ "--timeline-length": timelineLength, "--line-height": "1px" } as React.CSSProperties} />
