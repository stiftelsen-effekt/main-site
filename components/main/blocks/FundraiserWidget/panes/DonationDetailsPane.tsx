import React from "react";
import { NumericFormat } from "react-number-format";
import { EffektCheckbox } from "../../../../shared/components/EffektCheckbox/EffektCheckbox";
import CharacterCountCircle from "../../../../shared/components/CharacterCountCircle/CharacterCountCircle";
import { SuggestedAmounts } from "../components/SuggestedAmounts";
import { FormData } from "../hooks/useFundraiserForm";
import styles from "../FundraiserWidget.module.scss";

interface DonationDetailsPaneProps {
  formData: Pick<FormData, "amount" | "messageSenderName" | "message" | "showName">;
  onChange: (field: keyof FormData, value: any) => void;
  onSubmit: () => void;
  config: {
    suggested_amounts: number[];
    currency_symbol: string;
    donation_amount_label: string;
    name_label: string;
    message_label: string;
    show_name_label: string;
    next_button_text: string;
  };
  className?: string;
  visible?: boolean;
}

export const DonationDetailsPane = React.forwardRef<HTMLDivElement, DonationDetailsPaneProps>(
  ({ formData, onChange, onSubmit, config, className, visible }, ref) => {
    return (
      <div ref={ref} className={className} style={{ display: visible ? "block" : "none" }}>
        <form
          className={styles["donation-widget__form"]}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {config.suggested_amounts.length > 0 && (
            <div className={styles["donation-widget__input-group"]}>
              <SuggestedAmounts
                amounts={config.suggested_amounts}
                selectedAmount={formData.amount}
                currencySymbol={config.currency_symbol}
                onSelect={(amount) => onChange("amount", amount)}
              />
            </div>
          )}

          <div className={styles["donation-widget__input-group"]}>
            <NumericFormat
              id="amount"
              name="amount"
              value={formData.amount}
              onValueChange={(v) => {
                onChange("amount", v.floatValue ?? null);
              }}
              thousandSeparator=" "
              placeholder={config.donation_amount_label}
              required
              min={1}
              step={1}
            />
            <span className={styles["donation-widget__input-group__suffix"]}>
              {config.currency_symbol}
            </span>
          </div>

          <div className={styles["donation-widget__input-group"]} style={{ marginTop: "2rem" }}>
            <input
              id="messageSenderName"
              name="messageSenderName"
              type="text"
              value={formData.messageSenderName}
              onChange={(e) => onChange("messageSenderName", e.target.value)}
              placeholder={config.name_label}
              required={formData.showName}
              maxLength={45}
            />
          </div>

          <div className={styles["donation-widget__input-group"]}>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              placeholder={config.message_label}
              onChange={(e) => onChange("message", e.target.value)}
              maxLength={250}
            />
            <div className={styles["donation-widget__message-sub"]}>
              {formData.message.length > 0 && (
                <CharacterCountCircle count={formData.message.length} max={250} />
              )}
            </div>
          </div>

          <div className={styles["donation-widget__checkbox-group"]}>
            <EffektCheckbox
              checked={formData.showName}
              onChange={(checked) => {
                onChange("showName", checked);
              }}
            >
              {config.show_name_label}
            </EffektCheckbox>
          </div>

          <button type="submit" className={styles["donation-widget__button"]}>
            {config.next_button_text}
          </button>
        </form>
      </div>
    );
  },
);

DonationDetailsPane.displayName = "DonationDetailsPane";
