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
        <Link
          href={{
            pathname: "/profile/",
          }}
          scroll={false}
          passHref
        >
          <li className={selected == "total" ? style["menu-selected"] : ""}>
            <span>Totalt</span>
          </li>
        </Link>
        {years.map((year) => (
          <Link
            key={year}
            href={{
              pathname: "/profile/",
              query: {
                year,
              },
            }}
            scroll={false}
            passHref
          >
            <li className={selected == year.toString() ? style["menu-selected"] : ""}>
              <span>{year}</span>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default DonationYearMenu;
