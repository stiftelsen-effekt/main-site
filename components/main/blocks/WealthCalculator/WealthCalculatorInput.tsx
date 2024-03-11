import { NumericFormat } from "react-number-format";
import styles from "./WealthCalculator.module.scss";
import { EffektDropdown } from "../../../shared/components/EffektDropdown/EffektDropdown";
import {
  EffektButton,
  EffektButtonVariant,
} from "../../../shared/components/EffektButton/EffektButton";
import { LoadingButtonSpinner } from "../../../shared/components/Spinner/LoadingButtonSpinner";
import { useCallback, useRef } from "react";

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
};

export const WealthCalculatorInput: React.FC<{
  title: string;
  incomeInput: number | undefined;
  setIncomeInput: (value: number) => void;
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
          <div className={styles.calculator__input__group__input__income__wrapper}>
            <NumericFormat
              type={"tel"}
              placeholder={config.income_input_configuration.placeholder}
              value={incomeInput}
              className={styles.calculator__input__group__input__text}
              thousandSeparator={config.income_input_configuration.thousand_separator}
              onValueChange={(values) => {
                setIncomeInput(values.floatValue || 0);
              }}
            />
            {loadingPostTaxIncome && (
              <div className={styles.calculator__input__group__input__income__spinner}>
                <LoadingButtonSpinner />
              </div>
            )}
            <span>{config.income_input_configuration.currency_label}</span>
          </div>
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
            Beregn
          </EffektButton>
        </div>
      </div>
    </div>
  );
};
