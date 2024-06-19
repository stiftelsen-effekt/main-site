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
      name: "explanatory_text_email_template",
      title: "Explanatory text email template",
      type: "text",
      rows: 3,
      validation: (Rule: any) => Rule.required(),
      description:
        "This text tells the donor that an email has been sent with further details. Replaces {email} with the donors email address.",
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
    {
      name: "button_text",
      title: "Button text",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "completed_title",
      title: "Completed title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "completed_text",
      title: "Completed text",
      type: "text",
      rows: 3,
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
