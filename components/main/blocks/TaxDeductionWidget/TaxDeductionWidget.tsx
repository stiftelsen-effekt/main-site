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
import { usePlausible } from "next-plausible";
import { thousandize } from "../../../../util/formatting";

export const TaxDeductionWidget: React.FC<{
  title: string;
  description: string;
  suggestedSums: number[];
  minimumTreshold: number;
  maximumTreshold: number;
  percentageReduction: number;
  donationsLabel?: string;
  taxDeductionReturnDescriptionTemplate?: string;
  belowMinimumTresholdDescriptionTemplate?: string;
  buttonText?: string;
  chartLabels?: {
    maximumThresholdLabel?: string;
    minimumThresholdLabel?: string;
    currentValueLabel?: string;
    taxBenefitLabel?: string;
  };
  locale: string;
}> = ({
  title,
  description,
  suggestedSums,
  minimumTreshold,
  maximumTreshold,
  percentageReduction,
  donationsLabel,
  taxDeductionReturnDescriptionTemplate,
  belowMinimumTresholdDescriptionTemplate,
  buttonText,
  chartLabels,
  locale,
}) => {
  const plausible = usePlausible();
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

      const formattedSum = thousandize(sumNumber, locale);
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
              labels={chartLabels}
              locale={locale}
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
                const formattedSuggestedSum = thousandize(suggestedSum, locale);
                return (
                  <EffektButton
                    key={suggestedSum}
                    onClick={() => {
                      plausible("TaxWidgetSelectSuggestedSum", {
                        props: {
                          page: window.location.pathname,
                          sum: suggestedSum,
                        },
                      });
                      setSum(formattedSuggestedSum);
                    }}
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
              <label htmlFor="">{donationsLabel ?? "Donasjoner"}:</label>
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

          {taxBenefit > 0 && (
            <p>
              {taxDeductionReturnDescriptionTemplate
                ? taxDeductionReturnDescriptionTemplate
                    .replace("{taxDeduction}", thousandize(taxDeduction, locale))
                    .replace("{taxBenefit}", thousandize(taxBenefit, locale))
                : `Med ${Intl.NumberFormat("no-NB").format(
                    taxDeduction,
                  )} kr i skattefradrag i år får du tilbake ${Intl.NumberFormat("no-NB").format(
                    taxBenefit,
                  )} kroner på skatten.`}
            </p>
          )}
          {taxBenefit === 0 && (
            <p>
              {belowMinimumTresholdDescriptionTemplate
                ? belowMinimumTresholdDescriptionTemplate
                    .replace("{lastValidSum}", thousandize(lastValidSum, locale))
                    .replace("{minimumTreshold}", thousandize(minimumTreshold, locale))
                : `Med ${Intl.NumberFormat("no-NB").format(
                    lastValidSum,
                  )} kr i donasjoner er du under minstegrensen på ${Intl.NumberFormat(
                    "no-NB",
                  ).format(minimumTreshold)} kr for å få skattefradrag.`}
            </p>
          )}

          <div className={styles.cta}>
            <EffektButton
              onClick={() => {
                plausible("OpenDonationWidget", {
                  props: {
                    page: window.location.pathname,
                  },
                });
                plausible("OpenDonationWidgetTaxWidgetCTA", {
                  props: {
                    page: window.location.pathname,
                    sum: lastValidSum,
                  },
                });
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
              {buttonText ?? "Få skattefradrag"}
            </EffektButton>
          </div>
        </div>
      </div>
    </div>
  );
};
