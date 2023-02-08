import React from "react";
import style from "./TaxMenu.module.scss";

export enum TaxMenuChoices {
  TAX_UNITS = "skatteenheter",
  FACEBOOK_DONATIONS = "facebook-instagram",
  ABOUT_TAX_DEDUCTIONS = "om",
  YEARLY_REPORTS = "aarsoppgaver",
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
          <button onClick={(e) => e.currentTarget.blur()}>Skatteenheter</button>
        </li>
        <li
          className={selected == TaxMenuChoices.YEARLY_REPORTS ? style["menu-selected"] : ""}
          onClick={() => onChange(TaxMenuChoices.YEARLY_REPORTS)}
        >
          <button onClick={(e) => e.currentTarget.blur()}>Årsoppgaver</button>
        </li>
        <li
          className={selected == TaxMenuChoices.FACEBOOK_DONATIONS ? style["menu-selected"] : ""}
          onClick={() => onChange(TaxMenuChoices.FACEBOOK_DONATIONS)}
        >
          <button onClick={(e) => e.currentTarget.blur()}>Facebook og Instagram</button>
        </li>
        <li
          className={selected == TaxMenuChoices.ABOUT_TAX_DEDUCTIONS ? style["menu-selected"] : ""}
          onClick={() => onChange(TaxMenuChoices.ABOUT_TAX_DEDUCTIONS)}
        >
          <button onClick={(e) => e.currentTarget.blur()}>Om skattefradrag</button>
        </li>
      </ul>
    </div>
  );
};

export default TaxMenu;
