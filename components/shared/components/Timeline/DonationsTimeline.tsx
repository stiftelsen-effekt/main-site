import { jsonObject } from "../../../profile/donations/DonationsStatus/DonationStatusJson/DonationStatusJsonProps";
import { buildTimelineFromObj } from "./TimelineFunctions";
import { mapSidepoints, getProviderStatus } from "./TimelineFunctions";
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

interface DonationsTimelineProps {
  configuration: DonationDetailsConfiguration;
  dataObj: jsonObject;
}

// TODO: "Penger ble overført til " + providerTitle[i - 1]
// TODO: "Donasjonen mottatt av Gi Effektivt"
// TODO: "Hele donasjonen er ferdig fordelt"
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

  let listOfBool = [];
  let fromGiEffektivt = false;

  let checkForBoth = false;

  if (dataObj.smart) {
    if (getProviderStatus(dataObj.smart)[0]) {
      fromGiEffektivt = true;
    }

    const computedValuesSmart = buildTimelineFromObj(dataObj.smart, configuration);
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
    const computedValuesDirect = buildTimelineFromObj(dataObj.direct, configuration);
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
  const [showImpactEstimateExplanation, setShowImpactEstimateExplanation] = useState(false);
  let loremIpsumText =
    "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus";
  const points = [];
  for (let i = 0; i < numMainNodes; i++) {
    if (i == 0) {
      points.push(
        <TimelineContainer>
          {numCompletedNodes - 1 >= i ? <ProgressLine /> : <ProgressLineDotted />}
          <TimelineItem>
            <ProgressCircle key={i} filled={numCompletedNodes >= i}></ProgressCircle>
            <TimelineContainer>
              <FoldableDropDown
                title="Donasjonen mottatt av Gi Effektivt"
                dropDownText={[loremIpsumText]}
                smallText="Yes boss!"
                color={numCompletedNodes - 1 >= i ? "white" : "grey"}
              />
            </TimelineContainer>
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
              <FoldableDropDown
                title="Hele donasjonen er ferdig fordelt"
                dropDownText={[loremIpsumText]}
                smallText="6000kr"
                color={numCompletedNodes >= i ? "white" : "grey"}
              />
            </TimelineItem>
          </TimelineContainerLastNode>,
        );
      } else {
        points.push(
          // TODO: Need styling changes here. The dropdown does not work as expected
          <TimelineContainer>
            <TimelineItem>
              <ProgressCircle key={i} filled={numCompletedNodes >= i}></ProgressCircle>
              <FoldableDropDown
                title="Hele donasjonen er ferdig fordelt"
                dropDownText={[loremIpsumText]}
                smallText="Very Cool"
                color={numCompletedNodes >= i ? "white" : "grey"}
              />
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
                  <FoldableDropDown
                    title={"Penger ble overført til " + providerTitle[i - 1]}
                    dropDownText={[loremIpsumText]}
                    smallText={amount[i - 1] + "kr"}
                    color={fromGiEffektivt ? "white" : "grey"}
                  />
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
                <FoldableDropDown
                  title={"Penger ble overført til " + providerTitle[i - 1]}
                  dropDownText={[loremIpsumText]}
                  smallText={amount[i - 1] + "kr"}
                  color={fromGiEffektivt ? "white" : "grey"}
                />
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

/*
  <FoldableDropDown
                title="Donasjonen mottatt av Gi Effektivt"
                dropDownText={
                  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."
                }
                smallText="6000kr"
              />
              */
