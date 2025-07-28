import React, { useId } from "react";
import styles from "./RadioButtons.module.scss";

export const RadioButton: React.FC<{
  selected: boolean;
  name: string;
  title: string;
  disabled?: boolean;
  required?: boolean;
  data_cy: string;
  onSelect: () => void;
}> = ({ selected, name, title, disabled, required, data_cy, onSelect }) => {
  const uniqueId = useId();
  const uniqueName = `${name}-${uniqueId}`;

  return (
    <label className={styles.radiobuttonwrapper}>
      <input
        data-cy={data_cy}
        type={"radio"}
        name={uniqueName}
        title={title}
        className={styles.radiobutton}
        checked={selected}
        disabled={disabled}
        onChange={() => {
          if (disabled) return;
          onSelect();
        }}
        required={required}
      />
      <div className={styles.radiobuttonlabel}>{title}</div>
    </label>
  );
};
