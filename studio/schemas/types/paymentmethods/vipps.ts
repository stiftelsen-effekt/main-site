export default {
  name: "vipps",
  type: "document",
  title: "Vipps payment method",
  groups: [
    {
      name: "single",
      title: "Single",
    },
    {
      name: "recurring",
      title: "Recurring",
    },
  ],
  fields: [
    {
      name: "agreement_page",
      title: "Agreement page",
      type: "reference",
      to: [{ type: "vippsagreement" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "anonymous_page",
      title: "Anonymous Vipps page",
      type: "reference",
      to: [{ type: "vipps-anonymous" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "selector_text",
      title: "Payment method selector",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "recurring_title",
      title: "Recurring title",
      type: "string",
      group: "recurring",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "recurring_selector_earliest_text",
      title: "Recurring choose earliest",
      type: "string",
      group: "recurring",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "recurring_selector_choose_date_text",
      title: "Recurring choose date",
      type: "string",
      group: "recurring",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "recurring_button_text",
      title: "Recurring button text",
      type: "string",
      group: "recurring",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "single_title",
      title: "Single Title",
      type: "string",
      group: "single",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "single_button_text",
      title: "Single button text",
      type: "string",
      group: "single",
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    prepare() {
      return {
        title: "Vipps",
      };
    },
  },
} as const;
