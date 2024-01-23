export default {
  name: "bank",
  type: "document",
  title: "Bank payment method",
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
      name: "explanatory_text",
      title: "Explanatory text",
      type: "text",
      rows: 3,
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "kontonr_title",
      title: "Kontonr title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "kontonr",
      title: "Kontonr",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "kid_title",
      title: "KID title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    prepare() {
      return {
        title: "Bank",
      };
    },
  },
} as const;
