import React from "react";
import style from "./AgreementsMenu.module.scss";

export enum AgreementsMenuOptions {
  ACTIVE_AGREEMENTS,
  INACTIVE_AGREEMENTS,
}

const AgreementsMenu: React.FC<{
  selected: AgreementsMenuOptions;
  activeLabel: string;
  inactiveLabel: string;
  onChange: (selected: AgreementsMenuOptions) => void;
}> = ({ selected, activeLabel, inactiveLabel, onChange }) => {
  return (
    <div className={style.menu}>
      <ul>
        <li
          className={
            selected == AgreementsMenuOptions.ACTIVE_AGREEMENTS ? style["menu-selected"] : ""
          }
          onClick={() => onChange(AgreementsMenuOptions.ACTIVE_AGREEMENTS)}
        >
          <span>{activeLabel}</span>
        </li>
        <li
          className={
            selected == AgreementsMenuOptions.INACTIVE_AGREEMENTS ? style["menu-selected"] : ""
          }
          onClick={() => onChange(AgreementsMenuOptions.INACTIVE_AGREEMENTS)}
        >
          <span>{inactiveLabel}</span>
        </li>
      </ul>
    </div>
  );
};

export default AgreementsMenu;
