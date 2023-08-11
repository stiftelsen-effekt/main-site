import { useDispatch, useSelector } from "react-redux";
import { RadioButtonGroup } from "../../../../../../RadioButton/RadioButtonGroup";
import { InfoParagraph, ShareSelectionWrapper } from "../../DonationPane.style";
import { setShareType } from "../../../../../store/donation/actions";
import { State } from "../../../../../store/state";
import { ShareType } from "../../../../../types/Enums";
import { SharesSelection } from "../ShareSelection";
import { SharesSum } from "../SharesSum";

export const SingleCauseAreaSelector: React.FC<{ text: any }> = ({ text }) => {
  const dispatch = useDispatch();
  const causeAreas = useSelector((state: State) => state.layout.causeAreas);
  const donation = useSelector((state: State) => state.donation);

  if (!causeAreas) return null;
  const causeArea = causeAreas[0];

  const shareType = donation.shares.find(
    (shares) => shares.causeArea === causeArea.name,
  )?.shareType;

  return (
    <>
      <ShareSelectionWrapper>
        <RadioButtonGroup
          options={[
            {
              title: text.smart_fordeling_text,
              value: ShareType.STANDARD,
              data_cy: "radio-smart-share",
            },
            {
              title: text.choose_your_own_text,
              value: ShareType.CUSTOM,
              data_cy: "radio-custom-share",
            },
          ]}
          selected={shareType}
          onSelect={(option) => {
            dispatch(setShareType(causeArea.name, option as ShareType));
          }}
        />
      </ShareSelectionWrapper>

      {shareType === ShareType.STANDARD && (
        <div>
          <InfoParagraph>{text.smart_fordeling_description}</InfoParagraph>
        </div>
      )}

      <SharesSelection causeArea={causeArea} open={shareType === ShareType.CUSTOM} />
    </>
  );
};
