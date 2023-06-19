export default {
  name: "donationwidget",
  type: "document",
  title: "Donation widget",
  groups: [
    {
      name: "pane1",
      title: "Pane 1",
      default: true,
    },
    {
      name: "pane2",
      title: "Pane 2",
    },
    {
      name: "pane3_bank_recurring",
      title: "Pane 3 - Bank recurring",
    },
    {
      name: "pane3_bank_single",
      title: "Pane 3 - Bank single",
    },
    {
      name: "referrals",
      title: "Referrals",
    },
  ],
  fields: [
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
    // 3 Preset donation amount values
    {
      name: "preset_amounts_recurring",
      title: "Preset amounts for recurring donations",
      type: "array",
      group: "pane1",
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
      group: "pane1",
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
    //Smart fordeling / Choose your own text
    {
      name: "smart_fordeling_text",
      title: "Smart fordeling text",
      type: "string",
      group: "pane1",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "choose_your_own_text",
      title: "Choose your own text",
      type: "string",
      group: "pane1",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "smart_fordeling_description",
      title: "Smart fordeling forklaring",
      type: "text",
      rows: 3,
      group: "pane1",
      validation: (Rule: any) => Rule.required(),
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
    // Placeholders on name and email pane 2
    {
      name: "name_placeholder",
      title: "Name placeholder",
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
    // Payment method selector text pane 2
    {
      name: "payment_method_selector_bank_text",
      title: "Payment method selector bank text",
      type: "string",
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
    // Title pane 3 bank recurring
    {
      name: "pane3_bank_recurring_title",
      title: "Title",
      type: "string",
      group: "pane3_bank_recurring",
      validation: (Rule: any) => Rule.required(),
    },
    // Selector text pane 3 bank recurring
    {
      name: "pane3_bank_recurring_selector_earliest_text",
      title: "Selector earliest text",
      type: "string",
      group: "pane3_bank_recurring",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "pane3_bank_recurring_selector_choose_date_text",
      title: "Selector choose date text",
      type: "string",
      group: "pane3_bank_recurring",
      validation: (Rule: any) => Rule.required(),
    },
    // Button text pane 3 bank recurring
    {
      name: "pane3_bank_recurring_button_text",
      title: "Button text",
      type: "string",
      group: "pane3_bank_recurring",
      validation: (Rule: any) => Rule.required(),
    },
    // Title pane 3 bank single
    {
      name: "pane3_bank_single_title",
      title: "Title",
      type: "string",
      group: "pane3_bank_single",
      validation: (Rule: any) => Rule.required(),
    },
    // Kontonr title pane 3 bank single
    {
      name: "pane3_bank_single_kontonr_title",
      title: "Kontonr title",
      type: "string",
      group: "pane3_bank_single",
      validation: (Rule: any) => Rule.required(),
    },
    // KID title pane 3 bank single
    {
      name: "pane3_bank_single_kid_title",
      title: "KID title",
      type: "string",
      group: "pane3_bank_single",
      validation: (Rule: any) => Rule.required(),
    },
    // Explanatory text pane 3 bank single
    {
      name: "pane3_bank_single_explanatory_text",
      title: "Explanatory text",
      type: "text",
      rows: 3,
      group: "pane3_bank_single",
      validation: (Rule: any) => Rule.required(),
    },
    // Referrals header pane 3
    {
      name: "pane3_referrals_title",
      title: "Referrals header",
      type: "string",
      group: "referrals",
      validation: (Rule: any) => Rule.required(),
    },
  ],
} as const;
