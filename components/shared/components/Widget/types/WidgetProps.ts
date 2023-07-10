export type WidgetProps = WidgetPane1Props &
  WidgetPane2Props &
  WidgetPane3ReferralsProps & {
    methods?: Array<BankPaymentMethod | VippsPaymentMethod | SwishPaymentMethod>;
  };

export type BankPaymentMethod = {
  _id: "bank";
  selector_text: string;
  single_title: string;
  single_kontonr_title: string;
  single_kid_title: string;
  single_explanatory_text: string;
  recurring_title: string;
  recurring_selector_earliest_text: string;
  recurring_selector_choose_date_text: string;
  recurring_button_text: string;
};

export type VippsPaymentMethod = {
  _id: "vipps";
  selector_text: string;
  recurring_title: string;
  recurring_selector_earliest_text: string;
  recurring_selector_choose_date_text: string;
  recurring_button_text: string;
  single_title: string;
  single_button_text: string;
};

export type SwishPaymentMethod = {
  _id: "swish";
  selector_text: string;
  title: string;
};

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
  pane2_button_text: string;
};

export type WidgetPane3ReferralsProps = {
  pane3_referrals_title: string;
};
