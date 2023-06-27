import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../store/state";
import { PaymentMethod } from "../../../types/Enums";
import {
  WidgetPane3BankRecurringProps,
  WidgetPane3BankSingleProps,
  WidgetPane3ReferralsProps,
  WidgetProps,
} from "../../../types/WidgetProps";
import { ResultPane } from "./Bank/ResultPane";
import { VippsPane } from "./Vipps/VippsPane";

export const PaymentPane: React.FC<{
  text: WidgetPane3BankRecurringProps & WidgetPane3BankSingleProps & WidgetPane3ReferralsProps;
  paymentMethods: WidgetProps["methods"];
}> = ({ text, paymentMethods }) => {
  const method = useSelector((state: State) => state.donation.method);

  switch (method) {
    case PaymentMethod.BANK: {
      return (
        <ResultPane
          text={{
            pane3_bank_recurring_title: text.pane3_bank_recurring_title,
            pane3_bank_recurring_selector_earliest_text:
              text.pane3_bank_recurring_selector_earliest_text,
            pane3_bank_recurring_selector_choose_date_text:
              text.pane3_bank_recurring_selector_choose_date_text,
            pane3_bank_recurring_button_text: text.pane3_bank_recurring_button_text,
            pane3_bank_single_title: text.pane3_bank_single_title,
            pane3_bank_single_kontonr_title: text.pane3_bank_single_kontonr_title,
            pane3_bank_single_kid_title: text.pane3_bank_single_kid_title,
            pane3_bank_single_explanatory_text: text.pane3_bank_single_explanatory_text,
            pane3_referrals_title: text.pane3_referrals_title,
          }}
        />
      );
    }
    case PaymentMethod.VIPPS: {
      const vippsConfiguration = paymentMethods?.find((method) => method._id === "vipps");
      if (!vippsConfiguration) {
        throw new Error("Missing configuration for Vipps, but selected payment method is vipps");
      }
      return (
        <VippsPane
          referrals={{
            pane3_referrals_title: text.pane3_referrals_title,
          }}
          vipps={vippsConfiguration}
        />
      );
    }
    default: {
      throw new Error(`Unknown payment method: ${method}`);
    }
  }
};
