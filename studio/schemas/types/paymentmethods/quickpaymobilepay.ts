import { defineType, defineField } from "sanity";
import { transactionCostField } from "./transactionCost";

export default defineType({
  name: "quickpay_mobilepay",
  type: "document",
  title: "Quickpay mobilepay payment method",
  fields: [
    defineField({
      name: "selector_text",
      title: "Payment method selector",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "recurring_button_text",
      title: "Payment button text",
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
