import React, { useEffect, useState } from "react";
import AnimateHeight from "react-animate-height";
import styles from "./ImpactWidget.module.scss";
import { Links } from "../Links/Links";
import { Spinner } from "../../../shared/components/Spinner/Spinner";
import { thousandize } from "../../../../util/formatting";
import { ImpactWidgetOutput } from "./ImpactWidgetOutput";

export interface ImpactWidgetProps {
  frontpage: any;
}

export const ImpactWidget: React.FC<ImpactWidgetProps> = ({ frontpage }) => {
  const [sum, setSum] = useState(frontpage.intervention_widget.default_sum);

  const interventionWidget = frontpage.intervention_widget;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3>{interventionWidget.title}</h3>
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
          <ImpactWidgetOutput sum={sum} interventions={interventionWidget.interventions} />
        </div>
      </div>
    </div>
  );
};
