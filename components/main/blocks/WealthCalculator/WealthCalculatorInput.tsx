import { NumericFormat } from "react-number-format";
import styles from "./WealthCalculator.module.scss";
import { EffektDropdown } from "../../../shared/components/EffektDropdown/EffektDropdown";
import {
  EffektButton,
  EffektButtonVariant,
} from "../../../shared/components/EffektButton/EffektButton";
import { LoadingButtonSpinner } from "../../../shared/components/Spinner/LoadingButtonSpinner";
import { useCallback, useRef, useState } from "react";

export type WealthCalculatorInputConfiguration = {
  subtitle_label?: string;
  income_input_configuration: {
    placeholder?: string;
    thousand_separator?: string;
    currency_label?: string;
    description?: string;
  };
  children_input_configuration: {
    placeholder?: string;
    options: string[];
  };
  adults_input_configuration: {
    placeholder?: string;
    options: string[];
  };
  calculate_button_label?: string;
};

export const WealthCalculatorInput: React.FC<{
  title: string;
  incomeInput: number[] | undefined;
  setIncomeInput: (values: number[]) => void;
  numberOfChildren: number;
  setNumberOfChildren: (value: number) => void;
  numberOfAdults: number;
  setNumberOfParents: (value: number) => void;
  loadingPostTaxIncome: boolean;
  config: WealthCalculatorInputConfiguration;
}> = ({
  title,
  incomeInput,
  setIncomeInput,
  numberOfChildren,
  setNumberOfChildren,
  numberOfAdults,
  setNumberOfParents,
  loadingPostTaxIncome,
  config,
}) => {
  const calculateButtonRef = useRef<HTMLDivElement>(null);
  const [adultIncomes, setAdultIncomes] = useState<number[]>(() =>
    Array.from({ length: config.adults_input_configuration.options.length }, () => 0),
  );

  const scrollToOutput = useCallback(() => {
    if (calculateButtonRef.current) {
      window.scrollTo({
        top: calculateButtonRef.current.offsetTop + calculateButtonRef.current.clientHeight + 60,
        behavior: "smooth",
      });
    }
  }, [calculateButtonRef]);

  return (
    <div className={styles.calculator__input}>
      <div className={styles.calculator__input__inner}>
        <h5>{title}</h5>
        <span className={styles.calculator__input__subtitle}>{config.subtitle_label}</span>

        <div className={styles.calculator__input__group} data-cy="wealthcalculator-income-input">
          {Array.from({ length: numberOfAdults }, (_, index) => adultIncomes[index] || 0).map(
            (adultIncome, index) => (
              <div className={styles.calculator__input__group__input__income__wrapper} key={index}>
                <NumericFormat
                  type={"tel"}
                  placeholder={
                    numberOfAdults > 1
                      ? `${config.income_input_configuration.placeholder} ${index + 1}`
                      : config.income_input_configuration.placeholder
                  }
                  value={adultIncome || ""}
                  className={styles.calculator__input__group__input__text}
                  thousandSeparator={config.income_input_configuration.thousand_separator}
                  onValueChange={(values) => {
                    const nextIncomes = adultIncomes.map((income, incomeIndex) =>
                      incomeIndex === index ? values.floatValue || 0 : income,
                    );
                    setAdultIncomes(nextIncomes);
                    setIncomeInput(nextIncomes.slice(0, numberOfAdults));
                  }}
                />
                {loadingPostTaxIncome && index === numberOfAdults - 1 && (
                  <div className={styles.calculator__input__group__input__income__spinner}>
                    <LoadingButtonSpinner />
                  </div>
                )}
                <span>{config.income_input_configuration.currency_label}</span>
              </div>
            ),
          )}
          <i>{config.income_input_configuration.description}</i>
        </div>

        <div className={styles.calculator__input__group} data-cy="wealthcalculator-children-input">
          <EffektDropdown
            placeholder={config.children_input_configuration.placeholder || "Children in household"}
            options={config.children_input_configuration.options || []}
            value={config.children_input_configuration.options[numberOfChildren]}
            onChange={(val: string) =>
              setNumberOfChildren(config.children_input_configuration.options.indexOf(val))
            }
          ></EffektDropdown>
        </div>

        <div className={styles.calculator__input__group} data-cy="wealthcalculator-adults-input">
          <EffektDropdown
            placeholder={config.adults_input_configuration.placeholder || "Adults in household"}
            options={config.adults_input_configuration.options || []}
            value={config.adults_input_configuration.options[numberOfAdults - 1]}
            onChange={(val: string) =>
              setNumberOfParents(config.adults_input_configuration.options.indexOf(val) + 1)
            }
          ></EffektDropdown>
        </div>

        <div
          className={[styles.calculator__input__group, styles.calculator__input__group_mobile].join(
            " ",
          )}
          ref={calculateButtonRef}
        >
          <EffektButton onClick={scrollToOutput} variant={EffektButtonVariant.SECONDARY}>
            {config.calculate_button_label}
          </EffektButton>
        </div>
      </div>
    </div>
  );
};
