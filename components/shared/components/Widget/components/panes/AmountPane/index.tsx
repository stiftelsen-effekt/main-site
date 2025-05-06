import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pane, PaneContainer, PaneTitle } from "../Panes.style";
import { NextButton } from "../../shared/Buttons/NavigationButtons";
import { State } from "../../../store/state";
import { setSum, setRecurring } from "../../../store/donation/actions";
import { nextPane } from "../../../store/layout/actions";
import { RecurringDonation } from "../../../types/Enums";
import {
  ActionBar,
  CauseAreasWrapper,
  RecurringSelectionWrapper,
  TotalAmountWrapper,
} from "../AmountPane.style";
import { AmountContext } from "../../../types/WidgetProps";
import { CauseAreaForm } from "./CauseAreaForm";
import { OperationalSupportForm } from "./OperationalSupportForm";
import { SmartDistributionForm } from "./SmartDistributionForm";
import { OperationsCauseAreaForm } from "./OperationsCauseAreaForm";
import { useAmountCalculation } from "./useAmountCalculation";
import { useTippingLogic } from "./useTippingLogic";
import { thousandize } from "../../../../../../../util/formatting";
import { RadioButtonGroup } from "../../../../RadioButton/RadioButtonGroup";

interface AmountPaneProps {
  nextButtonText: string;
  smartDistContext: {
    smart_distribution_radiobutton_text: string;
    custom_distribution_radiobutton_text: string;
  };
  text: { single_donation_text: string; monthly_donation_text: string };
  enableRecurring: boolean;
  enableSingle: boolean;
  amountContext: AmountContext;
}

export const AmountPane: React.FC<AmountPaneProps> = ({
  nextButtonText,
  smartDistContext,
  text,
  enableRecurring,
  enableSingle,
  amountContext,
}) => {
  const dispatch = useDispatch<any>();
  const { selectionType, selectedCauseAreaId, recurring } = useSelector(
    (state: State) => state.donation,
  );
  const causeAreas = useSelector((state: State) => state.layout.causeAreas) || [];

  const {
    sumOfOtherCauseAreas,
    totalAmount,
    causeAreaAmounts,
    orgAmounts,
    causeAreaDistributionType,
  } = useAmountCalculation(selectionType || "single", selectedCauseAreaId || null, causeAreas);

  const handleNext = () => {
    dispatch(setSum(totalAmount));
    dispatch(nextPane());
  };

  const suggestedSums = recurring
    ? amountContext.preset_amounts_recurring
    : amountContext.preset_amounts_single;

  // For single cause area
  const selectedCA = causeAreas.find((c) => c.id === selectedCauseAreaId);

  return (
    <Pane>
      <PaneContainer>
        <div>
          <RecurringSelectionWrapper>
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
              selected={recurring}
              onSelect={(val: RecurringDonation) => dispatch(setRecurring(val))}
            />
          </RecurringSelectionWrapper>

          <CauseAreasWrapper>
            {/* For multiple cause areas */}
            {selectionType === "multiple" && selectedCauseAreaId !== -1 && (
              <>
                {causeAreas
                  .filter((ca) => ca.id !== 5 && ca.id !== 4)
                  .map((ca) => (
                    <CauseAreaForm
                      key={ca.id}
                      causeArea={ca}
                      isSingleSelection={false}
                      suggestedSums={suggestedSums}
                      causeAreaAmounts={causeAreaAmounts}
                      orgAmounts={orgAmounts}
                      causeAreaDistributionType={causeAreaDistributionType}
                    />
                  ))}
                <OperationalSupportForm sumOfOtherCauseAreas={sumOfOtherCauseAreas} />
                <TotalAmountWrapper>
                  <div>Total</div>
                  <div>{thousandize(totalAmount)} kr</div>
                </TotalAmountWrapper>
              </>
            )}

            {/* For single cause area */}
            {selectionType === "single" && selectedCA && (
              <>
                {selectedCA.id === 4 ? (
                  <OperationsCauseAreaForm
                    suggestedSums={suggestedSums}
                    causeAreaAmounts={causeAreaAmounts}
                  />
                ) : (
                  <>
                    <CauseAreaForm
                      causeArea={selectedCA}
                      isSingleSelection={true}
                      suggestedSums={suggestedSums}
                      causeAreaAmounts={causeAreaAmounts}
                      orgAmounts={orgAmounts}
                      causeAreaDistributionType={causeAreaDistributionType}
                    />
                    <OperationalSupportForm sumOfOtherCauseAreas={sumOfOtherCauseAreas} />
                  </>
                )}
                <TotalAmountWrapper>
                  <div>Total</div>
                  <div>{thousandize(totalAmount)} kr</div>
                </TotalAmountWrapper>
              </>
            )}

            {selectedCauseAreaId === -1 && (
              <SmartDistributionForm
                suggestedSums={suggestedSums}
                totalAmount={totalAmount}
                causeAreas={causeAreas}
                causeAreaAmounts={causeAreaAmounts}
                causeAreaDistributionType={causeAreaDistributionType}
                onTipStateChange={(wantsTip) => {
                  // This will be handled by the useTippingLogic hook
                }}
              />
            )}
          </CauseAreasWrapper>
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
