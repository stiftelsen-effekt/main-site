import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pane, PaneContainer, PaneTitle } from "./Panes.style";
import { RadioButtonGroup } from "../../../RadioButton/RadioButtonGroup";
import { RecurringDonation } from "../../types/Enums";
import { setRecurring, setCauseAreaSelection } from "../../store/donation/actions";
import { nextPane } from "../../store/layout/actions";
import { State } from "../../store/state";
import {
  ButtonsWrapper,
  CauseAreaButton,
  CauseAreaButtonsDividerLine,
  getCauseAreaIconById,
  MultipleCauseAreaIcon,
} from "./SelectionPane.style";
import { StyledSpinner } from "../shared/Buttons/NavigationButtons.style";
import { Spinner } from "../../../Spinner/Spinner";

/**
 * First pane: select one-time vs monthly, then choose a cause area or multiple.
 */
export const SelectionPane: React.FC<{}> = ({}) => {
  const dispatch = useDispatch<any>();
  const causeAreas = useSelector((state: State) => state.layout.causeAreas);

  const onSelectArea = (id?: number) => {
    const selectionType = id && id != -1 ? "single" : "multiple";
    dispatch(setCauseAreaSelection(selectionType, id));
    dispatch(nextPane());
  };

  if (!causeAreas) {
    return (
      <Pane>
        <PaneContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Spinner />
          </div>
        </PaneContainer>
      </Pane>
    );
  }

  return (
    <Pane>
      <PaneContainer>
        <div>
          <PaneTitle>Inom vilket ändamål vill du göra skillnad?</PaneTitle>

          <ButtonsWrapper>
            <CauseAreaButton key="default" onClick={() => onSelectArea(-1)}>
              <MultipleCauseAreaIcon />
              Vår rekommendation
            </CauseAreaButton>
          </ButtonsWrapper>

          <CauseAreaButtonsDividerLine />

          <ButtonsWrapper>
            {causeAreas
              .filter((ca) => [1, 2, 3].indexOf(ca.id) !== -1)
              .map((ca) => (
                <CauseAreaButton key={ca.id} onClick={() => onSelectArea(ca.id)}>
                  {getCauseAreaIconById(ca.id)}
                  {ca.widgetDisplayName || ca.name}
                </CauseAreaButton>
              ))}
            <CauseAreaButton onClick={() => onSelectArea(undefined)} style={{ marginTop: "20px" }}>
              <MultipleCauseAreaIcon />
              Välj flera ändamål
            </CauseAreaButton>
          </ButtonsWrapper>

          <CauseAreaButtonsDividerLine />

          <ButtonsWrapper>
            {causeAreas
              .filter((ca) => [4, 5, 6].indexOf(ca.id) !== -1)
              .map((ca) => (
                <CauseAreaButton key={ca.id} onClick={() => onSelectArea(ca.id)}>
                  {getCauseAreaIconById(ca.id)}
                  {ca.widgetDisplayName || ca.name}
                </CauseAreaButton>
              ))}
          </ButtonsWrapper>
        </div>
      </PaneContainer>
    </Pane>
  );
};
