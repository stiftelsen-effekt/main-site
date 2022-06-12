import React from "react";
import { Spinner } from "./spinner";
import style from "../../styles/Spinner.module.css";

export const FullPageSpinner: React.FC = () => {
  return (
    <div className={style.fullpagewrapper}>
      <Spinner />
    </div>
  );
};
