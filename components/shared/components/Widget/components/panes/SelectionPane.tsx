import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pane, PaneContainer, PaneTitle } from "./Panes.style";
import { RadioButtonGroup } from "../../../RadioButton/RadioButtonGroup";
import { RecurringDonation } from "../../types/Enums";
import { setRecurring, setCauseAreaSelection } from "../../store/donation/actions";
import { nextPane } from "../../store/layout/actions";
import { State } from "../../store/state";
import { EffektButton } from "../../../EffektButton/EffektButton";
import {
  AnimalWelfareIcon,
  ButtonsWrapper,
  CauseAreaButton,
  CauseAreaIcon,
  FutureGenerationsIcon,
  getCauseAreaIconById,
  GlobalHealthIcon,
} from "./SelectionPane.style";

/**
 * First pane: select one-time vs monthly, then choose a cause area or multiple.
 */
export const SelectionPane: React.FC<{}> = ({}) => {
  const dispatch = useDispatch<any>();
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
          <PaneTitle>Inom vilket ändamål vill du göra skillnad?</PaneTitle>

          <ButtonsWrapper>
            {causeAreas.map((ca) => (
              <CauseAreaButton key={ca.id} onClick={() => onSelectArea(ca.id)}>
                {getCauseAreaIconById(ca.id)}
                {ca.widgetDisplayName || ca.name}
              </CauseAreaButton>
            ))}
            <CauseAreaButton onClick={() => onSelectArea(undefined)}>
              <CauseAreaIcon />
              Multiple causes
            </CauseAreaButton>
          </ButtonsWrapper>
        </div>
      </PaneContainer>
    </Pane>
  );
};
