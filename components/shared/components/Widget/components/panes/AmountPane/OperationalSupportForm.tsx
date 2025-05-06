import React from "react";
import { useSelector } from "react-redux";
import { NumericFormat } from "react-number-format";
import {
  FormWrapper,
  CauseAreaTitle,
  CauseAreaContext,
  TotalSumWrapper,
  SumWrapper,
} from "../AmountPane.style";
import { CheckBoxWrapper, HiddenCheckBox } from "../Forms.style";
import { CustomCheckBox } from "../DonorPane/CustomCheckBox";
import { getCauseAreaIconById } from "../SelectionPane.style";
import { useTippingLogic } from "./useTippingLogic";
import { State } from "../../../store/state";

interface OperationalSupportFormProps {
  sumOfOtherCauseAreas: number;
}

export const OperationalSupportForm: React.FC<OperationalSupportFormProps> = ({
  sumOfOtherCauseAreas,
}) => {
  const causeAreaAmounts = useSelector((state: State) => state.donation.causeAreaAmounts) || {};
  const {
    userWants10PercentTip,
    handleTipCheckboxChange,
    handleOperationsAmountChange,
    OPERATIONS_CAUSE_AREA_ID,
    TIP_PERCENTAGE,
  } = useTippingLogic(sumOfOtherCauseAreas);

  return (
    <FormWrapper>
      <div>
        <CauseAreaTitle>
          {getCauseAreaIconById(OPERATIONS_CAUSE_AREA_ID)}
          Drift
        </CauseAreaTitle>
        <CauseAreaContext>
          För värje krone till drift förväntar vi att samla in minst 10 krone till ändamål.
        </CauseAreaContext>
      </div>
      <div>
        <CheckBoxWrapper>
          <HiddenCheckBox
            type="checkbox"
            checked={userWants10PercentTip}
            onChange={handleTipCheckboxChange}
            data-cy="tip-checkbox"
          />
          <CustomCheckBox
            checked={userWants10PercentTip}
            label={`Tip ${TIP_PERCENTAGE}% to operations of Ge Effektivt`}
          />
        </CheckBoxWrapper>
        <TotalSumWrapper>
          <SumWrapper>
            <span>
              <NumericFormat
                name={`sum-${OPERATIONS_CAUSE_AREA_ID}`}
                type="tel"
                placeholder="0"
                thousandSeparator=" "
                value={
                  causeAreaAmounts[OPERATIONS_CAUSE_AREA_ID] > 0
                    ? causeAreaAmounts[OPERATIONS_CAUSE_AREA_ID]
                    : ""
                }
                autoComplete="off"
                data-cy="donation-sum-input-operations"
                onValueChange={handleOperationsAmountChange}
                allowNegative={false}
                decimalScale={0}
              />
            </span>
          </SumWrapper>
        </TotalSumWrapper>
      </div>
    </FormWrapper>
  );
};
