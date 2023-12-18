import { useEffect, useRef, useState } from "react";
import AnimateHeight from "react-animate-height";
import { useDebouncedCallback } from "use-debounce";
import { AreaChart } from "../../../shared/components/Graphs/Area/AreaGraph";
import { BlockContentRenderer } from "../BlockContentRenderer";
import { SanityIntervention } from "../InterventionWidget/InterventionWidgetOutput";
import { wealthMountainGraphData } from "./data";
import styles from "./WealthCalculator.module.scss";
import { LinkType } from "../Links/Links";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
import { WealthCalculatorInput } from "./WealthCalculatorInput";
import {
  TaxJurisdiction,
  calculateWealthPercentile,
  equvivalizeIncome,
  getEstimatedPostTaxIncome,
} from "./_util";
import { WealthCalculatorSlider } from "./WealthCalculatorSlider";
import { WealthCalculatorImpact } from "./WealthCalculatorImpact";
import {
  AdjustedPPPFactorResult,
  getNorwegianAdjustedPPPconversionFactor,
  getSwedishAdjustedPPPconversionFactor,
} from "./_queries";
import { DateTime } from "luxon";

type WealthCalculatorProps = {
  title: string;
  showImpact: boolean;
  intervention_configuration: {
    interventions?: SanityIntervention[];
    explanation_label?: string;
    explanation_text?: string;
    explanation_links?: (LinkType | NavLink)[];
    currency: string;
    locale: string;
  };
  calculator_input_configuration: {
    subtitle_label?: string;
    income_input_configuration: {
      placeholder?: string;
      thousand_separator?: string;
      currency_label?: string;
    };
    children_input_configuration: {
      placeholder?: string;
      options?: string[];
    };
    adults_input_configuration: {
      placeholder?: string;
      options?: string[];
    };
    donation_percentage_input_configuration: {
      template_string?: string;
    };
  };
  incomePercentileLabelTemplateString: string;
  afterDonationPercentileLabelTemplateString: string;
  defaultDonationPercentage?: number;
  explenationLabel?: string;
  explanation?: any;
  xAxixLabel?: string;
  currency: string;
  locale: string;
};

export const WealthCalculator: React.FC<WealthCalculatorProps> = ({
  title,
  showImpact,
  intervention_configuration,
  explanation,
  incomePercentileLabelTemplateString,
  afterDonationPercentileLabelTemplateString,
  defaultDonationPercentage = 10,
  calculator_input_configuration,
  xAxixLabel,
  explenationLabel,
  currency,
  locale,
}) => {
  const [incomeInput, setIncomeInput] = useState<number | undefined>();
  const income = incomeInput || 0;
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [numberOfAdults, setNumberOfParents] = useState(1);
  const [donationPercentage, setDonationPercentage] = useState(defaultDonationPercentage);
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
    } else if (locale === "se") {
      getSwedishAdjustedPPPconversionFactor().then((res) => {
        setPppConversion(res);
      });
    } else {
      console.error("Unsupported locale", locale);
    }
  }, [setPppConversion]);

  /**
   * When resizing the window, we need to update the chart size.
   * This is because observable plot does not support responsive charts.
   * We need to set the width and height of the chart to the width and height of the container.
   */
  const [chartSize, setChartSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });
  const outputRef = useRef<HTMLDivElement>(null);
  const updateSizing = () => {
    if (outputRef.current) {
      if (window && window.innerWidth > 1180) {
        setChartSize({
          width: outputRef.current.offsetWidth,
          height: 0,
        });
        setTimeout(() => {
          if (outputRef.current) {
            setChartSize({
              width: outputRef.current.offsetWidth,
              height: Math.floor(outputRef.current.offsetHeight) - 1,
            });
          } else {
            setChartSize({
              width: chartSize.width || 640,
              height: chartSize.width || 640,
            });
          }
        }, 1);
      } else {
        setChartSize({
          width: outputRef.current.offsetWidth,
          height: Math.floor(outputRef.current.offsetWidth) - 1,
        });
      }
    }
  };
  useEffect(() => {
    debouncedSizingUpdate();
  }, [outputRef]);
  const debouncedSizingUpdate = useDebouncedCallback(() => updateSizing(), 100, {
    maxWait: 100,
    trailing: true,
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", debouncedSizingUpdate);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", debouncedSizingUpdate);
      }
    };
  }, []);

  /**
   * Calculate the post tax income. We use a debounced callback to avoid calculating the post tax income
   * too many times when the user is typing.
   */
  const calculatePostTaxIncome = useDebouncedCallback(() => {
    let taxJurisdiction: TaxJurisdiction;
    if (locale === "no") {
      taxJurisdiction = TaxJurisdiction.NO;
    } else if (locale === "se") {
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
          outputRef={outputRef}
        ></WealthCalculatorInput>
        <WealthCalculatorSlider
          donationPercentage={donationPercentage}
          setDonationPercentage={setDonationPercentage}
          postTaxIncome={postTaxIncome}
          wealthMountainGraphData={wealthMountainGraphData}
          equvivalizedIncome={equvivalizedIncome}
        />

        <div className={styles.calculator__output} ref={outputRef} data-cy="wealthcalculator-graph">
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
            size={chartSize}
            afterDonationPercentileLabelTemplateString={afterDonationPercentileLabelTemplateString}
            incomePercentileLabelTemplateString={incomePercentileLabelTemplateString}
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
          {explenationLabel}
        </div>
        <div className={styles.calculator__axis__label}>
          <span>{xAxixLabel} →</span>
        </div>
      </div>
      <AnimateHeight height={explanationOpen ? "auto" : 0} duration={500}>
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
          </table>
        </div>
        <div data-cy="wealthcalculator-explanation">
          <BlockContentRenderer content={[explanation]} />
        </div>
      </AnimateHeight>
      {showImpact && intervention_configuration && (
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
