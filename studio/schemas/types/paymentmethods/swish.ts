import { defineType, defineField } from "sanity";
import { transactionCostField } from "./transactionCost";

export default defineType({
  name: "swish",
  type: "document",
  title: "Swish payment method",
  fields: [
    defineField({
      name: "selector_text",
      title: "Payment method selector",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "prompt",
      title: "Prompt",
      description: "The message shown when the Swish payment is initiated",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "scan_text",
          title: "Scan text",
          type: "string",
          description: "Text prompting the user to scan the QR code",
        }),
        defineField({
          name: "redirect_text",
          title: "Redirect text",
          type: "string",
          description: "Text shown while user is redirected to Swish",
        }),
      ],
    }),
    defineField({
      name: "success",
      title: "Success",
      description: "The message shown after a successful donation",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "text",
          title: "Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "error",
      title: "Error",
      description: "The message shown after a failed donation",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "text",
          title: "Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "declined",
      title: "Declined",
      description: "The message shown after a declined donation, i.e. insufficient funds",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "text",
          title: "Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "cancelled",
      title: "Cancelled",
      description: "The message shown after a cancelled donation, i.e. user cancelled the payment",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "text",
          title: "Text",
          type: "string",
        }),
      ],
    }),
    transactionCostField,
  ],
  preview: {
    prepare() {
      return {
        title: "Swish",
      };
    },
  },
});
