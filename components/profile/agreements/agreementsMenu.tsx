import React from "react"
import style from "../../../styles/Agreements.module.css";

const AgreementsMenu: React.FC<{selected: 'Aktive avtaler' | 'Inaktive avtaler', onChange: (selected: 'Aktive avtaler' | 'Inaktive avtaler') => void}> = ({ selected, onChange }) => {
  return (
    <div className={style.menu}>
      <ul>
        <li className={selected == "Aktive avtaler" ? style["menu-selected"] : ""} onClick={() => onChange("Aktive avtaler")}>
          <span>Aktive avtaler</span>
        </li>
        <li className={selected == "Inaktive avtaler" ? style["menu-selected"] : ""} onClick={() => onChange("Inaktive avtaler")}>
          <span>Inaktive avtaler</span>
        </li>
      </ul>
    </div>
  )
}

export default AgreementsMenu