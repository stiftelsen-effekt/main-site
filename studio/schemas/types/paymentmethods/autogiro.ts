export default {
  name: "autogiro",
  type: "document",
  title: "Autogiro payment method",
  fields: [
    {
      name: "selector_text",
      title: "Selector text",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "manual_recurring_option_config",
      title: "Manual recurring option config",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "sum_label",
          title: "Sum label",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "account_number_label",
          title: "Account number label",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "payment_numberexplanatory_text",
          title: "Payment number explanatory text",
          type: "text",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "payment_number_label",
          title: "Payment number label",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "instruction_text",
          title: "Instruction text",
          type: "array",
          of: [{ type: "block" }],
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },
    {
      name: "recurring_manual_option_config",
      title: "Recurring manual option config",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "explanation_text",
          title: "Explanation text",
          type: "array",
          of: [{ type: "block" }],
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "payernumber_label",
          title: "Payernumber label",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "date_selector_config",
          title: "Date selector config",
          type: "reference",
          to: [{ type: "dateselectorconfig" }],
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },
    {
      name: "recurring_form_option_config",
      title: "Recurring form option config",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "explanation_text",
          title: "Explanation text",
          type: "array",
          of: [{ type: "block" }],
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "payernumber_label",
          title: "Payernumber label",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "button_text",
          title: "Button text",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "button_link",
          title: "Button link",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },
  ],
};
