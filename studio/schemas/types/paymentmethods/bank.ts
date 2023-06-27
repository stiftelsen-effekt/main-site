export default {
  name: "bank",
  type: "document",
  title: "Bank payment method",
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
      name: "single_explanatory_text",
      title: "Explanatory text",
      type: "text",
      rows: 3,
      group: "single",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "single_kontonr_title",
      title: "Kontonr title",
      type: "string",
      group: "single",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "single_kid_title",
      title: "KID title",
      type: "string",
      group: "single",
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    prepare() {
      return {
        title: "Bank",
      };
    },
  },
} as const;
