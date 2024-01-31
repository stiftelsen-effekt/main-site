export default {
  type: "document",
  name: "dateselectorconfig",
  title: "Date selector config",
  fields: [
    {
      name: "payment_date_format_template",
      title: "Payment date format template",
      type: "string",
      description: "Use {{date}} to insert the date, e.g. 'The {{date}}th of the month'",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "payment_date_last_day_of_month_template",
      title: "Payment date last day of month template",
      type: "string",
      description: "E.g. 'Last day of the month'",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "last_day_of_month_label",
      title: "Last day of month label",
      type: "string",
      description: "E.g. 'Last day of the month'",
      validation: (Rule: any) => Rule.required(),
    },
  ],
};
