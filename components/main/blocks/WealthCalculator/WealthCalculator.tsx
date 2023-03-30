import { useContext, useEffect, useRef, useState } from "react";
import AnimateHeight from "react-animate-height";
import { NumericFormat } from "react-number-format";
import { useDebouncedCallback } from "use-debounce";
import { thousandize } from "../../../../util/formatting";
import {
  EffektButton,
  EffektButtonType,
} from "../../../shared/components/EffektButton/EffektButton";
import { EffektDropdown } from "../../../shared/components/EffektDropdown/EffektDropdown";
import { EffektSlider } from "../../../shared/components/EffektSlider/EffektSlider";
import { AreaChart } from "../../../shared/components/Graphs/Area/AreaGraph";
import { WidgetContext } from "../../layout/layout";
import { BlockContentRenderer } from "../BlockContentRenderer";
import { ImpactWidgetOutput, SanityIntervention } from "../ImpactWidget/ImpactWidgetOutput";
import { wealthMountainGraphData } from "./data";
import styles from "./WealthCalculator.module.scss";

export const WealthCalculator: React.FC<{
  showImpact: boolean;
  interventions: SanityIntervention[];
  explanation?: any;
}> = ({ showImpact, interventions, explanation }) => {
  const [incomeInput, setIncomeInput] = useState<number | undefined>();
  const income = incomeInput || 0;
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [numberOfAdults, setNumberOfParents] = useState(1);
  const [donationPercentage, setDonationPercentage] = useState(10);
  const [widgetOpen, setWidgetOpen] = useContext(WidgetContext);
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [chartSize, setChartSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  const equvivalizedIncome = equvivalizeIncome(income, numberOfChildren, numberOfAdults);

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
              height: outputRef.current.offsetHeight,
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
          height: outputRef.current.offsetWidth,
        });
      }
    }
  };

  useEffect(() => {
    debouncedSizingUpdate();
  }, [outputRef]);

  const debouncedSizingUpdate = useDebouncedCallback(() => updateSizing(), 100, {
    maxWait: 100,
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", debouncedSizingUpdate);
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.calculator}>
        <div className={styles.calculator__input}>
          <div className={styles.calculator__input__inner}>
            <h5>Rikdomskalkulator.</h5>
            <span className={styles.calculator__input__subtitle}>
              Hvor rik er du sammenlignet med resten av verden? Test.
            </span>

            <div className={styles.calculator__input__group}>
              <div className={styles.calculator__input__group__input__income__wrapper}>
                <NumericFormat
                  type={"tel"}
                  placeholder={"Inntekt"}
                  value={incomeInput}
                  className={styles.calculator__input__group__input__text}
                  thousandSeparator={" "}
                  onValueChange={(values) => {
                    setIncomeInput(values.floatValue);
                  }}
                />
                <span>kr</span>
              </div>
              <i>Oppgi total inntekt før skatt for husholdningen din.</i>
            </div>

            <div className={styles.calculator__input__group}>
              <EffektDropdown
                placeholder={"Antall barn i husholdningen"}
                options={[
                  "0 barn i husholdningen",
                  "1 barn i husholdningen",
                  "2 barn i husholdningen",
                  "3 barn i husholdningen",
                  "4 barn i husholdningen",
                  "5 barn i husholdningen",
                ]}
                value={numberOfChildren.toString() + " barn i husholdningen"}
                onChange={(val: string) => setNumberOfChildren(parseInt(val[0]))}
              ></EffektDropdown>
            </div>

            <div className={styles.calculator__input__group}>
              <EffektDropdown
                placeholder={"Antall voksne i husholdningen"}
                options={[
                  "1 voksen i husholdningen",
                  "2 voksne i husholdningen",
                  "3 voksne i husholdningen",
                ]}
                value={numberOfAdults.toString() + " voksne i husholdningen"}
                onChange={(val: string) => setNumberOfParents(parseInt(val[0]))}
              ></EffektDropdown>
            </div>

            <div
              className={[
                styles.calculator__input__group,
                styles.calculator__input__group_mobile,
              ].join(" ")}
            >
              <EffektButton
                onClick={() => {
                  window.scrollTo({
                    top: (outputRef.current?.offsetTop || 0) - 60,
                    behavior: "smooth",
                  });
                }}
                type={EffektButtonType.SECONDARY}
              >
                Beregn
              </EffektButton>
            </div>
          </div>
        </div>
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
                  av din inntekt kan du donere{" "}
                  {thousandize(Math.round(income * (donationPercentage / 100)))} kr til effektiv
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

        <div className={styles.calculator__output} ref={outputRef}>
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
          />
        </div>
        {explanation ? (
          <div
            className={
              styles.calculator__explanation__toggle +
              " " +
              (explanationOpen ? styles.calculator__explanation__toggle_open : "")
            }
            onClick={() => setExplanationOpen(!explanationOpen)}
          >
            Hvordan regner vi ut hvor rik du er?
          </div>
        ) : (
          <></>
        )}
        <div className={styles.calculator__axis__label}>
          <span>Ekvivalisert årsinntekt i kroner (logaritmisk skala) →</span>
        </div>
      </div>
      {explanation && (
        <>
          <AnimateHeight height={explanationOpen ? "auto" : 0} duration={500}>
            <BlockContentRenderer content={[explanation]} />
          </AnimateHeight>
        </>
      )}
      {showImpact && (
        <div className={styles.calculator__impact}>
          <div className={styles.calculator__impact__description}>
            <h3>Din impact.</h3>
            <p>
              Med {thousandize(Math.round(income * (donationPercentage / 100)))} kroner i året
              donert til effektiv bistand kan du påvirke mange liv der det trengs mest du kan for
              eksempel bidra med myggnett, A-vitamin tilskudd eller vaksinering.
            </p>
            <EffektButton onClick={() => setWidgetOpen(true)}>Sett opp fast donasjon</EffektButton>
          </div>
          <div className={styles.calculator__impact__output}>
            <ImpactWidgetOutput
              sum={income * (donationPercentage / 100)}
              interventions={interventions}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const calculateWealthPercentile = (data: { x: number; y: number }[], income: number) => {
  const dataSum = data.reduce((acc, curr) => acc + curr.y, 0);
  const dailyIncome = income / 365 / 10;
  const bucketsSumUpToLineInput = data
    .filter((d) => d.x <= dailyIncome)
    .reduce((acc, curr) => acc + curr.y, 0);

  const bucketAfterLineInputIndex = data.findIndex((d) => d.x > dailyIncome);

  let linearInterpolationAdd = 0;
  if (bucketAfterLineInputIndex > -1) {
    const positionBetweenBuckets =
      (dailyIncome - data[bucketAfterLineInputIndex - 1].x) /
      (data[bucketAfterLineInputIndex].x - data[bucketAfterLineInputIndex - 1].x);

    linearInterpolationAdd = data[bucketAfterLineInputIndex].y * positionBetweenBuckets;
  }

  const totalSum = bucketsSumUpToLineInput + linearInterpolationAdd;

  let lineInputWealthPercentile = (1 - totalSum / dataSum) * 100;
  // Round to 2 decimals
  lineInputWealthPercentile = Math.round(lineInputWealthPercentile * 10) / 10;

  return lineInputWealthPercentile;
};

const equvivalizeIncome = (income: number, numberOfChildren: number, numberOfAdults: number) => {
  // Using OECD-modified scale for equvivalize income
  // https://en.wikipedia.org/wiki/Equivalisation
  const equvivalizedIncome = income / (1 + 0.3 * numberOfChildren + 0.5 * (numberOfAdults - 1));
  return equvivalizedIncome;
};
