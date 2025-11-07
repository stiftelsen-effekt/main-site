import { defineType, defineField } from "sanity";

export default defineType({
  name: "fundraiserwidget",
  type: "document",
  title: "Fundraiser widget",
  fields: [
    defineField({
      name: "title",
      title: "Configuration title",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Internal name for this configuration (e.g., 'Norwegian Fundraiser Widget')",
    }),
    defineField({
      name: "payment_methods",
      type: "array",
      title: "Payment methods",
      validation: (Rule) => Rule.required().min(1),
      of: [
        {
          type: "reference",
          to: [
            { type: "bank" },
            { type: "vipps" },
            { type: "quickpay_card" },
            { type: "quickpay_mobilepay" },
            { type: "dkbank" },
          ],
          validation: (Rule) => Rule.required(),
          options: {
            disableNew: true,
          },
        },
      ],
    }),
    defineField({
      name: "currency_symbol",
      title: "Currency symbol",
      type: "string",
      validation: (Rule) => Rule.required(),
      initialValue: "kr",
    }),
    defineField({
      name: "header",
      title: "Header",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "donation_amount_label",
      title: "Donation amount label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name_label",
      title: "Name label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "message_label",
      title: "Message label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "show_name_label",
      title: "Show name label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email_label",
      title: "Email label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "allow_anonymous_donations",
      title: "Allow anonymous donations",
      type: "boolean",
      initialValue: true,
      description: "If true, the user does not need to provide an email address to donate",
    }),
    defineField({
      name: "tax_deduction_enabled",
      title: "Enable tax deduction",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "tax_deduction",
      title: "Tax deduction configuration",
      type: "object",
      description:
        "Configure tax deduction and SSN collection. Leave empty to disable tax deduction entirely.",
      hidden: ({ parent }) => !parent?.tax_deduction_enabled,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!(context.parent as any)?.tax_deduction_enabled) {
            return true;
          }
          if (!value) {
            return "Provide tax deduction details or disable the option above.";
          }
          return true;
        }),
      options: {
        modal: {
          type: "popover",
        },
      },
      fields: [
        defineField({
          name: "minimum_amount",
          title: "Minimum amount for automatic opt-in",
          type: "number",
          description:
            "Minimum donation amount for automatic tax deduction opt-in (e.g., 500 for Norway)",
          validation: (Rule) => Rule.required().positive(),
        }),
        defineField({
          name: "label",
          title: "Checkbox label",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "tooltip_text",
          title: "Tooltip text",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "ssn_label",
          title: "SSN field label",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "ssn_invalid_error_text",
          title: "SSN invalid error text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "ssn_suspicious_error_text",
          title: "SSN suspicious error text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "newsletter_enabled",
      title: "Enable newsletter opt-in",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "newsletter",
      title: "Newsletter configuration",
      type: "object",
      description: "Configure newsletter opt-in. Leave empty to disable newsletter entirely.",
      hidden: ({ parent }) => !parent?.newsletter_enabled,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!(context.parent as any)?.newsletter_enabled) {
            return true;
          }
          if (!value) {
            return "Provide newsletter details or disable the option above.";
          }
          return true;
        }),
      fields: [
        defineField({
          name: "label",
          title: "Checkbox label",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "privacy_policy",
      title: "Privacy policy configuration",
      type: "object",
      description: "Configure how privacy policy is displayed (link or required checkbox)",
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "text",
          title: "Privacy policy text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "require_checkbox",
          title: "Require checkbox",
          type: "boolean",
          description:
            "If true, user must check the privacy policy checkbox to proceed (Denmark). If false, privacy policy is just a link (Norway).",
          initialValue: false,
        }),
        defineField({
          name: "privacy_policy_url",
          title: "Privacy policy URL",
          type: "navitem",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "required_error_text",
          title: "Required error text",
          type: "string",
          description:
            "Error message shown when checkbox is not checked (only used if 'Require checkbox' is true)",
          hidden: ({ parent }) => !parent?.require_checkbox,
          validation: (Rule) =>
            Rule.custom((value, context) => {
              const parent = context.parent as any;
              if (parent?.require_checkbox && !value) {
                return "Required error text is required when checkbox is required";
              }
              return true;
            }),
        }),
      ],
    }),
    defineField({
      name: "next_button_text",
      title: "Next button text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bank_account_details",
      title: "Bank account details",
      type: "object",
      description: "Required only if Bank payment method is selected",
      hidden: ({ parent }) => {
        // Hide if no bank method is selected
        const paymentMethods = parent?.payment_methods || [];
        return !paymentMethods.some((method: any) => method._ref?.includes("bank"));
      },
      fields: [
        defineField({
          name: "account_number_prefix",
          title: "Account number prefix",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "account_number",
          title: "Account number",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "kid_prefix",
          title: "KID prefix",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "transfer_delay_text",
          title: "Transfer delay text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "account_owner_text",
          title: "Account owner text",
          type: "text",
          rows: 2,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "bank_transfer_info",
          title: "Bank transfer info",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as any;
          const paymentMethods = parent?.payment_methods || [];
          const hasBankMethod = paymentMethods.some(
            (method: any) => method._ref?.includes("bank") || method._ref?.includes("dkbank"),
          );

          if (hasBankMethod && !value) {
            return "Bank account details are required when Bank payment method is selected";
          }

          if (hasBankMethod && value) {
            // Check all required nested fields
            const requiredFields = [
              "account_number_prefix",
              "account_number",
              "kid_prefix",
              "transfer_delay_text",
              "account_owner_text",
              "bank_transfer_info",
            ];
            for (const field of requiredFields) {
              if (!value[field]) {
                return `${field} is required in bank account details`;
              }
            }
          }

          return true;
        }),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare(selection: any) {
      return {
        title: selection.title || "Fundraiser widget configuration",
      };
    },
  },
});
