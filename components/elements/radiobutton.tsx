import React from "react";
import styles from "../../styles/RadioButtons.module.css";

export const RadioButton: React.FC<{
  selected: boolean;
  name: string;
  title: string;
  data_cy: string;
  onSelect: () => void;
}> = ({ selected, name, title, data_cy, onSelect }) => {
  return (
    <div className={styles.radiobuttonwrapper}>
      <input
        data-cy={data_cy}
        type={"radio"}
        name={name}
        title={title}
        className={styles.radiobutton}
        checked={selected}
        onChange={onSelect}
      />
      <label className={styles.radiobuttonlabel} htmlFor={title} onClick={onSelect}>
        {title}
      </label>
    </div>
  );
};
