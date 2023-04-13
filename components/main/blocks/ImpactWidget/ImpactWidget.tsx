import React, { useState } from "react";
import styles from "./ImpactWidget.module.scss";
import { ImpactWidgetOutput, SanityIntervention } from "./ImpactWidgetOutput";

export interface ImpactWidgetProps {
  default_sum: number;
  title: string;
  interventions?: SanityIntervention[];
}

export const ImpactWidget: React.FC<ImpactWidgetProps> = ({
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
          <ImpactWidgetOutput sum={sum} interventions={interventions} />
        </div>
      </div>
    </div>
  );
};
