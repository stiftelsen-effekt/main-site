import React from "react";
import style from "../../styles/Spinner.module.css";

export const Spinner: React.FC = () => {
  return <div className={style.wrapper}><div className={style["lds-dual-ring"]}></div></div>
}