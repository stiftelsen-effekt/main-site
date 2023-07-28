import { jsonObject } from "../../../profile/donations/DonationsStatus/DonationStatusJson/DonationStatusJsonProps";
import { buildTimelineFromObj } from "./TimelineFunctions";
import { mapSidepoints, getProviderStatus } from "./TimelineFunctions";
import style from "./DonationDetails.module.scss";
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
  TimelineContainerWithSplit,
  TimelineContainerLastNode,
  ProgressLineDottedLastNode,
  ProgressLineLastNode,
  ProgressCircleLast,
} from "./DonationsTimeline.style";

interface DonationsTimelineProps {
  dataObj: jsonObject;
}

export const DonationsTimeline: React.FC<DonationsTimelineProps> = ({ dataObj }) => {
  // Extracting values from json-object to build the timeline
  let numMainNodes = 2;
  let numCompletedNodes = 1;
  let numSideNodes = [];
  let numCompletedSideNodes = [];
  let providerTitle = [];
  let charityTitles = [];
  let listOfSums = [];
  let amount = [];
  let sidePoints = [];

  let listOfBool = [];
  let fromGiEffektivt = false;

  let checkForBoth = false;

  if (dataObj.smart) {
    if (getProviderStatus(dataObj.smart)[0]) {
      fromGiEffektivt = true;
    }

    const computedValuesSmart = buildTimelineFromObj(dataObj.smart);
    numMainNodes++;
    numSideNodes.push(computedValuesSmart[1]);
    numCompletedSideNodes.push(computedValuesSmart[2]);
    providerTitle.push(computedValuesSmart[3][0]);
    charityTitles.push(computedValuesSmart[4]);
    listOfSums.push(computedValuesSmart[5]);
    amount.push(computedValuesSmart[6][0]);
    sidePoints.push(computedValuesSmart[7]);
    listOfBool.push(computedValuesSmart[0]);
    if (computedValuesSmart[0]) {
      numCompletedNodes++;
    }
  }
  if (dataObj.direct) {
    if (getProviderStatus(dataObj.direct)[0]) {
      fromGiEffektivt = true;
    }
    const computedValuesDirect = buildTimelineFromObj(dataObj.direct);
    numMainNodes++;
    listOfBool.push(computedValuesDirect[0]);
    if (computedValuesDirect[0]) {
      numCompletedNodes++;
      numSideNodes.unshift(computedValuesDirect[1]);
      numCompletedSideNodes.unshift(computedValuesDirect[2]);
      providerTitle.unshift(computedValuesDirect[3][0]);
      charityTitles.unshift(computedValuesDirect[4]);
      listOfSums.unshift(computedValuesDirect[5]);
      amount.unshift(computedValuesDirect[6][0]);
      sidePoints.unshift(computedValuesDirect[7]);
    } else {
      numSideNodes.push(computedValuesDirect[1]);
      numCompletedSideNodes.push(computedValuesDirect[2]);
      providerTitle.push(computedValuesDirect[3][0]);
      charityTitles.push(computedValuesDirect[4]);
      listOfSums.push(computedValuesDirect[5]);
      amount.push(computedValuesDirect[6][0]);
      sidePoints.push(computedValuesDirect[7]);
    }
  }

  if (dataObj.direct && dataObj.smart) {
    checkForBoth = true;
  }

  const points = [];
  for (let i = 0; i < numMainNodes; i++) {
    if (i == 0) {
      points.push(
        <TimelineContainer>
          {numCompletedNodes - 1 >= i ? <ProgressLine /> : <ProgressLineDotted />}
          <TimelineItem>
            <ProgressCircle key={i} filled={numCompletedNodes >= i}></ProgressCircle>
            <TextInfo>Donasjonen mottatt av Gi Effektivt</TextInfo>
          </TimelineItem>
        </TimelineContainer>,
      );
    } else if (i == numMainNodes - 1) {
      if (checkForBoth) {
        points.push(
          <TimelineContainerLastNode>
            {numCompletedNodes >= i ? <ProgressLineLastNode /> : <ProgressLineDottedLastNode />}
            <TimelineItem>
              <ProgressCircle key={i} filled={numCompletedNodes >= i}></ProgressCircle>
              <TextInfo>Hele donasjonen er ferdig fordelt</TextInfo>
            </TimelineItem>
          </TimelineContainerLastNode>,
        );
      } else {
        points.push(
          <TimelineContainer>
            <TimelineItem>
              <ProgressCircle key={i} filled={numCompletedNodes >= i}></ProgressCircle>
              <TextInfo>Hele donasjonen er ferdig fordelt</TextInfo>
            </TimelineItem>
          </TimelineContainer>,
        );
      }
    } else {
      if (checkForBoth) {
        points.push(
          <TimelineContainerWithSplit>
            <TimelineContainer>
              {numCompletedNodes - 1 >= i ? <ProgressLine /> : <ProgressLineDotted />}
              <TimelineItem>
                <ProgressCircle filled={fromGiEffektivt}></ProgressCircle>
                <TimelineContainer>
                  <TextInfo style={{ color: fromGiEffektivt ? "black" : "grey" }}>
                    Penger ble overført til {providerTitle[i - 1]}
                  </TextInfo>
                  <TextSmall>{amount[i - 1]} kr</TextSmall>
                </TimelineContainer>
              </TimelineItem>
              {sidePoints[i - 1].map((sp) => sp)}
            </TimelineContainer>
            <ProgressCircleLast key={i} filled={listOfBool[i - 1]}></ProgressCircleLast>
          </TimelineContainerWithSplit>,
        );
      } else {
        points.push(
          <TimelineContainer>
            {numCompletedNodes - 1 >= i ? <ProgressLine /> : <ProgressLineDotted />}
            <TimelineItem>
              <ProgressCircle key={i} filled={fromGiEffektivt}></ProgressCircle>
              <TimelineContainer>
                <TextInfo style={{ color: fromGiEffektivt ? "white" : "grey" }}>
                  Penger ble overført til {providerTitle[i - 1]}
                </TextInfo>
                <TextSmall>{amount[i - 1]} kr</TextSmall>
              </TimelineContainer>
            </TimelineItem>
            {sidePoints[i - 1].map((sp) => sp)}
          </TimelineContainer>,
        );
      }
    }
  }

  return <HeaderContainer>{points.map((p) => p)}</HeaderContainer>;
};
