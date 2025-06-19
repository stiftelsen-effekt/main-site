import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pane, PaneContainer, PaneTitle } from "./Panes.style";
import { RadioButtonGroup } from "../../../RadioButton/RadioButtonGroup";
import { RecurringDonation } from "../../types/Enums";
import {
  setRecurring,
  setCauseAreaSelection,
  setOperationsAmountByCauseArea,
  setCauseAreaAmount,
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
import { StyledSpinner } from "../shared/Buttons/NavigationButtons.style";
import { Spinner } from "../../../Spinner/Spinner";

/**
 * First pane: select one-time vs monthly, then choose a cause area or multiple.
 */
export const SelectionPane: React.FC<{}> = ({}) => {
  const dispatch = useDispatch<any>();
  const causeAreas = useSelector((state: State) => state.layout.causeAreas);
  const {
    operationsAmountsByCauseArea = {},
    causeAreaAmounts = {},
    globalOperationsUserOverride,
  } = useSelector((state: State) => state.donation);

  const onSelectArea = (id?: number) => {
    const selectionType = id && id != -1 ? "single" : "multiple";

    // Handle operations amount synchronization
    if (selectionType === "multiple") {
      // When switching to multiple cause areas
      // Check if any single cause area has operations amount set
      const hasAnyOperationsAmount = Object.values(operationsAmountsByCauseArea).some(
        (amount) => amount > 0,
      );

      // Initialize global operations enabled state based on whether any cause area has operations
      dispatch(setGlobalOperationsEnabled(hasAnyOperationsAmount));
    } else {
      // When switching to single cause area
      // Check if user has explicitly changed the global operations toggle
      if (globalOperationsUserOverride?.hasUserOverride && causeAreas) {
        const causeAreaId = id;
        if (causeAreaId && causeAreaId !== -1) {
          const currentCauseAreaAmount = causeAreaAmounts[causeAreaId] || 0;
          const currentOperationsAmount = operationsAmountsByCauseArea[causeAreaId] || 0;
          const currentTotal = currentCauseAreaAmount + currentOperationsAmount;

          if (currentTotal > 0) {
            if (globalOperationsUserOverride.overrideValue) {
              // User explicitly enabled global operations cut
              // Ensure this cause area has operations cut
              if (currentOperationsAmount === 0) {
                const newOperationsAmount = Math.round(0.05 * currentTotal);
                const newCauseAreaAmount = currentTotal - newOperationsAmount;

                setTimeout(() => {
                  dispatch(setCauseAreaAmount(causeAreaId, newCauseAreaAmount));
                  dispatch(setOperationsAmountByCauseArea(causeAreaId, newOperationsAmount));

                  // Handle single organization cause areas
                  const causeArea = causeAreas.find((ca) => ca.id === causeAreaId);
                  if (causeArea && causeArea.organizations.length === 1) {
                    dispatch(setOrgAmount(causeArea.organizations[0].id, newCauseAreaAmount));
                  }
                }, 0);
              }
            } else {
              // User explicitly disabled global operations cut
              // Ensure this cause area has NO operations cut
              if (currentOperationsAmount > 0) {
                setTimeout(() => {
                  dispatch(setCauseAreaAmount(causeAreaId, currentTotal));
                  dispatch(setOperationsAmountByCauseArea(causeAreaId, 0));

                  // Handle single organization cause areas
                  const causeArea = causeAreas.find((ca) => ca.id === causeAreaId);
                  if (causeArea && causeArea.organizations.length === 1) {
                    dispatch(setOrgAmount(causeArea.organizations[0].id, currentTotal));
                  }
                }, 0);
              }
            }
          }
        }
      }
      // If user hasn't touched global toggle, preserve local state (do nothing)
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
              .filter((ca) => [1, 2, 3].indexOf(ca.id) !== -1)
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
              .filter((ca) => [4, 5, 6].indexOf(ca.id) !== -1)
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
