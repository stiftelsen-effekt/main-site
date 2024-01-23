import { LinkType, LinksProps } from "../../../../main/blocks/Links/Links";
import { NavLink } from "../../Navbar/Navbar";

export type WidgetProps = WidgetPane1Props &
  WidgetPane2Props &
  WidgetPane3ReferralsProps & {
    methods?: Array<
      BankPaymentMethod | VippsPaymentMethod | SwishPaymentMethod | AutoGiroPaymentMethod
    >;
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
  prompt: {
    title: string;
    text?: string;
  };
  success: {
    title: string;
    text?: string;
  };
  error: {
    title: string;
    text?: string;
  };
  declined: {
    title: string;
    text?: string;
  };
  cancelled: {
    title: string;
    text?: string;
  };
};

export type AutoGiroPaymentMethod = {
  _id: "autogiro";
  selector_text: string;
  title: string;
  manual_recurring_option_config: AutogiroManualRecurringOptionConfig;
  recurring_manual_option_config: AutogiroRecurringManualOptionConfig;
  recurring_form_option_config: AutogiroRecurringFormOptionConfig;
};

type AutogiroManualRecurringOptionConfig = {
  title: string;
  sum_label: string;
  account_number_label: string;
  payment_numberexplanatory_text: string;
  payment_number_label: string;
  instruction_text: any[];
};

type AutogiroRecurringManualOptionConfig = {
  title: string;
  explanation_text: any[];
  payernumber_label: string;
};

type AutogiroRecurringFormOptionConfig = {
  title: string;
  explanation_text: any[];
  payernumber_label: string;
  button_text: string;
  button_link: string;
};

export type SmartDistributionContext = {
  smart_distribution_radiobutton_text: string;
  custom_distribution_radiobutton_text: string;
  smart_distribution_label_text: string;
  smart_distribution_description: any[];
  smart_distribution_description_links: (LinkType | NavLink)[];
};

type PresetAmount = {
  amount: number;
  subtext: string;
};
export type AmountContext = {
  preset_amounts_recurring: Array<PresetAmount>;
  preset_amounts_single: Array<PresetAmount>;
  custom_amount_text: string;
};

export type WidgetPane1Props = {
  single_donation_text: string;
  monthly_donation_text: string;
  amount_context: AmountContext;
  smart_distribution_context: SmartDistributionContext;
  pane1_button_text: string;
  donation_input_error_templates: DonationInputErrorTemplates;
};

export type DonationInputErrorTemplates = {
  donation_sum_error_template: string;
  donation_distribution_cause_areas_sum_error_template: string;
  donation_distribution_cause_areas_negative_error_template: string;
  donation_distribution_cause_areas_organization_sum_error_template: string;
  donation_distribution_cause_areas_organization_negative_error_template: string;
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
