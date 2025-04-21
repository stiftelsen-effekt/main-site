import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pane, PaneContainer, PaneTitle } from "../Panes.style";
import { RadioButtonGroup } from "../../shared/RadioButton/RadioButtonGroup";
import { RecurringDonation } from "../../../types/Enums";
import { setRecurring, setCauseAreaSelection } from "../../store/donation/actions";
import { nextPane } from "../../store/layout/actions";
import { State } from "../../../store/state";
import { EffektButton } from "../../../../EffektButton/EffektButton";
import { ButtonsWrapper } from "./SelectionPane.style";

/**
 * First pane: select one-time vs monthly, then choose a cause area or multiple.
 */
export const SelectionPane: React.FC<{
  text: { single_donation_text: string; monthly_donation_text: string };
  enableRecurring: boolean;
  enableSingle: boolean;
}> = ({ text, enableRecurring, enableSingle }) => {
  const dispatch = useDispatch();
  const donation = useSelector((state: State) => state.donation);
  const causeAreas = useSelector((state: State) => state.layout.causeAreas) || [];

  const onSelectArea = (id?: number) => {
    const selectionType = id ? "single" : "multiple";
    dispatch(setCauseAreaSelection(selectionType, id));
    dispatch(nextPane());
  };

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
                title: text.single_donation_text,
                value: RecurringDonation.NON_RECURRING,
                disabled: !enableSingle,
              },
              {
                title: text.monthly_donation_text,
                value: RecurringDonation.RECURRING,
                disabled: !enableRecurring,
              },
            ]}
            selected={donation.recurring}
            onSelect={(val) => dispatch(setRecurring(val as RecurringDonation))}
          />
          <PaneTitle>Select cause area</PaneTitle>
          <ButtonsWrapper>
            {causeAreas.map((ca) => (
              <EffektButton key={ca.id} onClick={() => onSelectArea(ca.id)}>
                {ca.widgetDisplayName || ca.name}
              </EffektButton>
            ))}
            <EffektButton onClick={() => onSelectArea(undefined)}>Multiple causes</EffektButton>
          </ButtonsWrapper>
        </div>
      </PaneContainer>
    </Pane>
  );
};
