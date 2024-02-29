import { useCallback, useEffect, useRef, useState } from "react";
import AnimateHeight from "react-animate-height";
import { useDebouncedCallback } from "use-debounce";
import { AreaChart } from "../../../shared/components/Graphs/Area/AreaGraph";
import { BlockContentRenderer } from "../BlockContentRenderer";
import {
  InterventionWidgetOutputConfiguration,
  SanityIntervention,
} from "../InterventionWidget/InterventionWidgetOutput";
import { wealthMountainGraphData } from "./data";
import styles from "./WealthCalculator.module.scss";
import { LinkType } from "../Links/Links";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
import { WealthCalculatorInput, WealthCalculatorInputConfiguration } from "./WealthCalculatorInput";
import {
  TaxJurisdiction,
  calculateWealthPercentile,
  equvivalizeIncome,
  getEstimatedPostTaxIncome,
} from "./_util";
import { WealthCalculatorSlider, WealthCalculatorSliderConfig } from "./WealthCalculatorSlider";
import { WealthCalculatorImpact } from "./WealthCalculatorImpact";
import {
  AdjustedPPPFactorResult,
  getNorwegianAdjustedPPPconversionFactor,
  getSwedishAdjustedPPPconversionFactor,
} from "./_queries";

export type WealthCalculatorConfiguration = {
  calculator_input_configuration: WealthCalculatorInputConfiguration;
  slider_configuration: WealthCalculatorSliderConfig;
  income_percentile_label_template_string: string;
  income_percentile_after_donation_label_template_string: string;
  default_donation_percentage?: number;
  data_explanation_label?: string;
  data_explanation?: any;
  x_axis_label?: string;
};

type WealthCalculatorProps = {
  title: string;
  configuration: WealthCalculatorConfiguration;
  intervention_configuration: {
    output_configuration: InterventionWidgetOutputConfiguration;
    currency: string;
    locale: string;
  };
  currency: string;
  locale: string;
};

export const WealthCalculator: React.FC<WealthCalculatorProps> = ({
  title,
  configuration,
  intervention_configuration,
  currency,
  locale,
}) => {
  const {
    calculator_input_configuration,
    slider_configuration,
    income_percentile_label_template_string,
    income_percentile_after_donation_label_template_string,
    default_donation_percentage,
    data_explanation_label,
    data_explanation,
    x_axis_label,
  } = configuration;

  const [incomeInput, setIncomeInput] = useState<number | undefined>();
  const income = incomeInput || 0;
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [numberOfAdults, setNumberOfParents] = useState(1);
  const [donationPercentage, setDonationPercentage] = useState(default_donation_percentage || 10);
  const [loadingPostTaxIncome, setLoadingPostTaxIncome] = useState(false);
  const [postTaxIncome, setPostTaxIncome] = useState<number>(0);
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [pppConversion, setPppConversion] = useState<AdjustedPPPFactorResult | undefined>();

  /**
   * Get the adjusted PPP conversion factor for the locale.
   */
  useEffect(() => {
    if (locale === "no") {
      getNorwegianAdjustedPPPconversionFactor().then((res) => {
        setPppConversion(res);
      });
    } else if (locale === "sv") {
      getSwedishAdjustedPPPconversionFactor().then((res) => {
        setPppConversion(res);
      });
    } else {
      console.error("Unsupported locale", locale);
    }
  }, [setPppConversion]);

  /**
   * Calculate the post tax income. We use a debounced callback to avoid calculating the post tax income
   * too many times when the user is typing.
   */
  const calculatePostTaxIncome = useDebouncedCallback(() => {
    let taxJurisdiction: TaxJurisdiction;
    if (locale === "no") {
      taxJurisdiction = TaxJurisdiction.NO;
    } else if (locale === "sv") {
      taxJurisdiction = TaxJurisdiction.SE;
    } else {
      console.error("Unsupported locale", locale);
      return;
    }
    getEstimatedPostTaxIncome(income / numberOfAdults, taxJurisdiction).then((res) => {
      setPostTaxIncome(res * numberOfAdults);
      setLoadingPostTaxIncome(false);
    });
  }, 250);

  useEffect(() => {
    setLoadingPostTaxIncome(true);
    calculatePostTaxIncome();
  }, [incomeInput, numberOfAdults]);

  /**
   * Calculate the equvivalized income. This is the income after tax and adjusted for the number of adults and children
   * in the household. We use the OECD modified scale to calculate the equvivalized income.
   */
  const equvivalizedIncome = equvivalizeIncome(postTaxIncome, numberOfChildren, numberOfAdults);

  if (!pppConversion) {
    return <></>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.calculator} data-cy="wealthcalculator-container">
        <WealthCalculatorInput
          title={title}
          incomeInput={incomeInput}
          setIncomeInput={setIncomeInput}
          numberOfChildren={numberOfChildren}
          setNumberOfChildren={setNumberOfChildren}
          numberOfAdults={numberOfAdults}
          setNumberOfParents={setNumberOfParents}
          loadingPostTaxIncome={loadingPostTaxIncome}
          config={calculator_input_configuration}
        ></WealthCalculatorInput>
        <WealthCalculatorSlider
          donationPercentage={donationPercentage}
          setDonationPercentage={setDonationPercentage}
          postTaxIncome={postTaxIncome}
          wealthMountainGraphData={wealthMountainGraphData}
          equvivalizedIncome={equvivalizedIncome}
          adjustedPppFactor={pppConversion.adjustedPPPfactor}
          config={slider_configuration}
        />

        <div className={styles.calculator__output} data-cy="wealthcalculator-graph">
          <AreaChart
            data={wealthMountainGraphData}
            lineInput={equvivalizedIncome || 0}
            donationPercentage={donationPercentage / 100}
            wealthPercentile={calculateWealthPercentile(
              wealthMountainGraphData,
              equvivalizedIncome || 0,
              pppConversion?.adjustedPPPfactor,
            )}
            afterDonationWealthPercentile={calculateWealthPercentile(
              wealthMountainGraphData,
              equvivalizedIncome * (1 - donationPercentage / 100),
              pppConversion?.adjustedPPPfactor,
            )}
            afterDonationPercentileLabelTemplateString={
              income_percentile_after_donation_label_template_string
            }
            incomePercentileLabelTemplateString={income_percentile_label_template_string}
            adjustedPPPConversionFactor={pppConversion?.adjustedPPPfactor}
          />
        </div>
        <div
          className={
            styles.calculator__explanation__toggle +
            " " +
            (explanationOpen ? styles.calculator__explanation__toggle_open : "")
          }
          data-cy="wealthcalculator-explanation-toggle"
          onClick={() => setExplanationOpen(!explanationOpen)}
        >
          {data_explanation_label || "Explanation"}
        </div>
        <div className={styles.calculator__axis__label}>
          <span>{x_axis_label || "Yearly income (log scale)"} →</span>
        </div>
      </div>
      <AnimateHeight height={explanationOpen ? "auto" : 0} duration={500}>
        {/** Debug factors */}
        {/** 
        <div>
          <strong>Factors used in the calculation:</strong>
          <table>
            <tr>
              <td>
                <strong>
                  Cumulative inflation 2017 - {DateTime.now().year} for {locale}
                </strong>
              </td>
              <td>{pppConversion.cumulativeInflation.toFixed(2)}</td>
            </tr>
            <tr>
              <td>
                <strong>
                  PPP conversion factor for 2017 {currency} to 2017 international dollar
                </strong>
              </td>
              <td>{pppConversion.pppFactor.toFixed(2)}</td>
            </tr>
            <tr>
              <td>
                <strong>Total adjusted ppp conversion factor</strong>
              </td>
              <td>{pppConversion.adjustedPPPfactor.toFixed(2)}</td>
            </tr>
            <tr>
              <td>
                <strong>Estimated taxation</strong>
              </td>
              <td>{thousandize(income - postTaxIncome)}</td>
            </tr>
          </table>
        </div>
        */}
        <div data-cy="wealthcalculator-explanation">
          <BlockContentRenderer content={[data_explanation]} />
        </div>
      </AnimateHeight>
      {intervention_configuration && (
        <WealthCalculatorImpact
          donationPercentage={donationPercentage}
          setDonationPercentage={setDonationPercentage}
          postTaxIncome={postTaxIncome}
          intervention_configuration={intervention_configuration}
        />
      )}
    </div>
  );
};
