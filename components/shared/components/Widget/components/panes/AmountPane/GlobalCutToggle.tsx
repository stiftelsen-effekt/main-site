import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../../store/state";
import { CauseArea } from "../../../types/CauseArea";
import {
  setCauseAreaAmount,
  setOperationsAmountByCauseArea,
  setOrgAmount,
  setGlobalOperationsUserOverride,
  setGlobalOperationsEnabled,
} from "../../../store/donation/actions";
import { CheckBoxWrapper, HiddenCheckBox } from "../Forms.style";
import { CustomCheckBox } from "../DonorPane/CustomCheckBox";
import { thousandize } from "../../../../../../../util/formatting";

interface GlobalCutToggleProps {
  causeAreas: CauseArea[];
}

export const GlobalCutToggle: React.FC<GlobalCutToggleProps> = ({ causeAreas }) => {
  const dispatch = useDispatch<any>();
  const {
    causeAreaAmounts = {},
    operationsAmountsByCauseArea = {},
    orgAmounts = {},
    globalOperationsEnabled = false,
  } = useSelector((state: State) => state.donation);

  const CUT_PERCENTAGE = 5;

  // In multiple cause areas mode, we use the global operations enabled state
  const relevantCauseAreaIds = causeAreas.map((ca) => ca.id);

  // Calculate total amounts (just sum what users entered)
  const totalAmount = relevantCauseAreaIds.reduce(
    (sum, id) => sum + (causeAreaAmounts[id] || 0),
    0,
  );

  const handleGlobalCutToggle = (checked: boolean) => {
    // Simply toggle the global operations enabled state
    dispatch(setGlobalOperationsEnabled(checked));
    // Mark that user has explicitly toggled the global checkbox
    dispatch(setGlobalOperationsUserOverride(true, checked));

    // When global toggle is explicitly changed, update all cause area operations amounts
    if (checked) {
      // Enable operations cut for all cause areas with amounts
      relevantCauseAreaIds.forEach((id) => {
        const amount = causeAreaAmounts[id] || 0;
        if (amount > 0) {
          const operationsAmount = Math.round((amount * CUT_PERCENTAGE) / 100);
          dispatch(setOperationsAmountByCauseArea(id, operationsAmount));
        }
      });
    } else {
      // Disable operations cut for all cause areas
      relevantCauseAreaIds.forEach((id) => {
        dispatch(setOperationsAmountByCauseArea(id, 0));
      });
    }
  };

  // Only show if there are amounts set
  if (totalAmount === 0) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: "20px",
        marginBottom: "20px",
        padding: "15px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <CheckBoxWrapper>
        <HiddenCheckBox
          type="checkbox"
          checked={globalOperationsEnabled}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleGlobalCutToggle(e.target.checked)
          }
          data-cy="global-cut-checkbox"
        />
        <CustomCheckBox
          checked={globalOperationsEnabled}
          label={`${CUT_PERCENTAGE}% till drift av Ge Effektivt`}
        />
      </CheckBoxWrapper>
      {globalOperationsEnabled && totalAmount > 0 && (
        <div style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
          {CUT_PERCENTAGE}% av {thousandize(totalAmount)} kr ={" "}
          {thousandize(Math.round((totalAmount * CUT_PERCENTAGE) / 100))} kr til drift
          <br />
          <small style={{ color: "#888" }}>
            {thousandize(Math.round((totalAmount * (100 - CUT_PERCENTAGE)) / 100))} kr går till
            välda ändamål, {thousandize(Math.round((totalAmount * CUT_PERCENTAGE) / 100))} kr till
            drift
          </small>
        </div>
      )}
    </div>
  );
};
