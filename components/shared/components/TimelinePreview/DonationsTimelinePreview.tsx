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
  description,
  data,
  configuration,
}: TimelineProps) {
  let checkStage2 = false;
  let checkStage3 = false;
  let newDescription = "Donasjonen mottat av Gi Effektivt";

  if (data.smart) {
    if (getProviderStatus(data.smart)[0]) {
      newDescription = "Donasjon mottatt av " + getProviderStatus(data.smart)[1];
      checkStage2 = true;
    }
    const computedValuesSmart = buildTimelineFromObj(data.smart);
    checkStage3 = computedValuesSmart[0];
    if (computedValuesSmart[0]) {
      newDescription = "Hele donasjonen er ferdig fordelt";
    }
  }

  if (data.direct) {
    if (getProviderStatus(data.direct)[0]) {
      newDescription = "Donasjon mottatt av " + getProviderStatus(data.direct)[1];
      checkStage2 = true;
    }
    const computedValuesDirect = buildTimelineFromObj(data.direct);
    checkStage3 = computedValuesDirect[0];
    if (computedValuesDirect[0]) {
      newDescription = "Hele donasjonen er ferdig fordelt";
    }
  }

  if (data.smart && data.direct) {
    if (buildTimelineFromObj(data.direct)[0] && buildTimelineFromObj(data.smart)[0]) {
      checkStage3 = true;
      newDescription = "Hele donasjonen er ferdig fordelt";
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
