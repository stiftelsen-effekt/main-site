import React from "react";
import { ToolTip } from "../ToolTip/ToolTip";
import {
  TextInputField,
  ComputerInputLabel,
  TextInputProps,
  TextInputWrapper,
  MobileInputLabel,
} from "./TextInput.style";

export const TextInput: React.FC<TextInputProps> = ({
  tooltipText,
  label,
  denomination,
  name,
  type,
  inputMode,
  placeholder,
  defaultValue,
  innerRef,
  selectOnClick,
  clustered,
  autoComplete,
  value,
  onChange,
}) => {
  let mobileLabel;
  // Mobile labels longer than 25 characters are abbreviated
  if (label && label.length > 25) {
    mobileLabel =
      label === "Drift av gieffektivt.no"
        ? "Egen drift"
        : label?.match(/[A-Z]/g)?.join("");
  } else {
    mobileLabel = label;
  }
  return (
    <TextInputWrapper denomination={denomination} clustered={clustered}>
      {label && <ComputerInputLabel>{label}</ComputerInputLabel>}
      {label && <MobileInputLabel>{mobileLabel}</MobileInputLabel>}
      {tooltipText && <ToolTip text={tooltipText} />}
      <TextInputField
        autoComplete={autoComplete}
        tooltipText={tooltipText}
        label={label}
        name={name}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        defaultValue={defaultValue}
        denomination={denomination}
        ref={innerRef}
        value={value}
        onChange={onChange}
        onFocus={(e) => {
          if (selectOnClick) e.currentTarget.select();
        }}
      />
    </TextInputWrapper>
  );
};
