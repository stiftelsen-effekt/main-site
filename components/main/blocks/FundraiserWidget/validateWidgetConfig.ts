import { FetchFundraiserResult } from "../../../../studio/sanity.types";

type WidgetConfig = NonNullable<
  NonNullable<FetchFundraiserResult["page"]>["fundraiser_widget_config"]
>;

type OrganizationInfo = NonNullable<FetchFundraiserResult["page"]>["fundraiser_organization"];

// Helper function to validate required config fields
export function validateWidgetConfig(
  config: WidgetConfig | null,
  organizationInfo?: OrganizationInfo,
): { valid: true; config: WidgetConfig } | { valid: false; error: string } {
  if (!config) {
    return { valid: false, error: "Missing config for fundraiser widget" };
  }

  // Validate organization info if provided
  if (organizationInfo !== undefined) {
    if (!organizationInfo) {
      return { valid: false, error: "Missing organization info" };
    }
    if (!organizationInfo.logo) {
      return { valid: false, error: "Missing organization logo" };
    }
    if (!organizationInfo.name) {
      return { valid: false, error: "Missing organization name" };
    }
  }

  // Check if bank payment method is included
  const hasBankMethod = config.payment_methods?.some(
    (method) => method._type === "bank" || method._type === "dkbank",
  );

  // Define required fields
  const requiredFields: Array<{
    key: keyof WidgetConfig;
    path: string;
  }> = [
    { key: "currency_symbol", path: "currency_symbol" },
    { key: "header", path: "header" },
    { key: "donation_amount_label", path: "donation_amount_label" },
    { key: "name_label", path: "name_label" },
    { key: "message_label", path: "message_label" },
    { key: "show_name_label", path: "show_name_label" },
    { key: "email_label", path: "email_label" },
    { key: "privacy_policy", path: "privacy_policy" },
    { key: "next_button_text", path: "next_button_text" },
  ];

  // Check top-level required fields
  for (const field of requiredFields) {
    if (!config[field.key]) {
      return { valid: false, error: `Missing config for fundraiser widget: ${field.path}` };
    }
  }

  // Validate tax_deduction when enabled
  if (config.tax_deduction_enabled) {
    const taxDeduction = config.tax_deduction;
    if (!taxDeduction) {
      return {
        valid: false,
        error: "Missing config for fundraiser widget: tax_deduction (enable toggle is on)",
      };
    }
    const requiredTaxFields: Array<{
      key: keyof NonNullable<WidgetConfig["tax_deduction"]>;
      path: string;
    }> = [
      { key: "minimum_amount", path: "tax_deduction.minimum_amount" },
      { key: "label", path: "tax_deduction.label" },
      { key: "tooltip_text", path: "tax_deduction.tooltip_text" },
      { key: "ssn_label", path: "tax_deduction.ssn_label" },
    ];

    for (const field of requiredTaxFields) {
      if (!taxDeduction[field.key]) {
        return { valid: false, error: `Missing config for fundraiser widget: ${field.path}` };
      }
    }
  }

  // Validate newsletter when enabled
  if (config.newsletter_enabled) {
    const newsletter = config.newsletter;
    if (!newsletter) {
      return {
        valid: false,
        error: "Missing config for fundraiser widget: newsletter (enable toggle is on)",
      };
    }
    if (!newsletter.label) {
      return { valid: false, error: "Missing config for fundraiser widget: newsletter.label" };
    }
  }

  // Validate privacy_policy nested fields
  if (config.privacy_policy) {
    if (!config.privacy_policy.text) {
      return { valid: false, error: "Missing config for fundraiser widget: privacy_policy.text" };
    }
    if (config.privacy_policy.require_checkbox && !config.privacy_policy.required_error_text) {
      return {
        valid: false,
        error: "Missing config for fundraiser widget: privacy_policy.required_error_text",
      };
    }
  }

  // Only validate bank_account_details if bank method is selected
  if (hasBankMethod) {
    if (!config.bank_account_details) {
      return {
        valid: false,
        error:
          "Missing config for fundraiser widget: bank_account_details (required when bank payment method is selected)",
      };
    }

    const bankDetails = config.bank_account_details;
    const requiredBankFields: Array<{
      key: keyof NonNullable<WidgetConfig["bank_account_details"]>;
      path: string;
    }> = [
      { key: "account_number_prefix", path: "bank_account_details.account_number_prefix" },
      { key: "account_number", path: "bank_account_details.account_number" },
      { key: "kid_prefix", path: "bank_account_details.kid_prefix" },
      { key: "transfer_delay_text", path: "bank_account_details.transfer_delay_text" },
      { key: "account_owner_text", path: "bank_account_details.account_owner_text" },
      { key: "bank_transfer_info", path: "bank_account_details.bank_transfer_info" },
    ];

    for (const field of requiredBankFields) {
      if (!bankDetails[field.key]) {
        return { valid: false, error: `Missing config for fundraiser widget: ${field.path}` };
      }
    }
  }

  if (!config.payment_methods || config.payment_methods.length === 0) {
    return { valid: false, error: "Missing config for fundraiser widget: payment_methods" };
  }

  return { valid: true, config };
}
