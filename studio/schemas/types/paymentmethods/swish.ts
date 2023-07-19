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
      name: "prompt",
      title: "Prompt",
      description: "The message shown before the user is redirected to Swish",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "text",
          title: "Text",
          type: "string",
        },
      ],
    },
    {
      name: "success",
      title: "Success",
      description: "The message shown after a successful donation",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "text",
          title: "Text",
          type: "string",
        },
      ],
    },
    {
      name: "error",
      title: "Error",
      description: "The message shown after a failed donation",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "text",
          title: "Text",
          type: "string",
        },
      ],
    },
    {
      name: "declined",
      title: "Declined",
      description: "The message shown after a declined donation, i.e. insufficient funds",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "text",
          title: "Text",
          type: "string",
        },
      ],
    },
    {
      name: "cancelled",
      title: "Cancelled",
      description: "The message shown after a cancelled donation, i.e. user cancelled the payment",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "text",
          title: "Text",
          type: "string",
        },
      ],
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
