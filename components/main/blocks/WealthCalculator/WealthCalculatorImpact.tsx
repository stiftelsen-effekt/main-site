import { useContext } from "react";
import { thousandize } from "../../../../util/formatting";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import {
  InterventionWidgetOutput,
  InterventionWidgetOutputConfiguration,
} from "../InterventionWidget/InterventionWidgetOutput";
import { WidgetContext } from "../../layout/layout";

import styles from "./WealthCalculator.module.scss";

export const WealthCalculatorImpact: React.FC<{
  donationPercentage: number;
  setDonationPercentage: (value: number) => void;
  postTaxIncome: number;
  intervention_configuration: {
    output_configuration: InterventionWidgetOutputConfiguration;
    currency: string;
    locale: string;
  };
}> = ({ donationPercentage, setDonationPercentage, postTaxIncome, intervention_configuration }) => {
  const [widgetContext, setWidgetContext] = useContext(WidgetContext);

  return (
    <div className={styles.calculator__impact}>
      <div className={styles.calculator__impact__description}>
        <h3>Din impact.</h3>
        <p>
          Med {thousandize(Math.round(postTaxIncome * (donationPercentage / 100)))} kroner i året
          donert til effektiv bistand kan du påvirke mange liv der det trengs mest du kan for
          eksempel bidra med myggnett, A-vitamin tilskudd eller vaksinering.
        </p>
        <div
          className={styles.calculator__impact__description__button_desktop}
          data-cy="wealthcalculator-impact-create-agreement-button"
        >
          <EffektButton
            onClick={() => setWidgetContext({ open: true, prefilled: null, prefilledSum: null })}
          >
            Sett opp fast donasjon
          </EffektButton>
        </div>
      </div>
      <div className={styles.calculator__impact__output}>
        <InterventionWidgetOutput
          sum={postTaxIncome * (donationPercentage / 100)}
          configuration={intervention_configuration.output_configuration}
          currency={intervention_configuration.currency}
          locale={intervention_configuration.locale}
        />
      </div>
      <div className={styles.calculator__impact__description__button_mobile}>
        <EffektButton
          onClick={() => setWidgetContext({ open: true, prefilled: null, prefilledSum: null })}
        >
          Sett opp fast donasjon
        </EffektButton>
      </div>
    </div>
  );
};
