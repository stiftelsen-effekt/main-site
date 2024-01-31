export default {
  name: "avtalegiro",
  type: "document",
  title: "AvtaleGiro payment method",
  fields: [
    {
      name: "selector_text",
      title: "Payment method selector",
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
      name: "selector_earliest_text",
      title: "Choose earliest",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "selector_choose_date_text",
      title: "Choose date",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "date_selector_configuration",
      title: "Date selector configuration",
      type: "reference",
      to: [{ type: "dateselectorconfig" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "button_text",
      title: "Button text",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    prepare() {
      return {
        title: "Avtalegiro",
      };
    },
  },
} as const;
