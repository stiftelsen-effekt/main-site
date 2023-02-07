import Link from "next/link";
import React from "react";
import style from "./YearMenu.module.scss";

const DonationYearMenu: React.FC<{ years: number[]; selected: string; mobile?: boolean }> = ({
  years,
  selected,
  mobile,
}) => {
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
            href={{
              pathname: "/min-side/",
            }}
            scroll={false}
            passHref
          >
            <a onClick={(e) => e.currentTarget.blur()}>
              <span>Totalt</span>
            </a>
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
                pathname: "/min-side/donasjoner/" + year,
              }}
              scroll={false}
              passHref
            >
              <a onClick={(e) => e.currentTarget.blur()}>
                <span>{year}</span>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonationYearMenu;
