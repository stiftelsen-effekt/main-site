import React, { useState } from "react";
import styles from "./InterventionWidget.module.scss";
import {
  InterventionWidgetOutput,
  InterventionWidgetOutputConfiguration,
} from "./InterventionWidgetOutput";
import { PortableText } from "next-sanity";
import { customComponentRenderers } from "../Paragraph/Citation";

export interface InterventionWidgetProps {
  default_sum: number;
  title: string;
  description: any[];
  donationLabel?: string;
  outputConfiguration?: InterventionWidgetOutputConfiguration;
  /* From site settings */
  currency: string;
  locale: string;
}

export const InterventionWidget: React.FC<InterventionWidgetProps> = ({
  default_sum,
  title,
  description,
  donationLabel,
  outputConfiguration,
  currency,
  locale,
}) => {
  const [sum, setSum] = useState(default_sum);

  if (!outputConfiguration) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3>{title}</h3>
        {description && (
          <PortableText value={description} components={customComponentRenderers}></PortableText>
        )}
      </div>
      <div className={styles.grid}>
        <div className={styles.input}>
          <div className={styles.input}>
            <label>
              {donationLabel ?? "Donasjon"}:
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
            </label>
          </div>
        </div>
        <div className={styles.output}>
          <InterventionWidgetOutput
            sum={sum}
            configuration={outputConfiguration}
            currency={currency}
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
};
