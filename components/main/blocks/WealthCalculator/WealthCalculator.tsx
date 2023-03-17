import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { thousandize } from "../../../../util/formatting";
import { EffektSlider } from "../../../shared/components/EffektSlider/EffektSlider";
import { AreaChart } from "../../../shared/components/Graphs/Area/AreaGraph";
import { wealthMountainGraphData } from "./data";
import styles from "./WealthCalculator.module.scss";

export const WealthCalculator: React.FC<{ showImpact: boolean }> = ({ showImpact }) => {
  const [income, setIncome] = useState(460000);
  const [donationPercentage, setDonationPercentage] = useState(10);
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
      setChartSize({
        width: outputRef.current.offsetWidth,
        height: outputRef.current.offsetHeight,
      });
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
    <div className={styles.calculator}>
      <div className={styles.calculator__input}>
        <div className={styles.calculator__input__inner}>
          <h5>Rikdomskalkulator.</h5>
          <span className={styles.calculator__input__subtitle}>
            Hvor rik er du sammenlignet med resten av verden?
          </span>

          <div className={styles.calculator__input__group}>
            <input
              type={"text"}
              value={income.toString()}
              className={styles.calculator__input__group__input__text}
              onChange={(e) => {
                if (e.target.value !== "" || !isNaN(parseInt(e.target.value))) {
                  setIncome(parseInt(e.target.value));
                } else if (e.target.value === "") {
                  setIncome(0);
                }
              }}
            />
            <i>Oppgi total inntekt før skatt for husholdningen din.</i>
          </div>

          <div className={styles.calculator__input__group}>
            <div>
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
                  income * (1 - donationPercentage / 100),
                )}
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
          lineInput={income}
          donationPercentage={donationPercentage / 100}
          wealthPercentile={calculateWealthPercentile(wealthMountainGraphData, income)}
          size={chartSize}
        />
      </div>
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
