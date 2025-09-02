import { defineType, defineField } from "sanity";

export default defineType({
  name: "dkbank",
  type: "document",
  title: "DK Bank payment method",
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
  ],
});
