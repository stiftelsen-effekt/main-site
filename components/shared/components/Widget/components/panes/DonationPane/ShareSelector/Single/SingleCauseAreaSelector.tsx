import { useDispatch, useSelector } from "react-redux";
import { RadioButtonGroup } from "../../../../../../RadioButton/RadioButtonGroup";
import { InfoParagraph, ShareSelectionSpacer } from "../../DonationPane.style";
import { setShareType } from "../../../../../store/donation/actions";
import { State } from "../../../../../store/state";
import { ShareType } from "../../../../../types/Enums";
import { SharesSelection } from "../ShareSelection";
import { SmartDistributionContext } from "../../../../../types/WidgetProps";
import { PortableText } from "@portabletext/react";
import { SharesSelectorContainer } from "./SingleCauseAreaSelector.style";
import { ErrorText } from "../../DonationPane";
import { filterErrorTextsForCauseArea } from "../../_util";

export const SingleCauseAreaSelector: React.FC<{
  configuration: SmartDistributionContext;
  errorTexts: ErrorText[];
}> = ({ configuration, errorTexts }) => {
  const dispatch = useDispatch();
  const causeAreas = useSelector((state: State) => state.layout.causeAreas);
  const donation = useSelector((state: State) => state.donation);

  if (!causeAreas) return null;
  const causeArea = causeAreas[0];

  const distributionCauseArea = donation.distributionCauseAreas.find(
    (distributionCauseArea) => distributionCauseArea.id === causeArea.id,
  );

  if (!distributionCauseArea) return <div>Missing cause are distribution in state</div>;

  return (
    <ShareSelectionSpacer>
      <RadioButtonGroup
        options={[
          {
            title: configuration.smart_distribution_radiobutton_text,
            value: ShareType.STANDARD,
            data_cy: "radio-smart-share",
          },
          {
            title: configuration.custom_distribution_radiobutton_text,
            value: ShareType.CUSTOM,
            data_cy: "radio-custom-share",
          },
        ]}
        selected={distributionCauseArea.standardSplit ? ShareType.STANDARD : ShareType.CUSTOM}
        onSelect={(option) => {
          dispatch(setShareType(causeArea.id, option == 1));
        }}
      />

      {distributionCauseArea.standardSplit && (
        <div>
          <InfoParagraph>
            <PortableText value={configuration.smart_distribution_description} />
          </InfoParagraph>
        </div>
      )}

      {!distributionCauseArea.standardSplit && (
        <SharesSelectorContainer>
          <SharesSelection
            causeArea={causeArea}
            open={!distributionCauseArea.standardSplit}
            scrollToWhenOpened={false}
            relevantErrorTexts={filterErrorTextsForCauseArea(errorTexts, causeArea.id)}
          />
        </SharesSelectorContainer>
      )}
    </ShareSelectionSpacer>
  );
};
