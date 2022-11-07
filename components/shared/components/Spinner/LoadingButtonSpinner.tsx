import React from "react";
import style from "./Spinner.module.scss";

export const LoadingButtonSpinner: React.FC = () => {
  return (
    <>
      &nbsp;<div className={style["textsizespinner"]}></div>&nbsp;
    </>
  );
};
