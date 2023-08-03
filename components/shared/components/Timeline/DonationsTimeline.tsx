import { jsonObject } from "../../../profile/donations/DonationsStatus/DonationStatusJson/DonationStatusJsonProps";
import { buildTimelineFromObj } from "./TimelineFunctions";
import { getProviderStatus } from "./TimelineFunctions";

import {
  HeaderContainer,
  TimelineContainer,
  TimelineItem,
  ProgressLine,
  ProgressLineDotted,
  ProgressCircle,
  TimelineContainerWithSplit,
  TimelineContainerLastNode,
  ProgressLineDottedLastNode,
  ProgressLineLastNode,
  ProgressCircleLast,
  ProgressLineOverlay,
} from "./DonationsTimeline.style";

import { FoldableDropDown } from "../FoldableDropDown/FoldableDropDown";
import { DonationDetailsConfiguration } from "../../../profile/shared/lists/donationList/DonationDetails";

export type ExpansionWindow = {
  mottatt_title: string;
  mottatt_undertitle: any[];
  overfort_title: string;
  overfort_undetitle: any[];
  donasjon_fullfort: string;
  hele_donasjons_fullfort_undertitle: any[];
  fordeling_fullfort: string;
  fordeling_fullfort_undertext: any[];
};

interface DonationsTimelineProps {
  configuration: DonationDetailsConfiguration;
  dataObj: jsonObject;
}

export const DonationsTimeline: React.FC<DonationsTimelineProps> = ({ dataObj, configuration }) => {
  // Extracting values from json-object to build the timeline
  let numMainNodes = 2; // 2 nodes is fixed from the beginning - always a start- and an end-node
  let numCompletedNodes = 1; //The first node is always completed since the timeline
  let providerTitles = [];
  let amount = [dataObj.giEffektivt.amount]; //Amounf for each provider
  let sidePoints = []; // Node for each charity - it is a list of lists
  let date = [[dataObj.giEffektivt.receivedDate]];

  let numProviders = [];
  let nodeStatusBooleans = [];
  let fromGiEffektivt = false;
  let checkForBoth = false;
  let checkNeedForProgressline = [];

  if (dataObj.smart) {
    numMainNodes++; //ADD A NEW NODE ON THE MAIN-TIMELINE
    if (getProviderStatus(dataObj.smart)[0]) {
      fromGiEffektivt = true;
    }

    const computedValuesSmart = buildTimelineFromObj(dataObj.smart, configuration);
    providerTitles.push(computedValuesSmart[3]);
    amount.push(computedValuesSmart[6][0]);
    sidePoints.push(computedValuesSmart[7]);
    nodeStatusBooleans.push(computedValuesSmart[0]);
    date.push(computedValuesSmart[8]);
    numProviders.push(computedValuesSmart[3].length);
    checkNeedForProgressline.unshift(computedValuesSmart[9]);
    if (computedValuesSmart[0]) {
      numCompletedNodes++;
    }
  }
  if (dataObj.direct) {
    if (getProviderStatus(dataObj.direct)[0]) {
      fromGiEffektivt = true;
    }
    const computedValuesDirect = buildTimelineFromObj(dataObj.direct, configuration);
    numMainNodes++;
    nodeStatusBooleans.push(computedValuesDirect[0]);
    if (computedValuesDirect[0]) {
      numCompletedNodes++;
      providerTitles.unshift(computedValuesDirect[3]);
      amount.unshift(computedValuesDirect[6][0]);
      sidePoints.unshift(computedValuesDirect[7]);
      date.unshift(computedValuesDirect[8]);
      numProviders.unshift(computedValuesDirect[3].length);
      checkNeedForProgressline.unshift(computedValuesDirect[9]);
    } else {
      providerTitles.push(computedValuesDirect[3]);
      amount.push(computedValuesDirect[6][0]);
      sidePoints.push(computedValuesDirect[7]);
      date.push(computedValuesDirect[8]);
      numProviders.push(computedValuesDirect[3].length);
      checkNeedForProgressline.push(computedValuesDirect[9]);
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
          {fromGiEffektivt ? <ProgressLine /> : <ProgressLineDotted />}
          <TimelineItem>
            <ProgressCircle key={i} filled={numCompletedNodes >= i}></ProgressCircle>
            <TimelineContainer>
              <FoldableDropDown
                title={configuration.expansionWindow.mottatt_title + dataObj.giEffektivt.provider}
                dropDownText={configuration.expansionWindow.mottatt_undertitle}
                smallText={
                  date.length > 0
                    ? date[i][0] + " | " + amount[i] + configuration.date_and_amount
                    : amount[i] + configuration.date_and_amount
                }
                color={numCompletedNodes - 1 >= i ? "white" : "grey"}
              />
            </TimelineContainer>
          </TimelineItem>
        </TimelineContainer>,
      );
    } else if (i == numMainNodes - 1) {
      let lastNode = [];
      lastNode.push(
        <TimelineItem>
          <ProgressCircle key={i} filled={numCompletedNodes >= i}></ProgressCircle>
          <FoldableDropDown
            title={configuration.expansionWindow.donasjon_fullfort}
            dropDownText={configuration.expansionWindow.hele_donasjons_fullfort_undertitle}
            color={numCompletedNodes >= i ? "white" : "grey"}
          />
        </TimelineItem>,
      );
      if (checkForBoth) {
        points.push(
          <TimelineContainerLastNode>
            {numCompletedNodes >= i ? <ProgressLineLastNode /> : <ProgressLineDottedLastNode />}
            {lastNode.map((lastPoint) => lastPoint)}
          </TimelineContainerLastNode>,
        );
      } else {
        points.push(
          <TimelineContainer>{lastNode.map((lastPoint) => lastPoint)}</TimelineContainer>,
        );
      }
    } else {
      let points4SameDistributer = [];
      for (let provider = 0; provider < numProviders[i - 1]; provider++) {
        points4SameDistributer.push(
          <TimelineContainer>
            {checkNeedForProgressline[i - 1][provider] && (
              <ProgressLineOverlay style={{ top: "60%", height: "Calc(100% + 0.1rem)" }} />
            )}
            <TimelineItem>
              <ProgressCircle filled={fromGiEffektivt}></ProgressCircle>
              <TimelineContainer>
                <FoldableDropDown
                  title={
                    configuration.expansionWindow.overfort_title + providerTitles[i - 1][provider]
                  }
                  dropDownText={configuration.expansionWindow.overfort_undetitle}
                  smallText={
                    fromGiEffektivt
                      ? date[i][provider] + " | " + amount[i] + configuration.date_and_amount
                      : amount[i] + configuration.date_and_amount
                  }
                  color={fromGiEffektivt ? "white" : "grey"}
                />
              </TimelineContainer>
            </TimelineItem>
          </TimelineContainer>,
        );
      }
      if (checkForBoth) {
        points.push(
          <TimelineContainerWithSplit>
            <TimelineContainer>
              {numCompletedNodes - 1 >= i ? <ProgressLine /> : <ProgressLineDotted />}
              {points4SameDistributer.map((pointsDistr) => pointsDistr)}
              {sidePoints[i - 1].map((sp) => sp)}
            </TimelineContainer>
            <TimelineItem>
              <ProgressCircleLast key={i} filled={nodeStatusBooleans[i - 1]}></ProgressCircleLast>
              <FoldableDropDown
                title={configuration.expansionWindow.fordeling_fullfort}
                dropDownText={configuration.expansionWindow.fordeling_fullfort_undertext}
                color={fromGiEffektivt ? "white" : "grey"}
              />
            </TimelineItem>
          </TimelineContainerWithSplit>,
        );
      } else {
        points.push(
          <TimelineContainer>
            {numCompletedNodes - 1 >= i ? <ProgressLine /> : <ProgressLineDotted />}
            {points4SameDistributer.map((pointsDistr) => pointsDistr)}
            {sidePoints[i - 1].map((sp) => sp)}
          </TimelineContainer>,
        );
      }
    }
  }

  return <HeaderContainer>{points.map((p) => p)}</HeaderContainer>;
};
