import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NumericFormat } from "react-number-format";
import { State } from "../../../store/state";
import { CauseArea } from "../../../types/CauseArea";
import {
  setGlobalOperationsEnabled,
  setGlobalOperationsPercentageMode,
  setGlobalOperationsAmount,
} from "../../../store/donation/actions";
import { CheckBoxWrapper, HiddenCheckBox } from "../Forms.style";
import { CustomCheckBox } from "../DonorPane/CustomCheckBox";
import { thousandize } from "../../../../../../../util/formatting";
import { SumWrapper } from "../AmountPane.style";

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
    globalOperationsPercentageMode = true,
    globalOperationsAmount = 0,
  } = useSelector((state: State) => state.donation);

  const CUT_PERCENTAGE = 5;

  // In multiple cause areas mode, we use the global operations enabled state
  const relevantCauseAreaIds = causeAreas.map((ca) => ca.id);

  // Calculate total amounts (just sum what users entered)
  const totalAmount = relevantCauseAreaIds.reduce(
    (sum, id) => sum + (causeAreaAmounts[id] || 0),
    0,
  );

  // Use the percentage mode from state
  const isPercentageMode = globalOperationsPercentageMode;

  // State for custom cut
  const [customCutAmount, setCustomCutAmount] = React.useState(
    !isPercentageMode && globalOperationsAmount > 0 ? globalOperationsAmount : 0,
  );

  // Update percentage amount when total changes (only if already enabled)
  React.useEffect(() => {
    if (totalAmount > 0 && globalOperationsEnabled && isPercentageMode) {
      const newPercentageCut = Math.round((totalAmount * CUT_PERCENTAGE) / 100);
      if (Math.abs(globalOperationsAmount - newPercentageCut) > 1) {
        dispatch(setGlobalOperationsAmount(newPercentageCut));
      }
    }
  }, [totalAmount, globalOperationsEnabled, isPercentageMode, globalOperationsAmount, dispatch]);

  const handleGlobalCutToggle = (checked: boolean) => {
    // Update the percentage mode state
    dispatch(setGlobalOperationsPercentageMode(checked));

    if (checked) {
      // Switch to percentage mode - calculate 5% of total
      const percentageCut = Math.round((totalAmount * CUT_PERCENTAGE) / 100);
      dispatch(setGlobalOperationsAmount(percentageCut));
      dispatch(setGlobalOperationsEnabled(true));
      setCustomCutAmount(0);
    } else {
      // Switch to custom cut mode - use existing custom cut or 0
      if (customCutAmount > 0) {
        dispatch(setGlobalOperationsAmount(customCutAmount));
        dispatch(setGlobalOperationsEnabled(true));
      } else {
        dispatch(setGlobalOperationsAmount(0));
        dispatch(setGlobalOperationsEnabled(false));
      }
    }
  };

  const handleCustomCutChange = (values: { floatValue: number | undefined }) => {
    const v = values.floatValue === undefined ? 0 : values.floatValue;
    // Limit custom cut to total donation amount
    const limitedCut = Math.min(v, totalAmount);
    setCustomCutAmount(limitedCut);

    // Set global operations amount if not in percentage mode
    if (!isPercentageMode) {
      dispatch(setGlobalOperationsAmount(limitedCut));
      dispatch(setGlobalOperationsEnabled(limitedCut > 0));
    }
  };

  return (
    <div
      style={{
        marginTop: "20px",
        marginBottom: "20px",
        padding: "15px",
        border: "1px solid var(--primary)",
        borderRadius: "8px",
      }}
    >
      <CheckBoxWrapper>
        <HiddenCheckBox
          type="checkbox"
          checked={isPercentageMode}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleGlobalCutToggle(e.target.checked)
          }
          data-cy="global-cut-checkbox"
        />
        <CustomCheckBox
          checked={isPercentageMode}
          label={`${CUT_PERCENTAGE}% till drift av Ge Effektivt`}
        />
      </CheckBoxWrapper>

      {/* Show custom cut input when not in percentage mode */}
      {!isPercentageMode && (
        <div style={{ marginTop: "15px" }}>
          <div style={{ marginBottom: "5px", fontSize: "14px", color: "#666" }}>
            Ange valfritt belopp till drift:
          </div>
          <SumWrapper style={{ maxWidth: "150px" }}>
            <span>
              <NumericFormat
                name="global-custom-cut"
                thousandSeparator=" "
                allowNegative={false}
                decimalScale={0}
                type="tel"
                placeholder="0"
                value={customCutAmount > 0 ? customCutAmount : ""}
                autoComplete="off"
                data-cy="global-custom-cut-input"
                onValueChange={handleCustomCutChange}
              />
            </span>
          </SumWrapper>
        </div>
      )}
    </div>
  );
};
