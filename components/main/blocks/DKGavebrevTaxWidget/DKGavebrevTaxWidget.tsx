import React, { useContext, useEffect, useState } from "react";
import styles from "./DKGavebrevTaxWidget.module.scss";
import { DKGavebrevTaxBarChart } from "./DKGavebrevTaxBarChart";
import {
  EffektButton,
  EffektButtonVariant,
} from "../../../shared/components/EffektButton/EffektButton";
import { EffektTextInput } from "../../../shared/components/EffektTextInput/EffektTextInput";
import { WidgetContext } from "../../layout/layout";
import { HorizontalDKGavebrevTaxBarChart } from "./DKGavebrevTaxBarChartHorizontal";
import { useIsMobile } from "../../../../hooks/useIsMobile";
import { usePlausible } from "next-plausible";
import { thousandize } from "../../../../util/formatting";

export const DKGavebrevTaxWidget: React.FC<{
  title: string;
  description: string;
  incomeLabel?: string;
  donationLabel?: string;
  defaultIncome: number;
  defaultDonation: number;
  resultDescriptionTemplate?: string;
  buttonText?: string;
  chartLabels?: {
    maximumDeduction?: string;
    yourDonation?: string;
    yourTaxBenefit?: string;
  };
  locale: string;
}> = ({
  title,
  description,
  incomeLabel,
  donationLabel,
  defaultIncome,
  defaultDonation,
  resultDescriptionTemplate,
  buttonText,
  chartLabels,
  locale,
}) => {
  const plausible = usePlausible();
  const [income, setIncome] = useState(defaultIncome.toString());
  const [donation, setDonation] = useState(defaultDonation.toString());
  const [lastValidIncome, setLastValidIncome] = useState(defaultIncome);
  const [lastValidDonation, setLastValidDonation] = useState(defaultDonation);
  const [widgetContext, setWidgetContext] = useContext(WidgetContext);
  const isMobile = useIsMobile();

  // Handle income input changes with formatting
  useEffect(() => {
    if (income === "") {
      setLastValidIncome(0);
      return;
    }

    const incomeNumber = Number(income.replace(/\D/g, ""));
    if (!isNaN(incomeNumber)) {
      setLastValidIncome(incomeNumber);

      const formattedIncome = thousandize(incomeNumber, locale);
      if (formattedIncome !== income) {
        setIncome(formattedIncome);
      }
    }
  }, [income, locale]);

  // Handle donation input changes with formatting
  useEffect(() => {
    if (donation === "") {
      setLastValidDonation(0);
      return;
    }

    const donationNumber = Number(donation.replace(/\D/g, ""));
    if (!isNaN(donationNumber)) {
      setLastValidDonation(donationNumber);

      const formattedDonation = thousandize(donationNumber, locale);
      if (formattedDonation !== donation) {
        setDonation(formattedDonation);
      }
    }
  }, [donation, locale]);

  // Hardcoded calculations per task requirements
  // Maximum deduction: income * 0.92 * 0.15
  const maximumDeduction = lastValidIncome * 0.92 * 0.15;

  // Tax benefit: donation * 0.26 (capped at maximum deduction)
  const effectiveDonation = Math.min(lastValidDonation, maximumDeduction);
  const taxBenefit = effectiveDonation * 0.26;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.desktopChart}>
          {!isMobile && (
            <DKGavebrevTaxBarChart
              maximumDeduction={maximumDeduction}
              donation={lastValidDonation}
              taxBenefit={taxBenefit}
              labels={chartLabels}
              locale={locale}
            />
          )}
        </div>

        <div className={styles.description}>
          <h5>{title}</h5>
          <p>{description}</p>

          <div className={styles.mobileChart}>
            {isMobile && (
              <HorizontalDKGavebrevTaxBarChart
                maximumDeduction={maximumDeduction}
                donation={lastValidDonation}
                taxBenefit={taxBenefit}
                labels={chartLabels}
                locale={locale}
              />
            )}
          </div>

          <div className={styles.inputs}>
            <div className={styles.input}>
              <label htmlFor="income-input">{incomeLabel ?? "Indkomst før skat"}:</label>
              <EffektTextInput
                value={income}
                name={"income-input"}
                type={"tel"}
                placeholder="0"
                onChange={(val) => {
                  setIncome(val);
                }}
                denomination={"kr"}
                variant="underlined"
              />
            </div>

            <div className={styles.input}>
              <label htmlFor="donation-input">{donationLabel ?? "Donation"}:</label>
              <EffektTextInput
                value={donation}
                name={"donation-input"}
                type={"tel"}
                placeholder="0"
                onChange={(val) => {
                  setDonation(val);
                }}
                denomination={"kr"}
                variant="underlined"
              />
            </div>
          </div>

          {resultDescriptionTemplate && maximumDeduction > 0 && (
            <p>
              {resultDescriptionTemplate
                .replace("{income}", thousandize(lastValidIncome, locale))
                .replace("{maxDeduction}", thousandize(maximumDeduction, locale))
                .replace("{donation}", thousandize(lastValidDonation, locale))
                .replace("{taxBenefit}", thousandize(taxBenefit, locale))}
            </p>
          )}

          {buttonText && (
            <div className={styles.cta}>
              <EffektButton
                onClick={() => {
                  plausible("OpenDonationWidget", {
                    props: {
                      page: window.location.pathname,
                    },
                  });
                  plausible("OpenDonationWidgetGavebrevTaxWidgetCTA", {
                    props: {
                      page: window.location.pathname,
                      donation: lastValidDonation,
                    },
                  });
                  setWidgetContext({
                    ...widgetContext,
                    open: true,
                    prefilledSum: lastValidDonation,
                  });
                }}
                variant={EffektButtonVariant.PRIMARY}
                style={{
                  padding: "0.75rem 3rem",
                }}
              >
                {buttonText}
              </EffektButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
