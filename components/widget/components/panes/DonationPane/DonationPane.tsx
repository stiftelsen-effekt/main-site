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
import { EffektButton, EffektButtonType } from "../../../../elements/effektbutton";
import { RadioButtonGroup } from "../../../../elements/radiobuttongroup";
import { NextButton } from "../../shared/Buttons/NavigationButtons";

export const DonationPane: React.FC = () => {
  const dispatch = useDispatch();
  const donation = useSelector((state: State) => state.donation);

  const suggestedSums = [350, 500, 850];

  function onSubmit() {
    dispatch(nextPane());
  }

  return (
    <Pane>
      <PaneContainer>
        <div>
          <PaneTitle>Hvor mye ønsker du å Gi Effektivt?</PaneTitle>
          <RadioButtonGroup
            options={[
              { title: "Gi månedlig", value: RecurringDonation.RECURRING, data_cy: "radio-recurring" },
              { title: "Engangsbeløp", value: RecurringDonation.NON_RECURRING, data_cy: "radio-single" },
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
            <label htmlFor="sum">Velg et eget beløp</label>
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
                { title: "Smart fordeling", value: ShareType.STANDARD, data_cy: "radio-smart-share" },
                { title: "Jeg vil velge selv", value: ShareType.CUSTOM, data_cy: "radio-custom-share" },
              ]}
              selected={donation.shareType}
              onSelect={(option) => {
                dispatch(setShareType(option as ShareType));
              }}
            />
          </ShareSelectionWrapper>

          {donation.shareType === ShareType.STANDARD && (
            <div>
              <InfoParagraph>
                Smart fordeling sørger for at du kontinuerlig benytter deg av de aller siste og mest
                oppdaterte tallene for hvordan du kan få størst mulig effekt av donasjonen din.{" "}
              </InfoParagraph>
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
          <EffektButton
            type={EffektButtonType.PRIMARY}
            disabled={!donation.isValid}
            onClick={() => {
              onSubmit();
            }}
          >
            Neste
          </EffektButton>
        </ActionBar>
      </PaneContainer>
    </Pane>
  );
};
