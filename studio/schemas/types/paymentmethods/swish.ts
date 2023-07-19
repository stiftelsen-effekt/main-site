export default {
  name: "swish",
  type: "document",
  title: "Swish payment method",
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
  ],
  preview: {
    prepare() {
      return {
        title: "Swish",
      };
    },
  },
} as const;
