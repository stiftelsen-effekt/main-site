import React, { useState } from "react";
import styles from "../../styles/RadioButtons.module.css";
import { RadioButton } from "./radiobutton";

export const RadioButtonGroup: React.FC<{
  options: { title: string; value: number }[];
  selected: number | undefined;
  onSelect: (value: number) => void;
}> = ({ options, selected, onSelect }) => {
  const [name, setName] = useState<string>(`radio-button-group-${Math.random()}`);
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
