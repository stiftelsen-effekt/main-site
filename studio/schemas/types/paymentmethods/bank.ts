import { defineType, defineField } from "sanity";
import { transactionCostField } from "./transactionCost";

export default defineType({
  name: "bank",
  type: "document",
  title: "Bank payment method",
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
      name: "explanatory_text",
      title: "Explanatory text",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "explanatory_text_email_template",
      title: "Explanatory text email template",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
      description:
        "This text tells the donor that an email has been sent with further details. Replaces {email} with the donors email address.",
    }),
    defineField({
      name: "kontonr_title",
      title: "Kontonr title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "kontonr",
      title: "Kontonr",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "kid_title",
      title: "KID title",
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
      name: "completed_title",
      title: "Completed title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "completed_text",
      title: "Completed text",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "completed_redirect",
      title: "Completed redirect",
      description: "Optional page to redirect to when the user clicks the completed button.",
      type: "reference",
      to: [{ type: "generic_page" }],
    }),
    transactionCostField,
  ],
  preview: {
    prepare() {
      return {
        title: "Bank",
      };
    },
  },
});
