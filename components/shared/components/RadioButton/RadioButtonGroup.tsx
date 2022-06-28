import React, { useState } from "react";
import styles from "./RadioButtons.module.scss";
import { RadioButton } from "./RadioButton";

export const RadioButtonGroup: React.FC<{
  options: { title: string; value: number }[];
  selected: number | undefined;
  onSelect: (value: number) => void;
}> = ({ options, selected, onSelect }) => {
  const [name, setName] = useState<string>(
    `radio-button-group-${options
      .map((o) => o.title.toLowerCase().trim().split(" ").join())
      .join("_")}`,
  );
  return (
    <div className={styles.radiobuttongroup}>
      {options.map((option) => (
        <RadioButton
          name={name}
          key={option.value}
          title={option.title}
          selected={selected === option.value}
          onSelect={() => onSelect(option.value)}
        ></RadioButton>
      ))}
    </div>
  );
};
