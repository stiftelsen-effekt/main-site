import React from "react";
import style from "../../../shared/components/Spinner/Spinner.module.scss";
import elements from "./ActivityIndicator.module.scss";

export const ActivityIndicator: React.FC<{ active: boolean }> = ({ active }) => {
  return (
    <div
      className={
        elements["activity-indicator-wrapper"] +
        " " +
        (active ? elements["activity-indicator-wrapper--active"] : "")
      }
    >
      <div className={style["lds-dual-ring"]}></div>
    </div>
  );
};
