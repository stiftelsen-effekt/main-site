import React from "react";
import styles from "../../styles/RadioButtons.module.css";

export const RadioButton: React.FC<{
  selected: boolean;
  name: string;
  title: string;
  onSelect: () => void;
}> = ({ selected, name, title, onSelect }) => {
  return (
    <div className={styles.radiobuttonwrapper}>
      <input
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
