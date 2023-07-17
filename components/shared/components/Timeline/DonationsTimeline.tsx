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

export const DonationsTimeline: React.FC = () => {
  const numMainNodes = 2;
  //const paneNumber = useSelector((state: State) => state.layout.paneNumber);
  const numCompletedNodes = 2;

  const numSideNodes = 2;
  const numCompletedSideNodes = 0;

  const points = [];
  const lines = [];
  for (let i = 0; i < numMainNodes; i++) {
    points.push(
      <TimelineContainer>
        {numCompletedNodes - 1 >= i ? <ProgressLine /> : <ProgressLineDotted />}
        <ProgressCircle key={i} filled={numCompletedNodes >= i}></ProgressCircle>
      </TimelineContainer>,
    );
  }

  return (
    <HeaderContainer>
      {points.map((p) => p)}
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
    </HeaderContainer>
  );
};
