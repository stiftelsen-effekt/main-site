import { defineType, defineField } from "sanity";
import { transactionCostField } from "./transactionCost";

export default defineType({
  name: "avtalegiro",
  type: "document",
  title: "AvtaleGiro payment method",
  fields: [
    defineField({
      name: "selector_text",
      title: "Payment method selector",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "selector_earliest_text",
      title: "Choose earliest",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "selector_choose_date_text",
      title: "Choose date",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date_selector_configuration",
      title: "Date selector configuration",
      type: "reference",
      to: [{ type: "dateselectorconfig" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "button_text",
      title: "Button text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    transactionCostField,
  ],
  preview: {
    prepare() {
      return {
        title: "Avtalegiro",
      };
    },
  },
});
