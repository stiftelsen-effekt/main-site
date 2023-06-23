import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Validator from "validator";
import { setSum, setRecurring } from "../../../store/donation/actions";
import { Pane, PaneContainer, PaneTitle } from "../Panes.style";
import { State } from "../../../store/state";
import { RecurringDonation } from "../../../types/Enums";
import { ActionBar, SumButtonsWrapper, SumWrapper } from "./DonationPane.style";
import { nextPane } from "../../../store/layout/actions";
import { NextButton } from "../../shared/Buttons/NavigationButtons";
import { EffektButton, EffektButtonType } from "../../../../EffektButton/EffektButton";
import { RadioButtonGroup } from "../../../../RadioButton/RadioButtonGroup";
import { WidgetPane1Props } from "../../../types/WidgetProps";
import { thousandize } from "../../../../../../../util/formatting";
import { SingleCauseAreaSelector } from "./ShareSelector/SingleCauseAreaSelector";
import { MultipleCauseAreasSelector } from "./ShareSelector/MultipleCauseAreasSelector";

export const DonationPane: React.FC<{ text: WidgetPane1Props }> = ({ text }) => {
  const dispatch = useDispatch();
  const donation = useSelector((state: State) => state.donation);
  const layout = useSelector((state: State) => state.layout);

  const suggestedSums = donation.recurring
    ? text.preset_amounts_recurring
    : text.preset_amounts_single;

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

          {layout.causeAreas?.length === 1 && (
            <SumButtonsWrapper>
              {suggestedSums.map((suggested) => (
                <div key={suggested.amount}>
                  <EffektButton
                    type={EffektButtonType.SECONDARY}
                    selected={donation.sum === suggested.amount}
                    onClick={() => dispatch(setSum(suggested.amount))}
                    noMinWidth={true}
                  >{`${suggested.amount ? thousandize(suggested.amount) : "-"} kr`}</EffektButton>
                  {suggested.subtext && <i>{suggested.subtext}</i>}
                </div>
              ))}
            </SumButtonsWrapper>
          )}
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

          {layout.causeAreas?.length === 1 && false && <SingleCauseAreaSelector text={text} />}
          {((layout.causeAreas && layout.causeAreas?.length > 1) || true) && (
            <MultipleCauseAreasSelector />
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
