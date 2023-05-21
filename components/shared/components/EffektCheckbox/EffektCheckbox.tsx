import React from "react";
import styles from "./EffektCheckbox.module.scss";

export const EffektCheckbox: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  dataCy?: string;
  children: string | JSX.Element;
}> = ({ checked, onChange, dataCy, children }) => {
  return (
    <div className={styles.wrapper} onClick={() => onChange(!checked)} data-cy={dataCy}>
      <input type="checkbox" className={styles.input} tabIndex={-1} checked={checked} readOnly />
      <div className={styles.checkboxwrapper}>
        <div className={styles.checkmark}>✓</div>
      </div>

      <div className={styles.checkboxlabel}>{children}</div>
    </div>
  );
};
