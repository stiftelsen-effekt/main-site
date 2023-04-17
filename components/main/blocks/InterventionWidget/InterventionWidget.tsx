import React, { useState } from "react";
import styles from "./InterventionWidget.module.scss";
import { InterventionWidgetOutput, SanityIntervention } from "./InterventionWidgetOutput";

export interface InterventionWidgetProps {
  default_sum: number;
  title: string;
  interventions?: SanityIntervention[];
}

export const InterventionWidget: React.FC<InterventionWidgetProps> = ({
  default_sum,
  title,
  interventions,
}) => {
  const [sum, setSum] = useState(default_sum);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3>{title}</h3>
      </div>
      <div className={styles.grid}>
        <div className={styles.input}>
          <div className={styles.input}>
            <label htmlFor="sum">Donasjon:</label>
            <div className={styles.inputWrapper}>
              <input
                data-cy="impact-input"
                type="tel"
                value={sum}
                onChange={(e) => {
                  if (e.target.value.length <= 9) setSum(parseInt(e.target.value) || 0);
                }}
                name="sum"
              />
            </div>
          </div>
        </div>
        <div className={styles.output}>
          <InterventionWidgetOutput sum={sum} interventions={interventions} />
        </div>
      </div>
    </div>
  );
};
