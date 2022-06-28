import style from "./Infobox.module.scss";
import React from "react";

export const InfoBox: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className={style.infoBox}>{children}</div>;
};
