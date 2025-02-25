import Link from "next/link";
import React from "react";
import style from "./YearMenu.module.scss";
import { useRouterContext } from "../../../../context/RouterContext";
import { CustomLink } from "../../../shared/components/CustomLink/CustomLink";

const DonationYearMenu: React.FC<{
  totalTitle: string;
  years: number[];
  selected: string;
  mobile?: boolean;
}> = ({ totalTitle, years, selected, mobile }) => {
  const { dashboardPath, donationsPagePath } = useRouterContext();

  years = years.sort((a, b) => b - a);

  return (
    <div
      className={`${style.menu} ${mobile ? style.menumobile : ""}`}
      data-cy={mobile ? "" : "year-menu"}
    >
      <ul>
        <li
          className={selected == "total" ? style["menu-selected"] : ""}
          onMouseDown={(e) => (e.currentTarget.style.outline = "none")}
          onMouseUp={(e) => e.currentTarget.removeAttribute("style")}
        >
          <CustomLink
            href={dashboardPath.join("/")}
            scroll={false}
            onClick={(e) => e.currentTarget.blur()}
          >
            <span>{totalTitle}</span>
          </CustomLink>
        </li>

        {years.map((year) => (
          <li
            key={year}
            className={selected == year.toString() ? style["menu-selected"] : ""}
            onMouseDown={(e) => (e.currentTarget.style.outline = "none")}
            onMouseUp={(e) => e.currentTarget.removeAttribute("style")}
          >
            <CustomLink
              href={{
                pathname: [...donationsPagePath!, year].join("/"),
              }}
              scroll={false}
              onClick={(e) => e.currentTarget.blur()}
            >
              <span>{year}</span>
            </CustomLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonationYearMenu;
