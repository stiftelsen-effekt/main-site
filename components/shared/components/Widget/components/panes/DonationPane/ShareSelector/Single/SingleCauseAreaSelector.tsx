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
  const shareType = donation.shares.find(
    (shares) => shares.causeArea === causeAreaOrgs.name,
  )?.shareType;

  if (!causeAreas) return null;
  const causeAreaOrgs = causeAreas[0];

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
            dispatch(setShareType(causeAreaOrgs.name, option as ShareType));
          }}
        />
      </ShareSelectionWrapper>

      {shareType === ShareType.STANDARD && (
        <div>
          <InfoParagraph>{text.smart_fordeling_description}</InfoParagraph>
        </div>
      )}

      <SharesSelection causeAreaOrgs={causeAreaOrgs} open={shareType === ShareType.CUSTOM} />
    </>
  );
};
