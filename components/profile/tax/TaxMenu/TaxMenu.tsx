import React from "react";
import style from "./TaxMenu.module.scss";
import { useRouterContext } from "../../../../context/RouterContext";
import Link from "next/link";

export enum TaxMenuChoices {
  TAX_UNITS = "skatteenheter",
  FACEBOOK_DONATIONS = "facebook-instagram",
  ABOUT_TAX_DEDUCTIONS = "om",
  YEARLY_REPORTS = "aarsoppgaver",
}

const TaxMenu: React.FC<{
  selected: TaxMenuChoices;
  mobile?: boolean;
}> = ({ selected, mobile }) => {
  const { taxUnitsPagePath, taxStatementsPagePath, metaReceiptPagePath, taxDeductionsPagePath } =
    useRouterContext();
  const containerStyles = [style.menu];
  if (mobile) containerStyles.push(style.menumobile);

  return (
    <div className={containerStyles.join(" ")}>
      <ul>
        {taxUnitsPagePath ? (
          <li className={selected == TaxMenuChoices.TAX_UNITS ? style["menu-selected"] : ""}>
            <Link href={taxUnitsPagePath.join("/")} passHref>
              <a>Skatteenheter</a>
            </Link>
          </li>
        ) : null}
        {taxStatementsPagePath ? (
          <li className={selected == TaxMenuChoices.YEARLY_REPORTS ? style["menu-selected"] : ""}>
            <Link href={taxStatementsPagePath.join("/")} passHref>
              <a>Årsoppgaver</a>
            </Link>
          </li>
        ) : null}
        {metaReceiptPagePath ? (
          <li
            className={selected == TaxMenuChoices.FACEBOOK_DONATIONS ? style["menu-selected"] : ""}
          >
            <Link href={metaReceiptPagePath.join("/")} passHref>
              <a>Facebook og Instagram</a>
            </Link>
          </li>
        ) : null}
        {taxDeductionsPagePath ? (
          <li
            className={
              selected == TaxMenuChoices.ABOUT_TAX_DEDUCTIONS ? style["menu-selected"] : ""
            }
          >
            <Link href={taxDeductionsPagePath.join("/")} passHref>
              <a>Om skattefradrag</a>
            </Link>
          </li>
        ) : null}
      </ul>
    </div>
  );
};

export default TaxMenu;
