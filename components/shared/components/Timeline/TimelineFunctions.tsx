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
} from "./DonationsTimeline.style";

export function buildTimelineFromObj(
  Providers: Provider[],
  configuration: DonationDetailsConfiguration,
): [boolean, number, number, string[], string[], number[], number[], any[]] {
  let completedStatus = false;
  let numCharitiesReceived = 0;
  let numCharities = 0;
  let providerTitles = [];
  let charityTitlesNotReceived = [];
  let charityTitles = [];
  let sums = [];
  let amounts = [];

  for (let p = 0; p < Providers.length; p++) {
    let Provider = Providers[p];
    numCharities = Provider.involvedCharities.length;
    providerTitles.push(Provider.provider);
    amounts.push(Provider.amount);
    for (let i = 0; i < numCharities; i++) {
      sums.push(Provider.amount * Provider.involvedCharities[i].share);
      if (Provider.involvedCharities[i].date) {
        numCharitiesReceived++;
        charityTitles.push(Provider.involvedCharities[i].name);
        //dates.push(Provider.involvedCharities[i].date)
      } else {
        charityTitlesNotReceived.push(Provider.involvedCharities[i].name);
      }
    }

    for (let charity = 0; charity < charityTitlesNotReceived.length; charity++) {
      charityTitles.push(charityTitlesNotReceived[charity]);
    }

    //OBS: Funker bare for 1 Provider!
    if (numCharities == numCharitiesReceived) {
      completedStatus = true;
    }
  }

  let sidePoints = mapSidepoints(numCharitiesReceived, numCharities, charityTitles, sums);

  return [
    completedStatus,
    numCharities,
    numCharitiesReceived,
    providerTitles,
    charityTitles,
    sums,
    amounts,
    sidePoints,
  ];
}

// Building the timeline
export function mapSidepoints(
  numCharitiesReceived: number,
  numCharities: number,
  charityTitles: string[],
  sums: number[],
): any[] {
  let sidePoints = [];
  for (let count = 0; count < numCharities; count++) {
    sidePoints.push(
      <TimelineContainer>
        {count < numCharitiesReceived && <ProgressLineOverlay />}
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
              title={"Penger ble overført til " + charityTitles[count]}
              dropDownText={[
                "loremIp sumTe xtSSSSSSSSSSSSDAS Dassdvasdvsa dvsadvasdvasdva sdjvnsadjvnasjdkh vhsjad vsad vsad vhjksd vkjs dvjs advjk sadjkv jksa jksda vjka dasdasda",
              ]}
              smallText={sums[count] + "kr"}
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
