import React from "react";
import style from "./SumInput.module.scss";

export const SumInput: React.FC<{
  value: string;
  label: string;
  onChange: (value: string) => void;
}> = ({ value, label, onChange }) => {
  return (
    <div className={style.inputWrapper}>
      <input
        className={style.inputField}
        type="text"
        maxLength={15}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-cy="agreement-list-amount-input"
      />
      <span className={style.label}>{label}</span>
    </div>
  );
};
