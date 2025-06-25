export default {
  name: "quickpay",
  type: "document",
  title: "Quickpay payment method",
  fields: [
    {
      name: "selector_text",
      title: "Payment method selector",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "recurring_button_text",
      title: "Payment button text",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "single_button_text",
      title: "Single payment button text",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
  ],
};
