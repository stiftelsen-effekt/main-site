import { DonationStatusModal } from "../../../profile/donations/DonationsStatus/DonationStatusModal";
import { TimelineProps } from "../../../profile/donations/DonationsStatus/DonationStatusJson/DonationStatusJsonProps";
import { buildTimelineFromObj, getProviderStatus } from "../Timeline/TimelineFunctions";

import {
  HeaderContainer,
  TimelineContainer,
  TimelineItem,
  ProgressCircleLarge,
  ProgressLine,
  ProgressLineDotted,
  ProgressCircle,
  TextInfo,
  TimelineItemSmall,
} from "./DonationsTimelinePreview.style";

export default function DonationsTimelinePreview({
  data,
  configuration, //NEED TO ADD {"Donasjon mottatt av " + getProviderStatus(data.smart)[1];,  "Hele donasjonen er ferdig fordelt"} IN SANITY
}: TimelineProps) {
  let checkStage2 = false;
  let checkStage3 = false;
  let newDescription = configuration.expansionWindow.mottatt_title + data.giEffektivt.provider;

  if (data.smart) {
    if (getProviderStatus(data.smart)[0]) {
      newDescription =
        configuration.expansionWindow.mottatt_title + getProviderStatus(data.smart)[1];
      checkStage2 = true;
    }
    const computedValuesSmart = buildTimelineFromObj(data.smart, configuration);
    checkStage3 = computedValuesSmart[0];
    if (computedValuesSmart[0]) {
      newDescription = configuration.expansionWindow.donasjon_fullfort;
    }
  }

  if (data.direct) {
    if (getProviderStatus(data.direct)[0]) {
      newDescription =
        configuration.expansionWindow.mottatt_title + getProviderStatus(data.direct)[1];
      checkStage2 = true;
    }
    const computedValuesDirect = buildTimelineFromObj(data.direct, configuration);
    checkStage3 = computedValuesDirect[0];
    if (computedValuesDirect[0]) {
      newDescription = configuration.expansionWindow.donasjon_fullfort;
    }
  }

  if (data.smart && data.direct) {
    if (
      buildTimelineFromObj(data.direct, configuration)[0] &&
      buildTimelineFromObj(data.smart, configuration)[0]
    ) {
      checkStage3 = true;
      newDescription = configuration.expansionWindow.donasjon_fullfort;
    } else {
      checkStage3 = false;
    }
  }

  return (
    <HeaderContainer>
      <TimelineContainer>
        <TimelineContainer>
          <ProgressCircle filled={true} />
          <ProgressLine />
        </TimelineContainer>
        <TimelineContainer>
          <TimelineItem>
            <ProgressCircleLarge filled={checkStage2} />
            <TextInfo>{newDescription}</TextInfo>
          </TimelineItem>
          {checkStage3 ? <ProgressLine /> : <ProgressLineDotted />}
        </TimelineContainer>
        <TimelineItemSmall>
          <ProgressCircle filled={checkStage3} />
          <DonationStatusModal
            description="Se mer her"
            data={data}
            configuration={configuration}
          ></DonationStatusModal>
        </TimelineItemSmall>
      </TimelineContainer>
    </HeaderContainer>
  );
}
