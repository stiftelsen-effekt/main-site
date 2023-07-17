import styled from "styled-components";
import { DonationStatus } from "../../../profile/donations/DonationsStatus/DonationClick";

interface TimelineProps {
  description: string;
  timelineLength: any;
}

interface ProgressCircleProps {
  filled: boolean;
}
export const HeaderContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 30px 40px;
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
  align-items: center;
  max-height: 200px;
  height: 100%;
  position: relative;
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
  width: 45px;
  position: absolute;
  height: 1px;
  background: var(--primary);
  align-items: center;
  margin-left: 20px;
  margin-bottom: 17px;
`;
export const ProgressLineHorizontalDotted = styled.div`
  border-top: 2px dotted black;
  width: 45px;
  position: absolute;
  height: 1px;
  background: var(--primary);
  align-items: center;
  margin-left: 20px;
  margin-bottom: 17px;
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
  width: 20px;
  height: 20px;
  border: 1px solid var(--primary);
  background-color: ${(props: ProgressCircleProps) =>
    props.filled ? `var(--primary)` : `var(--secondary)`};
  border-radius: 50%;
  position: relative;
  z-index: 2;
  margin-bottom 20px;
  margin-left 10px;
`;

export const ProgressCircleSmall = styled.div`
  width: 15px;
  height: 15px;
  border: 1px solid var(--primary);
  background-color: ${(props: ProgressCircleProps) =>
    props.filled ? `var(--primary)` : `var(--secondary)`};
  border-radius: 50%;
  position: relative;
  z-index: 2;
  margin-bottom 20px;
  margin-left 60px;
`;

export const ProgressLine = styled.div`
  height: 100%;
  position: absolute;
  top: 50%;
  left: 20px;
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
  left: 20px;
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
  font-size: 16px;
  margin-left: 15px;
}
`;

export const TextInfo2 = styled.div`
  font-size: 14px;
  margin-left: 16px;
}
`;
export const TextInfo3 = styled.div`
  font-size: 12px;
  margin-left: 17px;
}
`;

export const TextSmall = styled.div`
  font-size: 16px;
  margin-left: 17px;
  text-decoration: underline;
}
`;

export default function DonationsTimelinePreview({ description, timelineLength }: TimelineProps) {
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
          <DonationStatus description="Se mer her"></DonationStatus>
        </TimelineItem>
      </TimelineContainer>
    </HeaderContainer>
  );
}

//<ProgressLine style={{ "--timeline-length": timelineLength, "--line-height": "1px" } as React.CSSProperties} />
