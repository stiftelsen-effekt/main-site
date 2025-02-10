import React, { useContext, useEffect, useState } from "react";
import styles from "./TaxDeductionWidget.module.scss";
import { TaxDeductionBarChart } from "./TaxDeductionBarChart";
import {
  EffektButton,
  EffektButtonVariant,
} from "../../../shared/components/EffektButton/EffektButton";
import { EffektTextInput } from "../../../shared/components/EffektTextInput/EffektTextInput";
import { WidgetContext } from "../../layout/layout";
import { HorizontalTaxDeductionBarChart } from "./TaxDeductionBarChartHorizontal";
import { useIsMobile } from "../../../../hooks/useIsMobile";

export const TaxDeductionWidget: React.FC<{
  title: string;
  description: string;
  suggestedSums: number[];
  minimumTreshold: number;
  maximumTreshold: number;
  percentageReduction: number;
}> = ({
  title,
  description,
  suggestedSums,
  minimumTreshold,
  maximumTreshold,
  percentageReduction,
}) => {
  const [sum, setSum] = React.useState(suggestedSums.slice(-2)[0].toString());
  const [lastValidSum, setLastValidSum] = useState(suggestedSums.slice(-2)[0]);
  const [widgetContext, setWidgetContext] = useContext(WidgetContext);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (sum === "") {
      setLastValidSum(0);
      return;
    }

    const sumNumber = Number(sum.replace(/\D/g, ""));
    if (!isNaN(sumNumber)) {
      setLastValidSum(sumNumber);

      const formattedSum = Intl.NumberFormat("no-NB").format(sumNumber);
      if (formattedSum !== sum) {
        setSum(formattedSum);
      }
    }
  }, [sum]);

  const taxBenefit =
    lastValidSum >= minimumTreshold
      ? Math.min(lastValidSum, maximumTreshold) * percentageReduction
      : 0;

  const taxDeduction = Math.min(lastValidSum, maximumTreshold);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.desktopChart}>
          {!isMobile && (
            <TaxDeductionBarChart
              maximumThreshold={maximumTreshold}
              minimumThreshold={minimumTreshold}
              value={lastValidSum}
              taxBenefit={taxBenefit}
            ></TaxDeductionBarChart>
          )}
        </div>

        <div className={styles.description}>
          <h5>{title}</h5>
          <p>{description}</p>

          <div className={styles.mobileChart}>
            {isMobile && (
              <HorizontalTaxDeductionBarChart
                maximumThreshold={maximumTreshold}
                minimumThreshold={minimumTreshold}
                value={lastValidSum}
                taxBenefit={taxBenefit}
              ></HorizontalTaxDeductionBarChart>
            )}
          </div>

          <div className={styles.selectSum}>
            <div className={styles.suggestedSums}>
              {suggestedSums.map((suggestedSum) => {
                const formattedSuggestedSum = Intl.NumberFormat("no-NB").format(suggestedSum);
                return (
                  <EffektButton
                    key={suggestedSum}
                    onClick={() => setSum(formattedSuggestedSum)}
                    variant={EffektButtonVariant.SECONDARY}
                    selected={lastValidSum === suggestedSum}
                    style={{ fontSize: "0.9rem" }}
                    squared
                  >
                    {formattedSuggestedSum} kr
                  </EffektButton>
                );
              })}
            </div>
            <div className={styles.input}>
              <label htmlFor="">Donasjoner:</label>
              <EffektTextInput
                value={sum.toString()}
                name={"taxDeductionSumInput"}
                type={"tel"}
                placeholder="0"
                onChange={(val) => {
                  setSum(val);
                }}
                denomination={"kr"}
                variant="underlined"
              />
            </div>
          </div>

          <p>
            Med {Intl.NumberFormat("no-NB").format(taxDeduction)} kr i skattefradrag i år får du
            tilbake {Intl.NumberFormat("no-NB").format(taxBenefit)} kroner på skatten.
          </p>

          <div className={styles.cta}>
            <EffektButton
              onClick={() => {
                setWidgetContext({
                  ...widgetContext,
                  open: true,
                  prefilledSum: lastValidSum,
                });
              }}
              variant={EffektButtonVariant.PRIMARY}
              style={{
                padding: "0.75rem 3rem",
              }}
            >
              Få skattefradrag
            </EffektButton>
          </div>
        </div>
      </div>
    </div>
  );
};
