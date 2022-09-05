export type WidgetProps = WidgetPane1Props &
  WidgetPane2Props &
  WidgetPane3BankRecurringProps &
  WidgetPane3VippsRecurringProps &
  WidgetPane3BankSingleProps &
  WidgetPane3VippsSingleProps &
  WidgetPane3ReferralsProps;

export type WidgetPane1Props = {
  single_donation_text: string;
  monthly_donation_text: string;
  preset_amounts_recurring: Array<{
    amount: number;
    subtext: string;
  }>;
  preset_amounts_single: Array<{
    amount: number;
    subtext: string;
  }>;
  smart_fordeling_text: string;
  smart_fordeling_description: string;
  choose_your_own_text: string;
  pane1_button_text: string;
};

export type WidgetPane2Props = {
  anon_button_text: string;
  name_placeholder: string;
  email_placeholder: string;
  tax_deduction_selector_text: string;
  tax_deduction_ssn_placeholder: string;
  tax_deduction_tooltip_text: string;
  newsletter_selector_text: string;
  privacy_policy_text: string;
  payment_method_selector_bank_text: string;
  payment_method_selector_vipps_text: string;
  pane2_button_text: string;
};

export type WidgetPane3BankSingleProps = {
  pane3_bank_single_title: string;
  pane3_bank_single_kontonr_title: string;
  pane3_bank_single_kid_title: string;
  pane3_bank_single_explanatory_text: string;
};

export type WidgetPane3BankRecurringProps = {
  pane3_bank_recurring_title: string;
  pane3_bank_recurring_selector_earliest_text: string;
  pane3_bank_recurring_selector_choose_date_text: string;
  pane3_bank_recurring_button_text: string;
};

export type WidgetPane3VippsSingleProps = {
  pane3_vipps_single_title: string;
  pane3_vipps_single_button_text: string;
};

export type WidgetPane3VippsRecurringProps = {
  pane3_vipps_recurring_title: string;
  pane3_vipps_recurring_selector_earliest_text: string;
  pane3_vipps_recurring_selector_choose_date_text: string;
  pane3_vipps_recurring_button_text: string;
};

export type WidgetPane3ReferralsProps = {
  pane3_referrals_title: string;
};
