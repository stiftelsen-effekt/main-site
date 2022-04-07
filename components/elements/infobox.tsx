import React, { Children } from "react";
import { Clock } from "react-feather";
import style from "../../styles/Infobox.module.css";

export const InfoBox:  React.FC<{children: React.ReactNode;}>= ({children}) => {
  return (
    <div className={style.infoBox}>
        {children}
    </div>
  );
};
