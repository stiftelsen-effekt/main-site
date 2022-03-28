import React from "react";
import style from "../../styles/Spinner.module.css";
import elements from "../../styles/Elements.module.css";

export const ActivityIndicator: React.FC<{ active: boolean }> = ({ active }) => {
  return <div className={elements["activity-indicator-wrapper"] + ' ' + (active ? elements["activity-indicator-wrapper--active"] : "")}><div className={style["lds-dual-ring"]}></div></div>
}