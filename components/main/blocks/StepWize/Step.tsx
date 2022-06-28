import React from "react";
import styles from "./Stepwize.module.scss";

interface EachStep {
  heading: string;
  subheading: string;
  description: string;
}

export const Step: React.FC<EachStep> = ({ heading, subheading, description }) => {
  return (
    <div className={styles.step}>
      <h1 className={styles.step__heading}>{heading}</h1>
      <h5 className={styles.step__subheading}>{subheading}</h5>
      <p className={styles.step__description}>{description}</p>
    </div>
  );
};
