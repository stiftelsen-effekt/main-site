import style from "../../styles/Infobox.module.css";
import React from "react";

export const InfoBox: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className={style.infoBox}>{children}</div>;
  };
