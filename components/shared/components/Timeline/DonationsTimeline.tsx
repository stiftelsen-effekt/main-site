import { jsonObject } from "../../../profile/donations/DonationsStatus/DonationStatusJson/DonationStatusJsonProps";
import { buildTimelineFromObj } from "./TimelineFunctions";
import { mapSidepoints } from "./TimelineFunctions";
import { DonationDetailsConfiguration } from "../../../profile/shared/lists/donationList/DonationDetails";
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
} from "./DonationsTimeline.style";
import { ExpansionWindow } from "../../../profile/shared/lists/donationList/expansionWindow";
import { LinkType } from "../../../main/blocks/Links/Links";
import { NavLink } from "../../../main/layout/navbar";

export type TestModal = {
  mottatt_title: string;
  overfort_title: string;
  mottatt_undetitle: any[];
  overfort_undetitle: any[];
};

interface DonationsTimelineProps {
  configuration: DonationDetailsConfiguration;
  dataObj: jsonObject;
}

export const DonationsTimeline: React.FC<DonationsTimelineProps> = ({ dataObj, configuration }) => {
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

  if (dataObj.smart) {
    const computedValuesSmart = buildTimelineFromObj(dataObj.smart);
    numMainNodes++;
    numSideNodes.push(computedValuesSmart[1]);
    numCompletedSideNodes.push(computedValuesSmart[2]);
    providerTitle.push(computedValuesSmart[3][0]);
    charityTitles.push(computedValuesSmart[4]);
    listOfSums.push(computedValuesSmart[5]);
    amount.push(computedValuesSmart[6][0]);
    sidePoints.push(computedValuesSmart[7]);
    if (computedValuesSmart[0]) {
      numCompletedNodes++;
    }
  }
  if (dataObj.direct) {
    const computedValuesDirect = buildTimelineFromObj(dataObj.direct);
    numMainNodes++;
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

  const points = [];
  for (let i = 0; i < numMainNodes; i++) {
    if (i == 0) {
      points.push(
        <TimelineContainer>
          {numCompletedNodes - 1 >= i ? <ProgressLine /> : <ProgressLineDotted />}
          <TimelineItem>
            <ProgressCircle key={i} filled={numCompletedNodes >= i}></ProgressCircle>
            <TextInfo>
              <ExpansionWindow
                explanation_title={configuration.expansionWindow.mottatt_title}
                text_input={configuration.expansionWindow.mottatt_undetitle}
                title_style={style.caption}
                text_style={style.impactExplanationContainer}
              />
            </TextInfo>
          </TimelineItem>
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
      if (dataObj.direct && dataObj.smart) {
        points.push(
          <TimelineContainerWithSplit>
            <TimelineContainer>
              {numCompletedNodes - 1 >= i ? <ProgressLine /> : <ProgressLineDotted />}
              <TimelineItem>
                <ProgressCircle key={i} filled={numCompletedNodes >= i}></ProgressCircle>
                <TimelineContainer>
                  <TextInfo>Penger ble overført til {providerTitle[i - 1]}</TextInfo>
                  <TextSmall>{amount[i - 1]} kr</TextSmall>
                </TimelineContainer>
              </TimelineItem>
              {sidePoints[i - 1].map((sp) => sp)}
            </TimelineContainer>
            <ProgressCircle key={i} filled={numCompletedNodes - 1 >= i}></ProgressCircle>
          </TimelineContainerWithSplit>,
        );
      } else {
        points.push(
          <TimelineContainer>
            {numCompletedNodes - 1 >= i ? <ProgressLine /> : <ProgressLineDotted />}
            <TimelineItem>
              <ProgressCircle key={i} filled={numCompletedNodes >= i}></ProgressCircle>
              <TimelineContainer>
                <TextInfo>Penger ble overført til {providerTitle[i - 1]}</TextInfo>
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
