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
  ProgressLineOverlay,
} from "./DonationsTimeline.style";

import { FoldableDropDown } from "../FoldableDropDown/FoldableDropDown";
import { DonationDetailsConfiguration } from "../../../profile/shared/lists/donationList/DonationDetails";
import { useState } from "react";
import { DateBoxWrapper } from "../Widget/components/panes/PaymentPane/Vipps/VippsDatePicker/VippsDatePicker.style";
import { data } from "cypress/types/jquery";

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
  let numMainNodes = 2;
  let numCompletedNodes = 1;
  let numSideNodes = [];
  let providerTitles = [];
  let amount = [dataObj.giEffektivt.amount];
  let sidePoints = [];
  let date = [[dataObj.giEffektivt.receivedDate]];

  let numProviders = [];
  let listOfBool = [];
  let fromGiEffektivt = false;
  let checkForBoth = false;


  if (dataObj.smart) {
    numMainNodes++;
    if (getProviderStatus(dataObj.smart)[0]) {
      fromGiEffektivt = true;
    }

    const computedValuesSmart = buildTimelineFromObj(dataObj.smart, configuration);
    numSideNodes.push(computedValuesSmart[1]);

    providerTitles.push(computedValuesSmart[3]);

    amount.push(computedValuesSmart[6][0]);
    sidePoints.push(computedValuesSmart[7]);
    listOfBool.push(computedValuesSmart[0]);
    date.push(computedValuesSmart[8]);
    numProviders.push(computedValuesSmart[3].length);
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
    listOfBool.push(computedValuesDirect[0]);
    if (computedValuesDirect[0]) {
      numCompletedNodes++;
      numSideNodes.unshift(computedValuesDirect[1]);

      providerTitles.unshift(computedValuesDirect[3]);

      amount.unshift(computedValuesDirect[6][0]);
      sidePoints.unshift(computedValuesDirect[7]);
      date.unshift(computedValuesDirect[8]);
      numProviders.unshift(computedValuesDirect[3].length);
    } else {
      numSideNodes.push(computedValuesDirect[1]);

      providerTitles.push(computedValuesDirect[3]);

      amount.push(computedValuesDirect[6][0]);
      sidePoints.push(computedValuesDirect[7]);
      date.push(computedValuesDirect[8]);
      numProviders.push(computedValuesDirect[3].length);
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
                title={configuration.expansionWindow.mottatt_title}
                dropDownText={configuration.expansionWindow.mottatt_undertitle}
                smallText={
                  (date.length > 0)
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
            {provider == 1 && (
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
              <ProgressCircleLast key={i} filled={listOfBool[i - 1]}></ProgressCircleLast>
              <TextInfo style={{ color: listOfBool[i - 1] ? "white" : "grey" }}>
                <FoldableDropDown
                  title={configuration.expansionWindow.fordeling_fullfort}
                  dropDownText={configuration.expansionWindow.fordeling_fullfort_undertext}
                  color={fromGiEffektivt ? "white" : "grey"}
                />
              </TextInfo>
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

