import { defineType, defineField } from "sanity";
import {
  CauseAreaMultiSelectInput,
  CauseAreaSelectInput,
} from "../../components/causeAreaSelectInput";

export default defineType({
  name: "donationwidget",
  type: "document",
  title: "Donation widget",
  groups: [
    {
      name: "pane1",
      title: "Pane 1",
    },
    {
      name: "pane2",
      title: "Pane 2",
    },
    {
      name: "referrals",
      title: "Referrals",
    },
    {
      name: "operations",
      title: "Operations Configuration",
    },
    {
      name: "nudges",
      title: "Payment nudges",
    },
  ],
  fields: [
    defineField({
      name: "methods",
      type: "array",
      title: "Payment methods",
      validation: (Rule) => Rule.required().min(1),
      of: [
        {
          type: "reference",
          to: [
            { type: "bank" },
            { type: "vipps" },
            { type: "swish" },
            { type: "autogiro" },
            { type: "avtalegiro" },
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
      name: "nudges",
      title: "Payment method nudges",
      type: "array",
      group: "nudges",
      description:
        "Configure contextual nudges that appear below the payment method selector. Use {savings} in the message to inject the estimated transaction cost savings.",
      of: [
        defineField({
          name: "nudge",
          type: "object",
          fields: [
            defineField({
              name: "from_method",
              title: "Show when donor picks",
              type: "reference",
              to: [
                { type: "bank" },
                { type: "vipps" },
                { type: "swish" },
                { type: "autogiro" },
                { type: "avtalegiro" },
                { type: "quickpay_card" },
                { type: "quickpay_mobilepay" },
                { type: "dkbank" },
              ],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "to_method",
              title: "Recommend switching to",
              type: "reference",
              to: [
                { type: "bank" },
                { type: "vipps" },
                { type: "swish" },
                { type: "autogiro" },
                { type: "avtalegiro" },
                { type: "quickpay_card" },
                { type: "quickpay_mobilepay" },
                { type: "dkbank" },
              ],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "minimum_amount",
              title: "Minimum amount",
              type: "number",
              description: "Only show the nudge when the donation amount is at least this value.",
            }),
            defineField({
              name: "recurring_type",
              title: "Recurring type",
              type: "string",
              options: {
                list: [
                  { title: "Single", value: "single" },
                  { title: "Recurring", value: "recurring" },
                  { title: "Both", value: "both" },
                ],
                layout: "radio",
              },
              initialValue: "both",
            }),
            defineField({
              name: "message",
              title: "Message",
              type: "text",
              rows: 3,
              description: "Use {savings} to insert the estimated savings in transaction costs.",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "message",
            },
          },
        }),
      ],
    }),
    //Single / monthly donation text
    defineField({
      name: "single_donation_text",
      title: "Single donation option text",
      type: "string",
      group: "pane1",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "monthly_donation_text",
      title: "Monthly donation option text",
      type: "string",
      group: "pane1",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "default_donation_type",
      title: "Default donation type",
      type: "string",
      options: {
        list: ["single", "monthly"],
      },
      group: "pane1",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amount_context",
      title: "Donation amount inputs context",
      type: "object",
      group: "pane1",
      description: "Preset amounts are only used if there is only one cause area",
      fields: [
        defineField({
          name: "preset_amounts_recurring",
          title: "Preset amounts for recurring donations",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  title: "Value",
                  name: "amount",
                  type: "number",
                }),
                defineField({
                  title: "Subtext",
                  name: "subtext",
                  type: "string",
                }),
              ],
              preview: {
                select: {
                  title: "amount",
                  subtitle: "subtext",
                },
              },
            },
          ],
        }),
        defineField({
          name: "preset_amounts_single",
          title: "Preset amounts for single donations",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  title: "Value",
                  name: "amount",
                  type: "number",
                }),
                defineField({
                  title: "Subtext",
                  name: "subtext",
                  type: "string",
                }),
              ],
              preview: {
                select: {
                  title: "amount",
                  subtitle: "subtext",
                },
              },
            },
          ],
        }),
        defineField({
          name: "custom_amount_text",
          title: "Custom amount text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "smart_distribution_context",
      title: "Smart distribution context",
      type: "object",
      group: "pane1",
      fields: [
        defineField({
          name: "smart_distribution_radiobutton_text",
          title: "Smart distribution radiobutton text",
          type: "string",
          validation: (Rule) => Rule.required(),
          description: "Only used if there is only one cause area",
        }),
        defineField({
          name: "custom_distribution_radiobutton_text",
          title: "Custom distribution radiobutton text",
          type: "string",
          validation: (Rule) => Rule.required(),
          description: "Only used if there is only one cause area",
        }),
        defineField({
          name: "smart_distribution_title",
          title: "Smart distribution title",
          type: "string",
          validation: (Rule) => Rule.required(),
          description:
            "Title shown above the smart distribution option, e.g. in the multi cause-area amount pane and the donation summary. Only used if there is more than one cause area",
        }),
        defineField({
          name: "smart_distribution_label_text",
          title: "Smart distribution label text",
          type: "string",
          description:
            "Accordion label for the smart distribution description. Only used if there is more than one cause area",
        }),
        defineField({
          name: "smart_distribution_description",
          title: "Smart distribution description",
          type: "array",
          of: [{ type: "block" }],
        }),
        defineField({
          name: "smart_distribution_description_links",
          title: "Smart distribution description links",
          type: "array",
          of: [{ type: "link" }],
          description: "Only used if there is more than one cause area",
        }),
        defineField({
          name: "show_all_organizations_text",
          title: "Show all organizations text",
          type: "string",
          description:
            'Label for the link that reveals the remaining organizations when the donor arrives with a prefilled distribution (e.g. "Vis alle"). Only used if there is only one cause area',
        }),
      ],
    }),
    defineField({
      name: "donation_input_error_templates",
      title: "Donation input error templates",
      type: "object",
      group: "pane1",
      fields: [
        defineField({
          name: "donation_sum_error_template",
          title: "Donation sum error template",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "donation_distribution_cause_areas_sum_error_template",
          title: "Donation distribution cause areas sum error template",
          type: "string",
          validation: (Rule) => Rule.required(),
          description:
            "{sum} will be replaced with the sum of the distribution cause areas, e.g. 'You have distributed {sum}% out of 100% between cause areas'",
        }),
        defineField({
          name: "donation_distribution_cause_areas_negative_error_template",
          title: "Donation distribution cause areas negative error template",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "donation_distribution_cause_areas_organization_sum_error_template",
          title: "Donation distribution cause areas organization sum error template",
          type: "string",
          validation: (Rule) => Rule.required(),
          description:
            "{sum} will be replaced with the sum of the distribution cause areas for the organization and {causeAreaName} will be replaced with the name of the cause area, e.g. 'You have distributed {sum}% out of 100% between organizations in {causeAreaName}'",
        }),
        defineField({
          name: "donation_distribution_cause_areas_organization_negative_error_template",
          title: "Donation distribution cause areas organization negative error template",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    {
      name: "operations_config",
      title: "Operations configuration",
      type: "object",
      group: "operations",
      fields: [
        {
          name: "operations_cause_area_id",
          title: "Operations cause area",
          type: "number",
          description:
            "The cause area that represents this organization's own operations/overhead (e.g. the 'Drift' cause area). Donations to this cause area never get an additional operations tip added on top of themselves, no matter what's set in Excluded cause areas below. Leave unset on platforms that have no separate operations cause area.",
          components: { input: CauseAreaSelectInput },
        },
        {
          name: "default_percentage",
          title: "Default operations percentage",
          type: "number",
          description: "Default percentage for operations cut (0-100)",
          validation: (Rule: any) => Rule.required().min(0).max(100),
        },
        {
          name: "operations_label_template",
          title: "Operations label template",
          type: "string",
          description: "Use {percentage} where the percentage value should appear",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "enabled_by_default_global",
          title: "Operations enabled by default (global)",
          type: "boolean",
          description: "Whether operations cut is enabled by default for multiple cause areas",
        },
        {
          name: "enabled_by_default_single",
          title: "Operations enabled by default (single cause area)",
          type: "boolean",
          description: "Whether operations cut is enabled by default for single cause areas",
        },
        {
          name: "excluded_cause_area_ids",
          title: "Excluded cause areas",
          type: "array",
          description: "Cause areas that should not offer the operations cut option",
          of: [{ type: "number" }],
          components: { input: CauseAreaMultiSelectInput },
        },
      ],
    },
    {
      name: "cause_area_display_config",
      title: "Cause area display configuration",
      type: "object",
      group: "pane1",
      fields: [
        {
          name: "cause_area_selection_title",
          title: "Cause area selection title",
          type: "string",
          description: "Title shown above the cause area selection buttons",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "recommendation_button_text",
          title: "Recommendation button text",
          type: "string",
          description: "Text for the button that selects the recommended (smart) distribution",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "multiple_cause_areas_button_text",
          title: "Multiple cause areas button text",
          type: "string",
          description: "Text for the button that lets the donor pick multiple cause areas",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "below_line_cause_area_ids",
          title: "Below-the-line cause areas",
          type: "array",
          description: "Cause areas that should be displayed below the divider line",
          of: [{ type: "number" }],
          components: { input: CauseAreaMultiSelectInput },
        },
        {
          name: "cause_area_contexts",
          title: "Cause area context texts",
          type: "array",
          description: "Context text displayed under specific cause areas",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "cause_area_id",
                  title: "Cause area",
                  type: "number",
                  validation: (Rule: any) => Rule.required(),
                  options: { includeSmartDistribution: true },
                  components: { input: CauseAreaSelectInput },
                },
                {
                  name: "context_text",
                  title: "Context text",
                  type: "string",
                  validation: (Rule: any) => Rule.required(),
                },
              ],
              preview: {
                select: {
                  title: "cause_area_id",
                  subtitle: "context_text",
                },
              },
            },
          ],
        },
        {
          name: "cause_area_rollouts",
          title: "Cause area rollouts",
          type: "array",
          description: "Expandable information displayed under specific cause areas",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "cause_area_id",
                  title: "Cause area",
                  type: "number",
                  validation: (Rule: any) => Rule.required(),
                  options: { includeSmartDistribution: true },
                  components: { input: CauseAreaSelectInput },
                },
                {
                  name: "title",
                  title: "Title",
                  type: "string",
                  validation: (Rule: any) => Rule.required(),
                },
                {
                  name: "text",
                  title: "Text",
                  type: "array",
                  of: [{ type: "block" }],
                },
                {
                  name: "links",
                  title: "Links",
                  type: "array",
                  description: "Optional links shown below the text",
                  of: [{ type: "link" }],
                  validation: (Rule: any) =>
                    Rule.custom((links: Array<{ title?: string }> | undefined) =>
                      links?.some((link) => !link.title)
                        ? "Every link must have a link label"
                        : true,
                    ),
                },
              ],
              preview: {
                select: {
                  title: "cause_area_id",
                  subtitle: "title",
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: "ui_labels",
      title: "UI Labels",
      type: "object",
      group: "pane1",
      fields: [
        {
          name: "total_label",
          title: "Total label",
          type: "string",
          description: "Label shown for total amount",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "operations_summary_label",
          title: "Operations summary label",
          type: "string",
          description:
            "Label for the operations/tip line item in the donation summary (donor pane)",
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },
    //Button text
    defineField({
      name: "pane1_button_text",
      title: "Button text",
      type: "string",
      group: "pane1",
      validation: (Rule) => Rule.required(),
    }),
    // Anon button text pane 2
    defineField({
      name: "allow_anonymous_donations",
      title: "Allow anonymous donations",
      type: "boolean",
      group: "pane2",
      initialValue: true,
      description: "If true, the user can choose to donate anonymously",
    }),
    defineField({
      name: "anon_button_text",
      title: "Anon button text",
      type: "string",
      group: "pane2",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "anon_button_text_tooltip",
      title: "Anon button text tooltip",
      type: "text",
      group: "pane2",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "show_name_field",
      title: "Show name field",
      type: "boolean",
      group: "pane2",
      initialValue: true,
    }),
    // Placeholders on name and email pane 2
    defineField({
      name: "name_placeholder",
      title: "Name placeholder",
      type: "string",
      group: "pane2",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name_invalid_error_text",
      title: "Name invalid error text",
      type: "string",
      group: "pane2",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email_placeholder",
      title: "Email placeholder",
      type: "string",
      group: "pane2",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email_invalid_error_text",
      title: "Email invalid error text",
      type: "string",
      group: "pane2",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "show_referral_code_field",
      title: "Show referral code field",
      type: "boolean",
      group: "pane2",
      initialValue: false,
      description:
        "If true, the donor can enter a referral/campaign code on pane 2. Codes from the URL (?referral=) are still sent even when this is off.",
    }),
    defineField({
      name: "referral_code_placeholder",
      title: "Referral code placeholder",
      type: "string",
      group: "pane2",
      description: "Placeholder shown in the referral code input when the field is visible.",
      validation: (Rule) =>
        Rule.custom((value, ctx) => {
          if (
            (ctx.parent as { show_referral_code_field?: boolean }).show_referral_code_field &&
            !value
          ) {
            return "Referral code placeholder is required when the referral code field is shown.";
          }
          return true;
        }),
    }),
    // Tax deduction selector text pane 2
    defineField({
      name: "tax_deduction_selector_text",
      title: "Tax deduction selector text",
      type: "string",
      group: "pane2",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tax_deduction_ssn_placeholder",
      title: "Tax deduction ssn placeholder",
      type: "string",
      group: "pane2",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tax_deduction_ssn_invalid_error_text",
      title: "Tax deduction ssn invalid error text",
      type: "string",
      group: "pane2",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tax_deduction_tooltip_text",
      title: "Tax deduction tooltip text",
      type: "text",
      rows: 3,
      group: "pane2",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tax_deduction_ssn_suspicious_message",
      title: "Tax deduction ssn suspicious message",
      type: "string",
      group: "pane2",
      description:
        "Shown when the entered personal ID is technically valid but looks like it may be a typo (currently only used for Danish CPR numbers). Leave empty to show no message.",
    }),
    // Newsletter selector text pane 2
    defineField({
      name: "newsletter_selector_text",
      title: "Newsletter selector text",
      type: "string",
      group: "pane2",
      validation: (Rule) => Rule.required(),
    }),
    // Privacy policy text pane 2
    defineField({
      name: "privacy_policy_text",
      title: "Privacy policy text",
      type: "string",
      group: "pane2",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "privacy_policy_link",
      title: "Privacy policy link",
      type: "navitem",
      group: "pane2",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "require_privacy_policy_checkbox",
      title: "Require privacy policy checkbox",
      type: "boolean",
      group: "pane2",
      initialValue: false,
      description: "If true, the user must check the privacy policy checkbox to proceed",
    }),
    defineField({
      name: "privacy_policy_required_error_text",
      title: "Privacy policy required error text",
      type: "string",
      group: "pane2",
      validation: (Rule) =>
        Rule.custom((value, ctx) => {
          if ((ctx.parent as any).require_privacy_policy_checkbox && !value) {
            return "Privacy policy required error text is required when require privacy policy checkbox is enabled.";
          }
          return true;
        }),
    }),
    // Button text pane 2
    defineField({
      name: "pane2_button_text",
      title: "Button text",
      type: "string",
      group: "pane2",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "api_generic_error_message",
      title: "API generic error message",
      type: "string",
      group: "pane2",
      validation: (Rule) => Rule.required(),
    }),
    // Referrals header pane 3
    defineField({
      name: "show_referrals",
      title: "Show referrals",
      type: "boolean",
      group: "referrals",
      initialValue: true,
    }),
    defineField({
      name: "referrals_title",
      title: "Referrals header",
      type: "string",
      group: "referrals",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "other_referral_input_placeholder",
      title: "Placeholder other input field",
      type: "string",
      description: "Placeholder in the free text input field for other referrals",
      group: "referrals",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "color_scheme",
      title: "Color scheme",
      type: "string",
      options: {
        list: [
          { title: "Light", value: "light" },
          { title: "Dark", value: "dark" },
        ],
      },
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Donation widget",
      };
    },
  },
});
