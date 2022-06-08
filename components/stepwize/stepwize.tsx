import React from "react";
import { Step } from "./step";
import styles from "../../styles/Stepwize.module.css";

export const Stepwize: React.FC<{ steps: { heading: string; body: string }[] }> = ({ steps }) => {
  return (
    <div className={styles.stepwize__container}>
      {steps &&
        steps.map((step, index) => (
          <Step
            key={index}
            heading={`0${index + 1}.`}
            subheading={step.heading}
            description={step.body}
          />
        ))}
    </div>
  );
};
