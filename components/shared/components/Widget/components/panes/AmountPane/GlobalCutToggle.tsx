import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NumericFormat } from "react-number-format";
import { State } from "../../../store/state";
import { CauseArea } from "../../../types/CauseArea";
import {
  setGlobalOperationsUserOverride,
  setGlobalOperationsEnabled,
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
    globalOperationsUserOverride,
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

  // Check if we're in percentage mode
  const expectedPercentageAmount = Math.round((totalAmount * CUT_PERCENTAGE) / 100);
  const isPercentageMode =
    globalOperationsEnabled && Math.abs(globalOperationsAmount - expectedPercentageAmount) < 2;

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
    // Toggle the global operations enabled state
    dispatch(setGlobalOperationsEnabled(checked));
    // Mark that user has explicitly toggled the global checkbox
    dispatch(setGlobalOperationsUserOverride(true, checked));

    if (checked) {
      // Switch to percentage mode - calculate 5% of total
      const percentageCut = Math.round((totalAmount * CUT_PERCENTAGE) / 100);
      dispatch(setGlobalOperationsAmount(percentageCut));
      setCustomCutAmount(0);
    } else {
      // Switch to custom cut mode - use existing custom cut or 0
      if (customCutAmount > 0) {
        dispatch(setGlobalOperationsAmount(customCutAmount));
      } else {
        dispatch(setGlobalOperationsAmount(0));
      }
    }
  };

  const handleCustomCutChange = (values: { floatValue: number | undefined }) => {
    const v = values.floatValue === undefined ? 0 : values.floatValue;
    // Limit custom cut to total donation amount
    const limitedCut = Math.min(v, totalAmount);
    setCustomCutAmount(limitedCut);

    // Set global operations amount if not in percentage mode
    if (!globalOperationsEnabled) {
      dispatch(setGlobalOperationsAmount(limitedCut));
    }
  };

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
      {/* Show percentage breakdown when in percentage mode */}
      {globalOperationsEnabled && totalAmount > 0 && (
        <div style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
          {CUT_PERCENTAGE}% av {thousandize(totalAmount)} kr = {thousandize(globalOperationsAmount)}{" "}
          kr til drift
          <br />
          <small style={{ color: "#888" }}>
            {thousandize(totalAmount - globalOperationsAmount)} kr går till välda ändamål,{" "}
            {thousandize(globalOperationsAmount)} kr till drift
          </small>
        </div>
      )}

      {/* Show custom cut input when not in percentage mode */}
      {!globalOperationsEnabled && (
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
          {totalAmount > 0 && (
            <div style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
              {thousandize(customCutAmount)} kr til drift
              <br />
              <small style={{ color: "#888" }}>
                {thousandize(totalAmount - customCutAmount)} kr går till välda ändamål,{" "}
                {thousandize(customCutAmount)} kr till drift
              </small>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
