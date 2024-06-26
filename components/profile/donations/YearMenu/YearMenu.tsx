import Link from "next/link";
import React from "react";
import style from "./YearMenu.module.scss";
import { useRouterContext } from "../../../../context/RouterContext";

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
          <Link
            href={dashboardPath.join("/")}
            scroll={false}
            passHref
            onClick={(e) => e.currentTarget.blur()}
          >
            <span>{totalTitle}</span>
          </Link>
        </li>

        {years.map((year) => (
          <li
            key={year}
            className={selected == year.toString() ? style["menu-selected"] : ""}
            onMouseDown={(e) => (e.currentTarget.style.outline = "none")}
            onMouseUp={(e) => e.currentTarget.removeAttribute("style")}
          >
            <Link
              href={{
                pathname: [...donationsPagePath!, year].join("/"),
              }}
              scroll={false}
              passHref
              onClick={(e) => e.currentTarget.blur()}
            >
              <span>{year}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonationYearMenu;
