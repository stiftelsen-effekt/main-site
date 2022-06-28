import React from "react";
import styles from "./PointListSectionWrapper.module.scss";

export const PointListSectionWrapper: React.FC = ({ children }) => {
  return <div className={styles.pointlistsectionwrapper}>{children}</div>;
};
