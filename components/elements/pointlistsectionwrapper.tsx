import React from "react";
import styles from "../../styles/PointListSectionWrapper.module.css";

export const PointListSectionWrapper: React.FC = ({ children }) => {
  return <div className={styles.pointlistsectionwrapper}>{children}</div>;
};
