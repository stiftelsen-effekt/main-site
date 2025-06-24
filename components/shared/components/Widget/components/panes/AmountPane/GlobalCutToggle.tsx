import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NumericFormat } from "react-number-format";
import { State } from "../../../store/state";
import {
  setGlobalOperationsEnabled,
  setGlobalOperationsPercentage,
} from "../../../store/donation/actions";
import { CheckBoxWrapper, HiddenCheckBox } from "../Forms.style";
import { CustomCheckBox } from "../DonorPane/CustomCheckBox";
import { OperationsPercentageInputWrapper } from "../AmountPane.style";

const DEFAULT_CUT_PERCENTAGE = 5;

export const GlobalCutToggle: React.FC = () => {
  const dispatch = useDispatch<any>();
  const { globalOperationsEnabled = true, globalOperationsPercentage = DEFAULT_CUT_PERCENTAGE } =
    useSelector((state: State) => state.donation);

  // Use percentage from Redux state
  const handleGlobalCutToggle = (checked: boolean) => {
    dispatch(setGlobalOperationsEnabled(checked));
  };

  const handlePercentageChange = (values: { floatValue: number | undefined }) => {
    const v = values.floatValue === undefined ? 0 : values.floatValue;
    // Limit percentage to 0-100
    const limitedPercentage = Math.min(Math.max(v, 0), 100);
    dispatch(setGlobalOperationsPercentage(limitedPercentage));
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
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <CheckBoxWrapper>
          <HiddenCheckBox
            type="checkbox"
            checked={globalOperationsEnabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleGlobalCutToggle(e.target.checked)
            }
            data-cy={`global-cut-checkbox`}
          />
          <CustomCheckBox checked={globalOperationsEnabled} label="" />
        </CheckBoxWrapper>
        <OperationsPercentageInputWrapper>
          <span>
            <NumericFormat
              name={`global-percentage-cut`}
              allowNegative={false}
              decimalScale={1}
              max={100}
              type="tel"
              placeholder="5"
              value={globalOperationsPercentage}
              autoComplete="off"
              data-cy={`global-percentage-cut-input`}
              onValueChange={handlePercentageChange}
            />
          </span>
          <span>% till drift av Ge Effektivt</span>
        </OperationsPercentageInputWrapper>
      </div>
    </div>
  );
};
