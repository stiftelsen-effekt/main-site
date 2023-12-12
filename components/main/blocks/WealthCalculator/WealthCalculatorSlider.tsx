import { thousandize } from "../../../../util/formatting";
import { EffektSlider } from "../../../shared/components/EffektSlider/EffektSlider";
import { calculateWealthPercentile } from "./_util";
import styles from "./WealthCalculator.module.scss";

export const WealthCalculatorSlider: React.FC<{
  donationPercentage: number;
  setDonationPercentage: (value: number) => void;
  postTaxIncome: number;
  wealthMountainGraphData: {
    x: number;
    y: number;
  }[];
  equvivalizedIncome: number;
}> = ({
  donationPercentage,
  setDonationPercentage,
  postTaxIncome,
  wealthMountainGraphData,
  equvivalizedIncome,
}) => {
  return (
    <div className={[styles.calculator__input, styles.calculator__input_slider].join(" ")}>
      <div className={styles.calculator__input__inner}>
        <div className={styles.calculator__input__group}>
          <div className={styles.calculator__input__group__percentage_text}>
            <span>Om du ga bort </span>
            <div className={styles.calculator__input__group__percentage_input_wrapper}>
              <input
                type={"text"}
                className={styles.calculator__input__group__percentage_input}
                value={donationPercentage.toString()}
                data-cy="wealthcalculator-donation-percentage-input"
                onChange={(e) => {
                  if (e.target.value !== "" || !isNaN(parseInt(e.target.value))) {
                    setDonationPercentage(parseInt(e.target.value));
                  } else if (e.target.value === "") {
                    setDonationPercentage(0);
                  }
                }}
              />
              <span>%</span>
            </div>
            <span>
              av din inntekt etter estimert skatt kan du donere{" "}
              {thousandize(Math.round(postTaxIncome * (donationPercentage / 100)))} kr til effektiv
              bistand i året og fortsatt være blant de{" "}
              {calculateWealthPercentile(
                wealthMountainGraphData,
                equvivalizedIncome * (1 - donationPercentage / 100),
              ).toLocaleString("no-NB")}
              % rikeste i verden.
            </span>
          </div>

          <EffektSlider
            min={0}
            max={50}
            value={donationPercentage}
            onChange={setDonationPercentage}
          />
        </div>
      </div>
    </div>
  );
};
