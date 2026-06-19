import { defineType, defineField } from "sanity";
import { transactionCostField } from "./transactionCost";

export default defineType({
  name: "quickpay_card",
  type: "document",
  title: "Quickpay card payment method",
  fields: [
    defineField({
      name: "selector_text",
      title: "Payment method selector",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "recurring_button_text",
      title: "Recurring button text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "single_button_text",
      title: "Single payment button text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    transactionCostField,
  ],
});
