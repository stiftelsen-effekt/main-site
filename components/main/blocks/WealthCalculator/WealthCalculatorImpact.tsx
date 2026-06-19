import { useContext, useMemo } from "react";
import { thousandize } from "../../../../util/formatting";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import {
  InterventionWidgetOutput,
  InterventionWidgetOutputConfiguration,
} from "../InterventionWidget/InterventionWidgetOutput";
import { WidgetContext } from "../../layout/layout";
import styles from "./WealthCalculator.module.scss";
import { usePlausible } from "next-plausible";
import { Wealthcalculatorimpact } from "../../../../studio/sanity.types";

export type WealthCalculatorImpactConfig = Wealthcalculatorimpact & {
  intervention_configuration: {
    output_configuration: InterventionWidgetOutputConfiguration;
    currency: string;
    locale: string;
  };
};

export const WealthCalculatorImpact: React.FC<{
  donationPercentage: number;
  setDonationPercentage: (value: number) => void;
  postTaxIncome: number;
  config: WealthCalculatorImpactConfig;
}> = ({ donationPercentage, setDonationPercentage, postTaxIncome, config }) => {
  const [widgetContext, setWidgetContext] = useContext(WidgetContext);
  const plausible = usePlausible();

  const donationAmount = useMemo(() => {
    return Math.round(postTaxIncome * (donationPercentage / 100));
  }, [postTaxIncome, donationPercentage]);

  return (
    <div className={styles.calculator__impact}>
      <div className={styles.calculator__impact__description}>
        <h3>{config.header || "Din impact."}</h3>
        <p>
          {config.description_template_string?.replace("{donation}", thousandize(donationAmount)) ||
            "Missing description template."}
        </p>
        <div
          className={styles.calculator__impact__description__button_desktop}
          data-cy="wealthcalculator-impact-create-agreement-button"
        >
          <EffektButton
            onClick={() => {
              plausible("OpenDonationWidget", {
                props: {
                  page: window.location.pathname,
                },
              });
              plausible("OpenDonationWidgetWealthCalculatorImpactCTA", {
                props: {
                  page: window.location.pathname,
                },
              });
              setWidgetContext({
                open: true,
                prefilled: null,
                prefilledSum: Math.round(donationAmount / 12 / 100) * 100, // Round to nearest 100
              });
            }}
          >
            {config.button_text || "Sett opp fast donasjon"}
          </EffektButton>
        </div>
      </div>
      <div className={styles.calculator__impact__output}>
        <InterventionWidgetOutput
          sum={donationAmount}
          configuration={config.intervention_configuration.output_configuration}
          currency={config.intervention_configuration.currency}
          locale={config.intervention_configuration.locale}
        />
      </div>
      <div className={styles.calculator__impact__description__button_mobile}>
        <EffektButton
          onClick={() =>
            setWidgetContext({
              open: true,
              prefilled: null,
              prefilledSum: Math.round(donationAmount / 12 / 100) * 100, // Round to nearest 100
            })
          }
        >
          {config.button_text || "Sett opp fast donasjon"}
        </EffektButton>
      </div>
    </div>
  );
};
