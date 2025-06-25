import { LinkType, LinksProps } from "../../../../main/blocks/Links/Links";
import { DatePickerInputConfiguration } from "../../DatePicker/DatePickerInput";
import { NavLink } from "../../Navbar/Navbar";

export type WidgetProps = { locale: "no" | "sv" | "en" } & WidgetPane1Props &
  WidgetPane2Props &
  WidgetPane3ReferralsProps & {
    methods?: Array<
      | BankPaymentMethod
      | VippsPaymentMethod
      | SwishPaymentMethod
      | AutoGiroPaymentMethod
      | AvtaleGiroPaymentMethod
      | QuickPayPaymentMethod
    >;
  };

export type BankPaymentMethod = {
  _id: "bank";
  selector_text: string;
  title: string;
  kontonr_title: string;
  kontonr: string;
  kid_title: string;
  explanatory_text: string;
  explanatory_text_email_template: string;
  button_text: string;
  completed_title: string;
  completed_text: string;
  locale: string;
};

export type VippsPaymentMethod = {
  _id: "vipps";
  selector_text: string;
  recurring_title: string;
  recurring_selector_earliest_text: string;
  recurring_selector_choose_date_text: string;
  recurring_selector_date_picker_configuration: DatePickerInputConfiguration;
  recurring_button_text: string;
  single_title: string;
  single_button_text: string;
};

export type SwishPaymentMethod = {
  _id: "swish";
  selector_text: string;
  prompt: {
    title: string;
    scan_text?: string;
    redirect_text?: string;
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

export type AvtaleGiroPaymentMethod = {
  _id: "avtalegiro";
  selector_text: string;
  title: string;
  selector_earliest_text: string;
  selector_choose_date_text: string;
  date_selector_configuration: DatePickerInputConfiguration;
  button_text: string;
};

export type AutoGiroPaymentMethod = {
  _id: "autogiro";
  selector_text: string;
  title: string;
  payer_number_label: string;
  account_number_label: string;
  account_number: string;
  manual_recurring_option_config: AutogiroManualRecurringOptionConfig;
  recurring_manual_option_config: AutogiroRecurringManualOptionConfig;
  completed_text: any[];
};

export type QuickPayPaymentMethod = {
  _id: "quickpay";
  selector_text: string;
  recurring_button_text: string;
  single_button_text: string;
};

type AutogiroManualRecurringOptionConfig = {
  title: string;
  sum_label: string;
  payer_numberexplanatory_text: string;
  instruction_text: any[];
  complete_button_text: string;
};

type AutogiroRecurringManualOptionConfig = {
  title: string;
  explanation_text: any[];
  date_selector_config: DatePickerInputConfiguration;
  complete_button_text: string;
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
  allow_anonymous_donations?: boolean;
  anon_button_text: string;
  anon_button_text_tooltip: string;
  show_name_field?: boolean;
  name_placeholder: string;
  name_invalid_error_text: string;
  email_placeholder: string;
  email_invalid_error_text: string;
  tax_deduction_selector_text: string;
  tax_deduction_ssn_placeholder: string;
  tax_deduction_ssn_invalid_error_text: string;
  tax_deduction_tooltip_text: string;
  newsletter_selector_text: string;
  require_privacy_policy_checkbox?: boolean;
  privacy_policy_text: string;
  privacy_policy_link: NavLink;
  pane2_button_text: string;
};

export type WidgetPane3ReferralsProps = {
  referrals_title: string;
  other_referral_input_placeholder: string;
};
