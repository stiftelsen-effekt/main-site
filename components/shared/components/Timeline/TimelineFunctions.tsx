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
  ProgressLineOverlay,
} from "./DonationsTimeline.style";

export function buildTimelineFromObj(
  Providers: Provider[],
  configuration: DonationDetailsConfiguration,
): [boolean, number, number, string[], string[], number[], number[], any[], string[], boolean[]] {
  let completedStatus = false;
  let numCharitiesReceived = 0;
  let numCharities = 0;
  let providerTitles = [];
  let dateNotReceived_charityTitles = [];
  let charityTitles = [];
  let sums = [];
  let amounts = [];
  let dates = [];
  let infoTexts = [];
  let dateNotReceived_charityInfoInfo = [];
  let charityReceivedDates = [];
  let needProgressline = [];
  let dateNotReceived_charityAmount = [];

  for (let p = 0; p < Providers.length; p++) {
    let Provider = Providers[p];
    numCharities = Provider.involvedCharities.length;
    providerTitles.push(Provider.provider);
    amounts.push(Provider.amount);
    dates.push(Provider.receivedDate);
    for (let i = 0; i < numCharities; i++) {
      if (Provider.involvedCharities[i].date) {
        numCharitiesReceived++;
        charityTitles.push(Provider.involvedCharities[i].name);
        charityReceivedDates.push(Provider.involvedCharities[i].date);
        infoTexts.push(Provider.involvedCharities[i].charityInfo);
        sums.push((Provider.amount * Provider.involvedCharities[i].share).toFixed(0)); //round not tofixed //Calculate the charity amount based on share and amount from provider rounded to 2 decimals
      } else {
        dateNotReceived_charityTitles.push(Provider.involvedCharities[i].name);
        dateNotReceived_charityInfoInfo.push(Provider.involvedCharities[i].charityInfo);
        dateNotReceived_charityAmount.push(
          (Provider.amount * Provider.involvedCharities[i].share).toFixed(0),
        ); //Calculate the charity amount based on share and amount from provider rounded to 2 decimals
      }
    }
    if (numCharitiesReceived > 0) {
      needProgressline.push(true);
    } else {
      needProgressline.push(false);
    }

    if (numCharities == numCharitiesReceived) {
      completedStatus = true;
    } else {
      completedStatus = false;
    }

    for (let charity = 0; charity < dateNotReceived_charityTitles.length; charity++) {
      charityTitles.push(dateNotReceived_charityTitles[charity]);
      infoTexts.push(dateNotReceived_charityInfoInfo[charity]);
      sums.push(dateNotReceived_charityAmount[charity]);
    }
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
    needProgressline,
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
