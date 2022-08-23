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
import { EffektButton, EffektButtonType } from "../../../../EffektButton/EffektButton";
import { RadioButtonGroup } from "../../../../RadioButton/RadioButtonGroup";
import { WidgetPane1Props } from "../../../types/WidgetProps";

export const DonationPane: React.FC<{ text: WidgetPane1Props }> = ({ text }) => {
  const dispatch = useDispatch();
  const donation = useSelector((state: State) => state.donation);

  const suggestedSums = [
    text.preset_donation_amount_1,
    text.preset_donation_amount_2,
    text.preset_donation_amount_3,
  ];

  function onSubmit() {
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
              },
              {
                title: text.single_donation_text,
                value: RecurringDonation.NON_RECURRING,
                data_cy: "radio-single",
              },
            ]}
            selected={donation.recurring}
            onSelect={(option) => dispatch(setRecurring(option as RecurringDonation))}
          />

          <SumButtonsWrapper>
            {suggestedSums.map((sum) => (
              <div key={sum}>
                <EffektButton
                  type={EffektButtonType.SECONDARY}
                  onClick={() => dispatch(setSum(sum))}
                >{`${sum} kr`}</EffektButton>
                {sum == suggestedSums[suggestedSums.length - 1] && <i>Snittdonasjon</i>}
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
            {text.button_text}
          </NextButton>
        </ActionBar>
      </PaneContainer>
    </Pane>
  );
};
