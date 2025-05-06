import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../../store/state";
import { setCauseAreaAmount } from "../../../store/donation/actions";

const TIP_PERCENTAGE = 10;
const OPERATIONS_CAUSE_AREA_ID = 4;

export const useTippingLogic = (sumOfOtherCauseAreas: number) => {
  const dispatch = useDispatch<any>();
  const causeAreaAmounts = useSelector((state: State) => state.donation.causeAreaAmounts) || {};
  const [userWants10PercentTip, setUserWants10PercentTip] = useState(false);

  // Initialize tip state based on current amount
  useEffect(() => {
    const currentOperationsAmount = causeAreaAmounts[OPERATIONS_CAUSE_AREA_ID] || 0;
    const expectedTip = Math.round((TIP_PERCENTAGE / 100) * sumOfOtherCauseAreas);
    setUserWants10PercentTip(currentOperationsAmount === expectedTip);
  }, [sumOfOtherCauseAreas]);

  // Effect to maintain 10% tip when checkbox is checked
  useEffect(() => {
    if (userWants10PercentTip) {
      const expectedTip = Math.round((TIP_PERCENTAGE / 100) * sumOfOtherCauseAreas);
      const currentOperationsAmount = causeAreaAmounts[OPERATIONS_CAUSE_AREA_ID] || 0;

      // Only update if the current amount doesn't match the expected tip
      if (currentOperationsAmount !== expectedTip) {
        dispatch(setCauseAreaAmount(OPERATIONS_CAUSE_AREA_ID, expectedTip));
      }
    }
  }, [userWants10PercentTip, sumOfOtherCauseAreas, causeAreaAmounts]);

  const handleTipCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setUserWants10PercentTip(isChecked);

    if (isChecked) {
      const newTipAmount = Math.round((TIP_PERCENTAGE / 100) * sumOfOtherCauseAreas);
      dispatch(setCauseAreaAmount(OPERATIONS_CAUSE_AREA_ID, newTipAmount));
    } else {
      dispatch(setCauseAreaAmount(OPERATIONS_CAUSE_AREA_ID, 0));
    }
  };

  const handleOperationsAmountChange = (values: {
    floatValue: number | undefined;
    formattedValue: string;
    value: string;
  }) => {
    const numericValue = values.floatValue === undefined ? 0 : values.floatValue;
    dispatch(setCauseAreaAmount(OPERATIONS_CAUSE_AREA_ID, numericValue));

    // Update checkbox state based on whether the new value matches 10%
    const expectedTip = Math.round((TIP_PERCENTAGE / 100) * sumOfOtherCauseAreas);
    setUserWants10PercentTip(numericValue === expectedTip);
  };

  return {
    userWants10PercentTip,
    handleTipCheckboxChange,
    handleOperationsAmountChange,
    OPERATIONS_CAUSE_AREA_ID,
    TIP_PERCENTAGE,
  };
};
