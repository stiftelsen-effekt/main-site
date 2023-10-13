import React, { useState } from "react";
import styles from "./RadioButtons.module.scss";
import { RadioButton } from "./RadioButton";
import { wrap } from "cypress/types/lodash";
import AnimateHeight from "react-animate-height";

export const RadioButtonGroup: React.FC<{
  options: { title: string; value: number; data_cy?: string; disabled?: boolean; content?: any }[];
  selected: number | undefined;
  onSelect: (value: number) => void;
}> = ({ options, selected, onSelect }) => {
  const [name, setName] = useState<string>(
    `radio-button-group-${options
      .map((o) => (o.title || "").toLowerCase().trim().split(" ").join())
      .join("_")}`,
  );

  const optionHasContent = options.some((option) => option.content);

  const wrapperClasses = [styles.radiobuttongroup];

  if (optionHasContent) {
    wrapperClasses.push(styles.radiobuttongroup__withcontent);
  }

  return (
    <div className={wrapperClasses.join(" ")}>
      {options.map((option) => (
        <div key={option.value}>
          <RadioButton
            data_cy={option.data_cy ? option.data_cy : ""}
            name={name}
            title={option.title}
            selected={selected === option.value}
            disabled={option.disabled}
            onSelect={() => onSelect(option.value)}
          ></RadioButton>
          {option.content && (
            <AnimateHeight
              height={selected === option.value ? "auto" : 0}
              animateOpacity
              duration={300}
            >
              <div className={styles.radiobuttongroup__content}>{option.content}</div>
            </AnimateHeight>
          )}
        </div>
      ))}
    </div>
  );
};
