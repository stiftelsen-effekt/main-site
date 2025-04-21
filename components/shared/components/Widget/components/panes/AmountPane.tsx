import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pane, PaneContainer, PaneTitle, ActionBar } from "../Panes.style";
import { SumWrapper } from "../DonationPane/DonationPane.style";
import { NextButton } from "../../shared/Buttons/NavigationButtons";
import { State } from "../../../store/state";
import {
  setCauseAreaAmount,
  setOrgAmount,
  setSum,
  setShareType,
} from "../../../store/donation/actions";
import { nextPane } from "../../../store/layout/actions";
import { RadioButtonGroup } from "../../shared/RadioButton/RadioButtonGroup";
import { ShareType } from "../../../types/Enums";
import { InputList } from "./AmountPane.style";

/**
 * Second pane: enter NOK amounts per cause area or per organization.
 */
export const AmountPane: React.FC<{
  nextButtonText: string;
  smartDistContext: {
    smart_distribution_radiobutton_text: string;
    custom_distribution_radiobutton_text: string;
  };
}> = ({ nextButtonText, smartDistContext }) => {
  const dispatch = useDispatch();
  const {
    selectionType,
    selectedCauseAreaId,
    causeAreaAmounts = {},
    orgAmounts = {},
    distributionCauseAreas,
    recurring,
  } = useSelector((state: State) => state.donation);
  const causeAreas = useSelector((state: State) => state.layout.causeAreas) || [];

  // Helper to compute total amount
  const totalAmount = React.useMemo(() => {
    if (selectionType === "multiple") {
      return Object.values(causeAreaAmounts).reduce((sum, v) => sum + (v || 0), 0);
    }
    if (selectionType === "single" && selectedCauseAreaId != null) {
      const amt = causeAreaAmounts[selectedCauseAreaId] || 0;
      return amt;
    }
    return 0;
  }, [selectionType, causeAreaAmounts, selectedCauseAreaId]);

  const handleNext = () => {
    dispatch(setSum(totalAmount));
    dispatch(nextPane());
  };

  // Selected cause area data
  const selectedCA = causeAreas.find((c) => c.id === selectedCauseAreaId);
  const distributionCA = distributionCauseAreas.find((c) => c.id === selectedCauseAreaId);

  return (
    <Pane>
      <PaneContainer>
        <div>
          <PaneTitle>
            <wbr />
          </PaneTitle>
          {selectionType === "multiple" && (
            <>
              <PaneTitle>Enter amounts for each cause area</PaneTitle>
              <InputList>
                {causeAreas.map((ca) => (
                  <SumWrapper key={ca.id}>
                    <label htmlFor={`ca-${ca.id}`}>{ca.widgetDisplayName || ca.name}</label>
                    <span>
                      <input
                        id={`ca-${ca.id}`}
                        type="tel"
                        placeholder="0"
                        value={causeAreaAmounts[ca.id] || ""}
                        onChange={(e) => {
                          const v = parseInt(e.target.value) || 0;
                          dispatch(setCauseAreaAmount(ca.id, v));
                        }}
                      />
                    </span>
                  </SumWrapper>
                ))}
              </InputList>
            </>
          )}
          {selectionType === "single" && selectedCA && distributionCA && (
            <>
              <RadioButtonGroup
                options={[
                  {
                    title: smartDistContext.smart_distribution_radiobutton_text,
                    value: ShareType.STANDARD,
                  },
                  {
                    title: smartDistContext.custom_distribution_radiobutton_text,
                    value: ShareType.CUSTOM,
                  },
                ]}
                selected={distributionCA.standardSplit ? ShareType.STANDARD : ShareType.CUSTOM}
                onSelect={(val) =>
                  dispatch(setShareType(selectedCA.id, val === ShareType.STANDARD))
                }
              />
              <SumWrapper>
                <label htmlFor={`ca-${selectedCA.id}`}>
                  {selectedCA.widgetDisplayName || selectedCA.name}
                </label>
                <span>
                  <input
                    id={`ca-${selectedCA.id}`}
                    type="tel"
                    placeholder="0"
                    value={causeAreaAmounts[selectedCA.id] || ""}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 0;
                      dispatch(setCauseAreaAmount(selectedCA.id, v));
                    }}
                  />
                </span>
              </SumWrapper>
              {!distributionCA.standardSplit && (
                <InputList>
                  {selectedCA.organizations.map((org) => (
                    <SumWrapper key={org.id}>
                      <label htmlFor={`org-${org.id}`}>{org.widgetDisplayName || org.name}</label>
                      <span>
                        <input
                          id={`org-${org.id}`}
                          type="tel"
                          placeholder="0"
                          value={orgAmounts[org.id] || ""}
                          onChange={(e) => {
                            const v = parseInt(e.target.value) || 0;
                            dispatch(setOrgAmount(org.id, v));
                          }}
                        />
                      </span>
                    </SumWrapper>
                  ))}
                </InputList>
              )}
            </>
          )}
        </div>
        <ActionBar>
          <NextButton disabled={totalAmount <= 0} onClick={handleNext}>
            {nextButtonText}
          </NextButton>
        </ActionBar>
      </PaneContainer>
    </Pane>
  );
};
