export default {
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
  ],
  fields: [
    {
      name: "methods",
      type: "array",
      title: "Payment methods",
      validation: (Rule: any) => Rule.required().min(1),
      of: [
        {
          type: "reference",
          to: [
            { type: "bank" },
            { type: "vipps" },
            { type: "swish" },
            { type: "autogiro" },
            { type: "avtalegiro" },
          ],
          validation: (Rule: any) => Rule.required(),
          options: {
            disableNew: true,
          },
        },
      ],
    },
    //Single / monthly donation text
    {
      name: "single_donation_text",
      title: "Single donation option text",
      type: "string",
      group: "pane1",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "monthly_donation_text",
      title: "Monthly donation option text",
      type: "string",
      group: "pane1",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "default_donation_type",
      title: "Default donation type",
      type: "string",
      options: {
        list: ["single", "monthly"],
      },
      group: "pane1",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "amount_context",
      title: "Donation amount inputs context",
      type: "object",
      group: "pane1",
      description: "Preset amounts are only used if there is only one cause area",
      fields: [
        {
          name: "preset_amounts_recurring",
          title: "Preset amounts for recurring donations",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  title: "Value",
                  name: "amount",
                  type: "number",
                },
                {
                  title: "Subtext",
                  name: "subtext",
                  type: "string",
                },
              ],
              preview: {
                select: {
                  title: "amount",
                  subtitle: "subtext",
                },
              },
            },
          ],
        },
        {
          name: "preset_amounts_single",
          title: "Preset amounts for single donations",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  title: "Value",
                  name: "amount",
                  type: "number",
                },
                {
                  title: "Subtext",
                  name: "subtext",
                  type: "string",
                },
              ],
              preview: {
                select: {
                  title: "amount",
                  subtitle: "subtext",
                },
              },
            },
          ],
        },
        {
          name: "custom_amount_text",
          title: "Custom amount text",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },
    {
      name: "smart_distribution_context",
      title: "Smart distribution context",
      type: "object",
      group: "pane1",
      fields: [
        {
          name: "smart_distribution_radiobutton_text",
          title: "Smart distribution radiobutton text",
          type: "string",
          validation: (Rule: any) => Rule.required(),
          description: "Only used if there is only one cause area",
        },
        {
          name: "custom_distribution_radiobutton_text",
          title: "Custom distribution radiobutton text",
          type: "string",
          validation: (Rule: any) => Rule.required(),
          description: "Only used if there is only one cause area",
        },
        {
          name: "smart_distribution_label_text",
          title: "Smart distribution label text",
          type: "string",
          validation: (Rule: any) => Rule.required(),
          description: "Only used if there is more than one cause area",
        },
        {
          name: "smart_distribution_description",
          title: "Smart distribution description",
          type: "array",
          of: [{ type: "block" }],
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "smart_distribution_description_links",
          title: "Smart distribution description links",
          type: "array",
          of: [{ type: "link" }],
          validation: (Rule: any) => Rule.required(),
          description: "Only used if there is more than one cause area",
        },
      ],
    },
    {
      name: "donation_input_error_templates",
      title: "Donation input error templates",
      type: "object",
      group: "pane1",
      fields: [
        {
          name: "donation_sum_error_template",
          title: "Donation sum error template",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "donation_distribution_cause_areas_sum_error_template",
          title: "Donation distribution cause areas sum error template",
          type: "string",
          validation: (Rule: any) => Rule.required(),
          description:
            "{sum} will be replaced with the sum of the distribution cause areas, e.g. 'You have distributed {sum}% out of 100% between cause areas'",
        },
        {
          name: "donation_distribution_cause_areas_negative_error_template",
          title: "Donation distribution cause areas negative error template",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "donation_distribution_cause_areas_organization_sum_error_template",
          title: "Donation distribution cause areas organization sum error template",
          type: "string",
          validation: (Rule: any) => Rule.required(),
          description:
            "{sum} will be replaced with the sum of the distribution cause areas for the organization and {causeAreaName} will be replaced with the name of the cause area, e.g. 'You have distributed {sum}% out of 100% between organizations in {causeAreaName}'",
        },
        {
          name: "donation_distribution_cause_areas_organization_negative_error_template",
          title: "Donation distribution cause areas organization negative error template",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },
    {
      name: "operations_config",
      title: "Operations configuration",
      type: "object",
      group: "operations",
      fields: [
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
          title: "Excluded cause area IDs",
          type: "array",
          description: "Cause area IDs that should not have operations cut option",
          of: [{ type: "number" }],
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
          name: "below_line_cause_area_ids",
          title: "Below-the-line cause area IDs",
          type: "array",
          description: "Cause area IDs that should be displayed below the divider line",
          of: [{ type: "number" }],
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
                  title: "Cause area ID",
                  type: "number",
                  validation: (Rule: any) => Rule.required(),
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
      ],
    },
    //Button text
    {
      name: "pane1_button_text",
      title: "Button text",
      type: "string",
      group: "pane1",
      validation: (Rule: any) => Rule.required(),
    },
    // Anon button text pane 2
    {
      name: "anon_button_text",
      title: "Anon button text",
      type: "string",
      group: "pane2",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "anon_button_text_tooltip",
      title: "Anon button text tooltip",
      type: "text",
      group: "pane2",
      rows: 3,
      validation: (Rule: any) => Rule.required(),
    },
    // Placeholders on name and email pane 2
    {
      name: "name_placeholder",
      title: "Name placeholder",
      type: "string",
      group: "pane2",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "name_invalid_error_text",
      title: "Name invalid error text",
      type: "string",
      group: "pane2",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "email_placeholder",
      title: "Email placeholder",
      type: "string",
      group: "pane2",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "email_invalid_error_text",
      title: "Email invalid error text",
      type: "string",
      group: "pane2",
      validation: (Rule: any) => Rule.required(),
    },
    // Tax deduction selector text pane 2
    {
      name: "tax_deduction_selector_text",
      title: "Tax deduction selector text",
      type: "string",
      group: "pane2",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "tax_deduction_ssn_placeholder",
      title: "Tax deduction ssn placeholder",
      type: "string",
      group: "pane2",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "tax_deduction_ssn_invalid_error_text",
      title: "Tax deduction ssn invalid error text",
      type: "string",
      group: "pane2",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "tax_deduction_tooltip_text",
      title: "Tax deduction tooltip text",
      type: "text",
      rows: 3,
      group: "pane2",
      validation: (Rule: any) => Rule.required(),
    },
    // Newsletter selector text pane 2
    {
      name: "newsletter_selector_text",
      title: "Newsletter selector text",
      type: "string",
      group: "pane2",
      validation: (Rule: any) => Rule.required(),
    },
    // Privacy policy text pane 2
    {
      name: "privacy_policy_text",
      title: "Privacy policy text",
      type: "string",
      group: "pane2",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "privacy_policy_link",
      title: "Privacy policy link",
      type: "navitem",
      group: "pane2",
      validation: (Rule: any) => Rule.required(),
    },
    // Button text pane 2
    {
      name: "pane2_button_text",
      title: "Button text",
      type: "string",
      group: "pane2",
      validation: (Rule: any) => Rule.required(),
    },
    // Referrals header pane 3
    {
      name: "referrals_title",
      title: "Referrals header",
      type: "string",
      group: "referrals",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "other_referral_input_placeholder",
      title: "Placeholder other input field",
      type: "string",
      description: "Placeholder in the free text input field for other referrals",
      group: "referrals",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "color_scheme",
      title: "Color scheme",
      type: "string",
      options: {
        list: [
          { title: "Light", value: "light" },
          { title: "Dark", value: "dark" },
        ],
      },
    },
  ],
  preview: {
    prepare() {
      return {
        title: "Donation widget",
      };
    },
  },
} as const;
