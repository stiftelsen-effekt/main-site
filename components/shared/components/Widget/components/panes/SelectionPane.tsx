import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pane, PaneContainer, PaneTitle } from "./Panes.style";
import {
  setCauseAreaSelection,
  setOperationsPercentageByCauseArea,
  setOrgAmount,
  setGlobalOperationsEnabled,
} from "../../store/donation/actions";
import { nextPane } from "../../store/layout/actions";
import { State } from "../../store/state";
import {
  ButtonsWrapper,
  CauseAreaButton,
  CauseAreaButtonsDividerLine,
  getCauseAreaIconById,
  MultipleCauseAreaIcon,
} from "./SelectionPane.style";
import { Spinner } from "../../../Spinner/Spinner";
import { CauseAreaDisplayConfig } from "../../types/WidgetProps";

/**
 * First pane: select one-time vs monthly, then choose a cause area or multiple.
 */
interface SelectionPaneProps {
  causeAreaDisplayConfig?: CauseAreaDisplayConfig;
}

export const SelectionPane: React.FC<SelectionPaneProps> = ({ causeAreaDisplayConfig }) => {
  const dispatch = useDispatch<any>();
  const causeAreas = useSelector((state: State) => state.layout.causeAreas);
  const { operationsPercentageByCauseArea = {}, causeAreaAmounts = {} } = useSelector(
    (state: State) => state.donation,
  );

  const onSelectArea = (id?: number) => {
    const selectionType = id && id != -1 ? "single" : "multiple";

    // Handle operations amount synchronization
    if (selectionType === "multiple") {
      // When switching to multiple cause areas
      // Check if any single cause area has operations percentage set
      const hasAnyOperationsAmount = Object.values(operationsPercentageByCauseArea).some(
        (amount: any) => amount > 0,
      );

      // Initialize global operations enabled state based on whether any cause area has operations
      dispatch(setGlobalOperationsEnabled(hasAnyOperationsAmount));
    }

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
            <CauseAreaButton
              key="default"
              onClick={() => onSelectArea(-1)}
              style={{ background: "#981f49", color: "white", border: "1px solid #981f49" }}
              data-cy="cause-area-recommendation"
            >
              Vår rekommendation
            </CauseAreaButton>
          </ButtonsWrapper>

          <CauseAreaButtonsDividerLine />

          <ButtonsWrapper>
            {causeAreas
              .filter((ca) => {
                const belowLineIds = causeAreaDisplayConfig?.below_line_cause_area_ids || [4, 5];
                return !belowLineIds.includes(ca.id) && ca.id !== 6; // Exclude below-line and "other" cause areas
              })
              .map((ca) => (
                <CauseAreaButton
                  key={ca.id}
                  onClick={() => onSelectArea(ca.id)}
                  data-cy={`cause-area-${ca.id}`}
                >
                  {getCauseAreaIconById(ca.id)}
                  {ca.widgetDisplayName || ca.name}
                </CauseAreaButton>
              ))}
            <CauseAreaButton
              onClick={() => onSelectArea(undefined)}
              style={{ marginTop: "20px" }}
              data-cy="cause-area-multiple"
            >
              <MultipleCauseAreaIcon />
              Välj flera ändamål
            </CauseAreaButton>
          </ButtonsWrapper>

          <CauseAreaButtonsDividerLine />

          <ButtonsWrapper>
            {causeAreas
              .filter((ca) => {
                const belowLineIds = causeAreaDisplayConfig?.below_line_cause_area_ids || [4, 5];
                return belowLineIds.includes(ca.id) || ca.id === 6; // Include below-line and "other" cause areas
              })
              .map((ca) => (
                <CauseAreaButton
                  key={ca.id}
                  onClick={() => onSelectArea(ca.id)}
                  data-cy={`cause-area-${ca.id}`}
                >
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
