import React from "react";
import style from "./Spinner.module.scss";

export const Spinner: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={style["lds-dual-ring"] + " " + className}></div>;
};
