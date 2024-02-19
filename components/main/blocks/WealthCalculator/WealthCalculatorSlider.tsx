import { after, before } from "mocha";
import { thousandize } from "../../../../util/formatting";
import { EffektSlider } from "../../../shared/components/EffektSlider/EffektSlider";
import { calculateWealthPercentile } from "./_util";
import styles from "./WealthCalculator.module.scss";

export type WealthCalculatorSliderConfig = {
  donation_percentage_input_configuration: {
    template_string: string;
  };
};

export const WealthCalculatorSlider: React.FC<{
  donationPercentage: number;
  setDonationPercentage: (value: number) => void;
  postTaxIncome: number;
  wealthMountainGraphData: {
    x: number;
    y: number;
  }[];
  equvivalizedIncome: number;
  adjustedPppFactor: number;
  config: WealthCalculatorSliderConfig;
}> = ({
  donationPercentage,
  setDonationPercentage,
  postTaxIncome,
  wealthMountainGraphData,
  equvivalizedIncome,
  adjustedPppFactor,
  config,
}) => {
  const [beforeInput, afterInput] =
    config.donation_percentage_input_configuration.template_string.split(
      "{donationPercentageInput}",
    );
  const [beforeDonationAmount, afterDonationAmount] = afterInput.split("{donationAmount}");
  const [beforeWealthPercentile, afterWealthPercentile] =
    afterDonationAmount.split("{wealthPercentile}");

  const donationAmount = Math.round(postTaxIncome * (donationPercentage / 100));
  const wealthPercentile = calculateWealthPercentile(
    wealthMountainGraphData,
    equvivalizedIncome * (1 - donationPercentage / 100),
    adjustedPppFactor,
  ).toLocaleString("no-NB");

  return (
    <div className={[styles.calculator__input, styles.calculator__input_slider].join(" ")}>
      <div className={styles.calculator__input__inner}>
        <div className={styles.calculator__input__group}>
          <div className={styles.calculator__input__group__percentage_text}>
            <span>{beforeInput}</span>
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
              {beforeDonationAmount}
              {thousandize(donationAmount)}
              {beforeWealthPercentile}
              {wealthPercentile}
              {afterWealthPercentile}
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
