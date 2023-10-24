import React, { useState } from "react";
import styles from "./InterventionWidget.module.scss";
import { InterventionWidgetOutput, SanityIntervention } from "./InterventionWidgetOutput";
import { LinkType } from "../Links/Links";
import { NavLink } from "../../layout/navbar";

export interface InterventionWidgetProps {
  default_sum: number;
  title: string;
  interventions?: SanityIntervention[];
  explanationLabel?: string;
  explanationText?: string;
  explanationLinks?: (LinkType | NavLink)[];
  currency: string;
  locale: string;
}

export const InterventionWidget: React.FC<InterventionWidgetProps> = ({
  default_sum,
  title,
  interventions,
  explanationLabel,
  explanationText,
  explanationLinks,
  currency,
  locale,
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
          <InterventionWidgetOutput
            sum={sum}
            interventions={interventions}
            explanationLabel={explanationLabel}
            explanationText={explanationText}
            explanationLinks={explanationLinks}
            currency={currency}
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
};
