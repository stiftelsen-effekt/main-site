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

import { FoldableDropDown } from "../FoldableDropDown/FoldableDropDown";
import { DonationDetailsConfiguration } from "../../../profile/shared/lists/donationList/DonationDetails";
import { useState } from "react";
import { DateBoxWrapper } from "../Widget/components/panes/PaymentPane/Vipps/VippsDatePicker/VippsDatePicker.style";

export type ExpansionWindow = {
  mottatt_title: string;
  mottatt_undertitle: any[];
  overfort_title: string;
  overfort_undetitle: any[];
  donasjon_fullfort: string;
  hele_donasjons_fullfort_undertitle: any[];
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
  let amount = [];
  let sidePoints = [];
  let date = [];

  let numProviders = [];
  let listOfBool = [];
  let fromGiEffektivt = false;
  let checkForBoth = false;

  const loremIpsumText = "TEXTLOREMIPSUM";

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
                smallText={configuration.date_and_amount
                  .replace("{{amount}}", amount[0])
                  .replace("{{date}}", date[0][0])}
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
          <TimelineItem>
            <ProgressCircle key={i} filled={fromGiEffektivt}></ProgressCircle>
            <TimelineContainer>
              <FoldableDropDown
                title={configuration.expansionWindow.overfort_title + providerTitles[i-1][provider]}
                dropDownText={configuration.expansionWindow.overfort_undetitle}
                smallText={configuration.date_and_amount
                  .replace("{{amount}}", amount[i - 1])
                  .replace("{{date}}", date[1][0])}
                color={fromGiEffektivt ? "white" : "grey"}
              />
            </TimelineContainer>
          </TimelineItem>,
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
                Fordeling fullført
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

/*
  <FoldableDropDown
                title="Donasjonen mottatt av Gi Effektivt"
                dropDownText={
                  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."
                }
                smallText="6000kr"
              />
              */

/*
                      <FoldableDropDown
              title={""+providerTitles[i - 1][provider]}
              dropDownText={[loremIpsumText]}
              smallText={amount[i - 1] + "kr"}
              color={fromGiEffektivt ? "white" : "grey"}
            />
            */
