import { NumericFormat } from "react-number-format";
import styles from "./WealthCalculator.module.scss";
import { EffektDropdown } from "../../../shared/components/EffektDropdown/EffektDropdown";
import {
  EffektButton,
  EffektButtonVariant,
} from "../../../shared/components/EffektButton/EffektButton";
import { Spinner } from "../../../shared/components/Spinner/Spinner";
import { LoadingButtonSpinner } from "../../../shared/components/Spinner/LoadingButtonSpinner";

export const WealthCalculatorInput: React.FC<{
  title: string;
  incomeInput: number | undefined;
  setIncomeInput: (value: number) => void;
  numberOfChildren: number;
  setNumberOfChildren: (value: number) => void;
  numberOfAdults: number;
  setNumberOfParents: (value: number) => void;
  loadingPostTaxIncome: boolean;
  outputRef: React.RefObject<HTMLDivElement>;
}> = ({
  title,
  incomeInput,
  setIncomeInput,
  numberOfChildren,
  setNumberOfChildren,
  numberOfAdults,
  setNumberOfParents,
  loadingPostTaxIncome,
  outputRef,
}) => {
  return (
    <div className={styles.calculator__input}>
      <div className={styles.calculator__input__inner}>
        <h5>{title}</h5>
        <span className={styles.calculator__input__subtitle}>
          Hvor rik er du sammenlignet med resten av verden?
        </span>

        <div className={styles.calculator__input__group} data-cy="wealthcalculator-income-input">
          <div className={styles.calculator__input__group__input__income__wrapper}>
            <NumericFormat
              type={"tel"}
              placeholder={"Inntekt"}
              value={incomeInput}
              className={styles.calculator__input__group__input__text}
              thousandSeparator={" "}
              onValueChange={(values) => {
                setIncomeInput(values.floatValue || 0);
              }}
            />
            {loadingPostTaxIncome && (
              <div className={styles.calculator__input__group__input__income__spinner}>
                <LoadingButtonSpinner />
              </div>
            )}
            <span>kr</span>
          </div>
          <i>Oppgi total inntekt før skatt for husholdningen din.</i>
        </div>

        <div className={styles.calculator__input__group} data-cy="wealthcalculator-children-input">
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

        <div className={styles.calculator__input__group} data-cy="wealthcalculator-adults-input">
          <EffektDropdown
            placeholder={"Antall voksne i husholdningen"}
            options={[
              "1 voksen i husholdningen",
              "2 voksne i husholdningen",
              "3 voksne i husholdningen",
            ]}
            value={`${numberOfAdults.toString()} ${
              numberOfAdults === 1 ? "voksen" : "voksne"
            } i husholdningen`}
            onChange={(val: string) => setNumberOfParents(parseInt(val[0]))}
          ></EffektDropdown>
        </div>

        <div
          className={[styles.calculator__input__group, styles.calculator__input__group_mobile].join(
            " ",
          )}
        >
          <EffektButton
            onClick={() => {
              window.scrollTo({
                top: (outputRef.current?.offsetTop || 0) - 60,
                behavior: "smooth",
              });
            }}
            variant={EffektButtonVariant.SECONDARY}
          >
            Beregn
          </EffektButton>
        </div>
      </div>
    </div>
  );
};
