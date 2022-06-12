import { style } from "d3";
import React, { useContext, useState } from "react";
import styles from "../../styles/ImpactWidget.module.css";
import { WidgetContext } from "../main/layout";
import { EffektButton } from "./effektbutton";
import { Spinner } from "./spinner";

export type Intervention = {
  title: string;
  pricePerOutput?: number;
  outputStringTemplate: string;
};

export const ImpactWidget: React.FC<{
  title: string;
  defaultSum: number;
  interventions: Intervention[];
  buttonText: string;
}> = ({ title, defaultSum, interventions, buttonText }) => {
  const [sum, setSum] = useState(defaultSum);
  const [selectedIntervention, setSelectedIntervention] = useState<string>(interventions[0].title);

  const currentIntervention = interventions.find(
    (i) => i.title === selectedIntervention,
  ) as Intervention;
  const output = currentIntervention.pricePerOutput
    ? Math.round(sum / currentIntervention.pricePerOutput)
    : 0;
  const loading = typeof currentIntervention.pricePerOutput === "undefined";
  let outputString;
  if (isNaN(output)) {
    outputString = "0";
  } else {
    outputString = output.toString();
  }

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
                type="number"
                value={sum}
                onChange={(e) => setSum(parseInt(e.target.value))}
                name="sum"
              />
            </div>
          </div>
          <div className={styles.select}>
            {interventions.map((i) => (
              <button
                key={i.title}
                onClick={() => setSelectedIntervention(i.title)}
                className={i.title === selectedIntervention ? styles.selected : ""}
              >
                {i.title}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.output}>
          <strong>=</strong>
          {loading && (
            <div className={styles.spinnerWrapper}>
              <Spinner />
            </div>
          )}
          {!loading && (
            <div className={styles.paragraphWrapper}>
              <span className={styles.paragraphNumber}>{outputString}</span>
              <p>
                <span className={styles.innerParagraphNumber}>{outputString}&nbsp;</span>
                {currentIntervention.outputStringTemplate}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
