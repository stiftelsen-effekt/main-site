import Link from "next/link";
import React from "react"
import style from "../../../styles/Donations.module.css";

const DonationYearMenu: React.FC<{years: number[], selected: string}> = ({ years, selected }) => {
  years = years.sort((a,b) => b-a)

  return (
    <div className={style.menu}>
      <ul>
        <li className={selected == "total" ? style["menu-selected"] : ""}>
          <Link 
            href={{
              pathname: "/profile/"
            }}
            passHref >
            <span>Totalt</span>
          </Link>
        </li>
        {years.map((year) => (
          <li key={year} className={selected == year.toString() ? style["menu-selected"] : ""} >
            <Link 
              href={{
                pathname: "/profile/",
                query: {
                  year
                },
              }}
              passHref >
              <span>{year}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DonationYearMenu