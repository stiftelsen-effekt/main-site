import {
  jsonObject,
  Provider,
} from "../../../profile/donations/DonationsStatus/DonationStatusJson/DonationStatusJsonProps";
import { DonationDetailsConfiguration } from "../../../profile/shared/lists/donationList/DonationDetails";
import { FoldableDropDown } from "../FoldableDropDown/FoldableDropDown";
import {
  TimelineItemBranch,
  ProgressLineHorizontal,
  ProgressLineHorizontalDotted,
  ProgressCircleSmall,
  TimelineContainer,
  TextInfo3,
  TextSmall,
  ProgressLineOverlay,
  ProgressLineOverlayFirst,
} from "./DonationsTimeline.style";

export function buildTimelineFromObj(
  Providers: Provider[],
  configuration: DonationDetailsConfiguration,
): [boolean, number, number, string[], string[], number[], number[], any[], string[]] {
  let completedStatus = false;
  let numCharitiesReceived = 0;
  let numCharities = 0;
  let providerTitles = [];
  let charityTitlesNotReceived = [];
  let charityTitles = [];
  let sums = [];
  let amounts = [];
  let dates = [];
  let infoTexts = [];
  let DateNotReceivedInfo = [];
  let charityReceivedDates = [];

  for (let p = 0; p < Providers.length; p++) {
    let Provider = Providers[p];
    numCharities = Provider.involvedCharities.length;
    providerTitles.push(Provider.provider);
    amounts.push(Provider.amount);
    dates.push(Provider.receivedDate);
    for (let i = 0; i < numCharities; i++) {
      sums.push(Provider.amount * Provider.involvedCharities[i].share);
      if (Provider.involvedCharities[i].date) {
        numCharitiesReceived++;
        charityTitles.push(Provider.involvedCharities[i].name);
        charityReceivedDates.push(Provider.involvedCharities[i].date);
        infoTexts.push(Provider.involvedCharities[i].charityInfo);
        //dates.push(Provider.involvedCharities[i].date)
      } else {
        charityTitlesNotReceived.push(Provider.involvedCharities[i].name);
        DateNotReceivedInfo.push(Provider.involvedCharities[i].charityInfo);
      }
    }

    if (numCharities == numCharitiesReceived) {
      completedStatus = true;
    } else {
      completedStatus = false;
    }

    for (let charity = 0; charity < charityTitlesNotReceived.length; charity++) {
      charityTitles.push(charityTitlesNotReceived[charity]);
      infoTexts.push(DateNotReceivedInfo[charity]);
    }

    //OBS: Funker bare for 1 Provider!
  }

  let sidePoints = mapSidepoints(
    numCharitiesReceived,
    numCharities,
    charityTitles,
    sums,
    configuration,
    charityReceivedDates,
    infoTexts,
  );

  return [
    completedStatus,
    numCharities,
    numCharitiesReceived,
    providerTitles,
    charityTitles,
    sums,
    amounts,
    sidePoints,
    dates,
  ];
}

// Building the timeline
export function mapSidepoints(
  numCharitiesReceived: number,
  numCharities: number,
  charityTitles: string[],
  sums: number[],
  configuration: DonationDetailsConfiguration,
  dates: any[],
  infoTexts: string[],
): any[] {
  let sidePoints = [];
  for (let count = 0; count < numCharities; count++) {
    sidePoints.push(
      <TimelineContainer>
        {count < numCharitiesReceived - 1 && (
          <ProgressLineOverlay style={{ top: "50%", height: "Calc(100% + 1.2rem)" }} />
        )}
        <TimelineItemBranch>
          {numCharitiesReceived - 1 >= count ? (
            <ProgressLineHorizontal />
          ) : (
            <ProgressLineHorizontalDotted />
          )}
          <ProgressCircleSmall
            key={count}
            filled={numCharitiesReceived > count}
          ></ProgressCircleSmall>
          <TimelineContainer>
            <FoldableDropDown
              title={configuration.expansionWindow.overfort_title + charityTitles[count]}
              dropDownText={infoTexts[count]}
              smallText={
                numCharitiesReceived > count
                  ? dates[count] + " | " + sums[count] + configuration.date_and_amount
                  : sums[count] + configuration.date_and_amount
              }
              color={numCharitiesReceived > count ? "white" : "grey"}
            />
          </TimelineContainer>
        </TimelineItemBranch>
      </TimelineContainer>,
    );
  }
  return sidePoints;
}

export function getProviderStatus(Providers: Provider[]): any[] {
  let receivedDate = false;
  let providerTitle = "";
  for (let i = 0; i < Providers.length; i++) {
    let provider = Providers[i];
    providerTitle = provider.provider;
    if (provider.receivedDate) {
      receivedDate = true;
      return [receivedDate, providerTitle];
    }
    providerTitle = provider.provider;
  }
  receivedDate = false;
  return [receivedDate, providerTitle];
}
