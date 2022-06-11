import React from "react";
import style from "../../styles/Spinner.module.css";
import elements from "../../styles/Elements.module.css";

export const Spinner: React.FC = () => {
  return <div className={style["lds-dual-ring"]}></div>;
};
