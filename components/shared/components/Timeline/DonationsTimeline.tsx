import {
  HeaderContainer,
  TimelineContainer,
  TimelineItem,
  ProgressCircleLarge,
  ProgressCircleSmall,
  ProgressLine,
  ProgressLineDotted,
  TextLarge,
  TextSmall,
  ProgressCircle,
  TextInfo,
  TextInfo2,
  TextInfo3,
  TimelineRow,
  ProgressLineHorizontal,
  ProgressLineHorizontalDotted,
  TimelineItemBranch,
} from "./DonationsTimeline.style";

interface DonationsTimelineProps {
  numMainNodes: number;
  numCompletedNodes: number;
  numSideNodes: number;
  numCompletedSideNodes: number;
}

export const DonationsTimeline: React.FC<DonationsTimelineProps> = ({
  numMainNodes,
  numCompletedNodes,
  numSideNodes,
  numCompletedSideNodes,
}) => {
  const sidePoints = [];
  for (let count = 0; count < numSideNodes; count++) {
    sidePoints.push(
      <TimelineItemBranch>
        {numCompletedSideNodes - 1 >= count ? (
          <ProgressLineHorizontal />
        ) : (
          <ProgressLineHorizontalDotted />
        )}
        <TimelineItem>
          <ProgressCircleSmall
            key={count}
            filled={numCompletedSideNodes > count}
          ></ProgressCircleSmall>
        </TimelineItem>
      </TimelineItemBranch>,
    );
  }

  const points = [];
  for (let i = 0; i < numMainNodes; i++) {
    if (i == 1) {
      points.push(
        <TimelineContainer>
          {numCompletedNodes - 1 >= i ? <ProgressLine /> : <ProgressLineDotted />}
          <ProgressCircle key={i} filled={numCompletedNodes >= i}></ProgressCircle>
          {sidePoints.map((sp) => sp)}
        </TimelineContainer>,
      );
    } else if (i == numMainNodes - 1) {
      points.push(
        <TimelineContainer>
          <TimelineItem>
            <ProgressCircle key={i} filled={numCompletedNodes >= i}></ProgressCircle>
            <TextInfo>Hele donasjonen er ferdig fordelt</TextInfo>
          </TimelineItem>
        </TimelineContainer>,
      );
    } else {
      points.push(
        <TimelineContainer>
          {numCompletedNodes - 1 >= i ? <ProgressLine /> : <ProgressLineDotted />}
          <ProgressCircle key={i} filled={numCompletedNodes >= i}></ProgressCircle>
        </TimelineContainer>,
      );
    }
  }

  return <HeaderContainer>{points.map((p) => p)}</HeaderContainer>;
};

/*
<TimelineContainer>
<ProgressCircle filled={true} />
<ProgressLine />
<TimelineContainer>
  <TimelineItemBranch>
    <ProgressLineHorizontal />
    <ProgressCircleSmall filled={true} />
  </TimelineItemBranch>
  <TimelineItemBranch>
    <ProgressLineHorizontalDotted />
    <ProgressCircleSmall filled={false} />
  </TimelineItemBranch>
  <ProgressCircle filled={false} />
</TimelineContainer>
</TimelineContainer>
*/
