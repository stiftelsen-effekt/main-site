import React from "react";
import { thousandize } from "../../../../../util/formatting";
import styles from "../FundraiserWidget.module.scss";

interface SuggestedAmountsProps {
  amounts: number[];
  selectedAmount: number | null;
  currencySymbol: string;
  onSelect: (amount: number) => void;
}

export const SuggestedAmounts: React.FC<SuggestedAmountsProps> = ({
  amounts,
  selectedAmount,
  currencySymbol,
  onSelect,
}) => {
  return (
    <div className={styles["donation-widget__input-group__suggested-sums"]}>
      {amounts.map((sum) => (
        <button
          key={sum}
          type="button"
          onClick={() => onSelect(sum)}
          className={[
            styles["donation-widget__input-group__suggested-sums__button"],
            selectedAmount === sum
              ? styles["donation-widget__input-group__suggested-sums__button--active"]
              : "",
          ].join(" ")}
        >
          {thousandize(sum)} {currencySymbol}
        </button>
      ))}
    </div>
  );
};
