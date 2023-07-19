import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Validator from "validator";
import { setSum, setShareType, setRecurring } from "../../../store/donation/actions";
import { Pane, PaneContainer, PaneTitle } from "../Panes.style";
import { State } from "../../../store/state";
import { RecurringDonation, ShareType } from "../../../types/Enums";
import { SharesSelection } from "./ShareSelection";
import {
  ActionBar,
  InfoParagraph,
  ShareSelectionWrapper,
  SumButtonsWrapper,
  SumWrapper,
} from "./DonationPane.style";
import { SharesSum } from "./SharesSum";
import { nextPane } from "../../../store/layout/actions";
import { NextButton } from "../../shared/Buttons/NavigationButtons";
import { EffektButton, EffektButtonVariant } from "../../../../EffektButton/EffektButton";
import { RadioButtonGroup } from "../../../../RadioButton/RadioButtonGroup";
import { WidgetPane1Props } from "../../../types/WidgetProps";
import { thousandize } from "../../../../../../../util/formatting";
import { usePlausible } from "next-plausible";

export const DonationPane: React.FC<{
  text: WidgetPane1Props;
  enableRecurring: boolean;
  enableSingle: boolean;
}> = ({ text, enableRecurring, enableSingle }) => {
  const dispatch = useDispatch();
  const donation = useSelector((state: State) => state.donation);
  const plausible = usePlausible();

  const suggestedSums = donation.recurring
    ? text.preset_amounts_recurring
    : text.preset_amounts_single;

  function onSubmit() {
    plausible("SubmitDonationPane", {
      props: {
        recurring: donation.recurring,
        sum: donation.sum,
        shareType: donation.shareType,
      },
    });
    dispatch(nextPane());
  }

  return (
    <Pane>
      <PaneContainer>
        <div>
          <PaneTitle>
            <wbr />
          </PaneTitle>
          <RadioButtonGroup
            options={[
              {
                title: text.monthly_donation_text,
                value: RecurringDonation.RECURRING,
                data_cy: "radio-recurring",
                disabled: !enableRecurring,
              },
              {
                title: text.single_donation_text,
                value: RecurringDonation.NON_RECURRING,
                data_cy: "radio-single",
                disabled: !enableSingle,
              },
            ]}
            selected={donation.recurring}
            onSelect={(option) => dispatch(setRecurring(option as RecurringDonation))}
          />

          <SumButtonsWrapper>
            {suggestedSums.map((suggested) => (
              <div key={suggested.amount}>
                <EffektButton
                  variant={EffektButtonVariant.SECONDARY}
                  selected={donation.sum === suggested.amount}
                  onClick={() => dispatch(setSum(suggested.amount))}
                  noMinWidth={true}
                >{`${suggested.amount ? thousandize(suggested.amount) : "-"} kr`}</EffektButton>
                {suggested.subtext && <i>{suggested.subtext}</i>}
              </div>
            ))}
          </SumButtonsWrapper>
          <SumWrapper>
            <label htmlFor="sum">Annet beløp</label>
            <span>
              <input
                name="sum"
                type="tel"
                placeholder="0"
                value={donation.sum && donation.sum > 0 ? donation.sum : ""}
                autoComplete="off"
                data-cy="donation-sum-input"
                onChange={(e) => {
                  if (Validator.isInt(e.target.value) === true && parseInt(e.target.value) > 0) {
                    dispatch(setSum(parseInt(e.target.value)));
                  } else {
                    dispatch(setSum(-1));
                  }
                }}
              />
            </span>
          </SumWrapper>

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
              selected={donation.shareType}
              onSelect={(option) => {
                dispatch(setShareType(option as ShareType));
              }}
            />
          </ShareSelectionWrapper>

          {donation.shareType === ShareType.STANDARD && (
            <div>
              <InfoParagraph>{text.smart_fordeling_description}</InfoParagraph>
            </div>
          )}
          {donation.shareType === ShareType.CUSTOM && (
            <div>
              <SharesSelection />
              <SharesSum />
            </div>
          )}
        </div>

        <ActionBar data-cy="next-button-div">
          <NextButton
            disabled={!donation.isValid}
            onClick={() => {
              onSubmit();
            }}
          >
            {text.pane1_button_text}
          </NextButton>
        </ActionBar>
      </PaneContainer>
    </Pane>
  );
};
