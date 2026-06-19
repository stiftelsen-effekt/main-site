import { defineType, defineField } from "sanity";

export default defineType({
  type: "document",
  name: "dateselectorconfig",
  title: "Date selector config",
  fields: [
    defineField({
      name: "payment_date_format_template",
      title: "Payment date format template",
      type: "string",
      description: "Use {{date}} to insert the date, e.g. 'The {{date}}th of the month'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "payment_last_date_of_month_option",
      title: "Payment last date of month option",
      type: "boolean",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "payment_date_last_day_of_month_template",
      title: "Payment date last day of month template",
      type: "string",
      description: "E.g. 'Last day of the month'",
      hidden: ({ document }) => !document.payment_last_date_of_month_option,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "last_day_of_month_label",
      title: "Last day of month label",
      type: "string",
      description: "E.g. 'Last day of the month'",
      hidden: ({ document }) => !document.payment_last_date_of_month_option,
      validation: (Rule) => Rule.required(),
    }),
  ],
});
