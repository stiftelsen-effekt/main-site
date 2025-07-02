import { defineType, defineField } from "sanity";

export default defineType({
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
    defineField({
      name: "agreement_page",
      title: "Agreement page",
      type: "reference",
      to: [{ type: "vippsagreement" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "anonymous_page",
      title: "Anonymous Vipps page",
      type: "reference",
      to: [{ type: "vipps-anonymous" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "selector_text",
      title: "Payment method selector",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "recurring_title",
      title: "Recurring title",
      type: "string",
      group: "recurring",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "recurring_selector_earliest_text",
      title: "Recurring choose earliest",
      type: "string",
      group: "recurring",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "recurring_selector_choose_date_text",
      title: "Recurring choose date",
      type: "string",
      group: "recurring",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "recurring_selector_date_picker_configuration",
      title: "Recurring date picker configuration",
      type: "reference",
      to: [{ type: "dateselectorconfig" }],
    }),
    defineField({
      name: "recurring_button_text",
      title: "Recurring button text",
      type: "string",
      group: "recurring",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "single_title",
      title: "Single Title",
      type: "string",
      group: "single",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "single_button_text",
      title: "Single button text",
      type: "string",
      group: "single",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Vipps",
      };
    },
  },
});
