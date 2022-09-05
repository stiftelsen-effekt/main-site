import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../store/state";
import { PaymentMethod } from "../../../types/Enums";
import {
  WidgetPane3BankRecurringProps,
  WidgetPane3BankSingleProps,
  WidgetPane3ReferralsProps,
  WidgetPane3VippsRecurringProps,
  WidgetPane3VippsSingleProps,
} from "../../../types/WidgetProps";
import { Pane } from "../Panes.style";
import { ResultPane } from "./Bank/ResultPane";
import { VippsPane } from "./Vipps/VippsPane";

export const PaymentPane: React.FC<{
  text: WidgetPane3BankRecurringProps &
    WidgetPane3BankSingleProps &
    WidgetPane3VippsRecurringProps &
    WidgetPane3VippsSingleProps &
    WidgetPane3ReferralsProps;
}> = ({ text }) => {
  const method = useSelector((state: State) => state.donation.method);

  return (
    <Pane>
      {method === PaymentMethod.BANK && (
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
      )}
      {method === PaymentMethod.VIPPS && (
        <VippsPane
          text={{
            pane3_vipps_recurring_title: text.pane3_vipps_recurring_title,
            pane3_vipps_recurring_selector_earliest_text:
              text.pane3_vipps_recurring_selector_earliest_text,
            pane3_vipps_recurring_selector_choose_date_text:
              text.pane3_vipps_recurring_selector_choose_date_text,
            pane3_vipps_recurring_button_text: text.pane3_vipps_recurring_button_text,
            pane3_vipps_single_title: text.pane3_vipps_single_title,
            pane3_vipps_single_button_text: text.pane3_vipps_single_button_text,
            pane3_referrals_title: text.pane3_referrals_title,
          }}
        />
      )}
    </Pane>
  );
};
