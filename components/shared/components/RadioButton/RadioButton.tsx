import React from "react";
import styles from "./RadioButtons.module.scss";

export const RadioButton: React.FC<{
  selected: boolean;
  name: string;
  title: string;
  disabled?: boolean;
  data_cy: string;
  onSelect: () => void;
}> = ({ selected, name, title, disabled, data_cy, onSelect }) => {
  return (
    <label className={styles.radiobuttonwrapper}>
      <input
        data-cy={data_cy}
        type={"radio"}
        name={name}
        title={title}
        className={styles.radiobutton}
        checked={selected}
        disabled={disabled}
        onChange={() => {
          if (disabled) return;
          onSelect();
        }}
      />
      <div className={styles.radiobuttonlabel}>{title}</div>
    </label>
  );
};
