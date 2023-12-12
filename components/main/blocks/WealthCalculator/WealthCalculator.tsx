import { useContext, useEffect, useRef, useState } from "react";
import AnimateHeight from "react-animate-height";
import { useDebouncedCallback } from "use-debounce";
import { thousandize } from "../../../../util/formatting";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import { AreaChart } from "../../../shared/components/Graphs/Area/AreaGraph";
import { WidgetContext } from "../../layout/layout";
import { BlockContentRenderer } from "../BlockContentRenderer";
import {
  InterventionWidgetOutput,
  SanityIntervention,
} from "../InterventionWidget/InterventionWidgetOutput";
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

export const WealthCalculator: React.FC<{
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
      locale?: string;
    };
  };
  incomePercentileLabelTemplateString: string;
  afterDonationPercentileLabelTemplateString: string;
  defaultDonationPercentage?: number;
  explenationLabel?: string;
  explanation?: any;
  xAxixLabel?: string;
}> = ({
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
}) => {
  const [incomeInput, setIncomeInput] = useState<number | undefined>();
  const income = incomeInput || 0;
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [numberOfAdults, setNumberOfParents] = useState(1);
  const [donationPercentage, setDonationPercentage] = useState(defaultDonationPercentage);
  const [loadingPostTaxIncome, setLoadingPostTaxIncome] = useState(false);
  const [postTaxIncome, setPostTaxIncome] = useState<number>(0);

  const [explanationOpen, setExplanationOpen] = useState(false);
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
  }, []);

  useEffect(() => {
    if (incomeInput) {
      setLoadingPostTaxIncome(true);
      getEstimatedPostTaxIncome(incomeInput, TaxJurisdiction.SE).then((res) => {
        setPostTaxIncome(res);
        setLoadingPostTaxIncome(false);
      });
    }
  }, [incomeInput, numberOfChildren, numberOfAdults]);

  const equvivalizedIncome = equvivalizeIncome(postTaxIncome, numberOfChildren, numberOfAdults);

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
            )}
            afterDonationWealthPercentile={calculateWealthPercentile(
              wealthMountainGraphData,
              equvivalizedIncome * (1 - donationPercentage / 100),
            )}
            size={chartSize}
            afterDonationPercentileLabelTemplateString={afterDonationPercentileLabelTemplateString}
            incomePercentileLabelTemplateString={incomePercentileLabelTemplateString}
            exchangeRate={10.5}
          />
        </div>
        {explanation ? (
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
        ) : (
          <></>
        )}
        <div className={styles.calculator__axis__label}>
          <span>{xAxixLabel} →</span>
        </div>
      </div>
      {explanation && (
        <>
          <AnimateHeight height={explanationOpen ? "auto" : 0} duration={500}>
            <div data-cy="wealthcalculator-explanation">
              <BlockContentRenderer content={[explanation]} />
            </div>
          </AnimateHeight>
        </>
      )}
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
