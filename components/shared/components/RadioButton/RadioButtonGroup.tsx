import React, { useState } from "react";
import styles from "./RadioButtons.module.scss";
import { RadioButton } from "./RadioButton";

export const RadioButtonGroup: React.FC<{
  options: { title: string; value: number; data_cy?: string; disabled?: boolean }[];
  selected: number | undefined;
  onSelect: (value: number) => void;
}> = ({ options, selected, onSelect }) => {
  const [name, setName] = useState<string>(
    `radio-button-group-${options
      .map((o) => (o.title || "").toLowerCase().trim().split(" ").join())
      .join("_")}`,
  );
  return (
    <div className={styles.radiobuttongroup}>
      {options.map((option) => (
        <RadioButton
          data_cy={option.data_cy ? option.data_cy : ""}
          name={name}
          key={option.value}
          title={option.title}
          selected={selected === option.value}
          disabled={option.disabled}
          onSelect={() => onSelect(option.value)}
        ></RadioButton>
      ))}
    </div>
  );
};
