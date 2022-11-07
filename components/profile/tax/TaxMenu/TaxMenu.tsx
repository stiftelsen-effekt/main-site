import React from "react";
import style from "./TaxMenu.module.scss";

export enum TaxMenuChoices {
  TAX_UNITS = "Skatteenheter",
  FACEBOOK_DONATIONS = "Facebook-donasjoner",
  ABOUT_TAX_DEDUCTIONS = "Om skattefradrag",
}

const TaxMenu: React.FC<{
  selected: TaxMenuChoices;
  onChange: (selected: TaxMenuChoices) => void;
  mobile?: boolean;
}> = ({ selected, onChange, mobile }) => {
  const containerStyles = [style.menu];
  if (mobile) containerStyles.push(style.menumobile);

  return (
    <div className={containerStyles.join(" ")}>
      <ul>
        <li
          className={selected == TaxMenuChoices.TAX_UNITS ? style["menu-selected"] : ""}
          onClick={() => onChange(TaxMenuChoices.TAX_UNITS)}
        >
          <button onClick={(e) => e.currentTarget.blur()}>{TaxMenuChoices.TAX_UNITS}</button>
        </li>
        <li
          className={selected == TaxMenuChoices.FACEBOOK_DONATIONS ? style["menu-selected"] : ""}
          onClick={() => onChange(TaxMenuChoices.FACEBOOK_DONATIONS)}
        >
          <button onClick={(e) => e.currentTarget.blur()}>
            {TaxMenuChoices.FACEBOOK_DONATIONS}
          </button>
        </li>
        <li
          className={selected == TaxMenuChoices.ABOUT_TAX_DEDUCTIONS ? style["menu-selected"] : ""}
          onClick={() => onChange(TaxMenuChoices.ABOUT_TAX_DEDUCTIONS)}
        >
          <button onClick={(e) => e.currentTarget.blur()}>
            {TaxMenuChoices.ABOUT_TAX_DEDUCTIONS}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default TaxMenu;
