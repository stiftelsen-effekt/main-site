import { defineType, defineField } from "sanity";
import { transactionCostField } from "./transactionCost";

export default defineType({
  name: "autogiro",
  type: "document",
  title: "Autogiro payment method",
  fields: [
    defineField({
      name: "selector_text",
      title: "Selector text",
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
      name: "account_number_label",
      title: "Account number label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "account_number",
      title: "Account number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "payer_number_label",
      title: "Payer number label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "manual_recurring_option_config",
      title: "Manual recurring option config",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "sum_label",
          title: "Sum label",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "payer_numberexplanatory_text",
          title: "Payer number explanatory text",
          type: "text",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "instruction_text",
          title: "Instruction text",
          type: "array",
          of: [{ type: "block" }],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "complete_button_text",
          title: "Complete button text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "recurring_manual_option_config",
      title: "Recurring manual option config",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "explanation_text",
          title: "Explanation text",
          type: "array",
          of: [{ type: "block" }],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "date_selector_config",
          title: "Date selector config",
          type: "reference",
          to: [{ type: "dateselectorconfig" }],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "complete_button_text",
          title: "Complete button text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "recurring_form_option_config",
      title: "Recurring form option config",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "explanation_text",
          title: "Explanation text",
          type: "array",
          of: [{ type: "block" }],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "payernumber_label",
          title: "Payernumber label",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "button_text",
          title: "Button text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "button_link",
          title: "Button link",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "completed_text",
      title: "Completed text",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
    transactionCostField,
  ],
});
