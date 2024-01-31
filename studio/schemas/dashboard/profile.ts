import { isShallowSlug } from "../../validators/isShallowSlug";

export default {
  title: "Profile",
  name: "profile",
  type: "document",
  fields: [
    {
      name: "title_template",
      title: "Title template",
      type: "string",
      description: "Template for the title of the page, e.g. 'Hi {{name}}'",
    },
    {
      name: "info_configuration",
      title: "Info configuration",
      type: "object",
      fields: [
        {
          name: "name_label",
          title: "Name label",
          type: "string",
        },
        {
          name: "email_label",
          title: "Email label",
          type: "string",
        },
        {
          name: "newsletter_label",
          title: "Newsletter label",
          type: "string",
        },
        {
          name: "save_button_label",
          title: "Save button label",
          type: "string",
        },
        {
          name: "success_message",
          title: "Success message",
          type: "string",
        },
        {
          name: "failure_message",
          title: "Failure message",
          type: "string",
        },
      ],
    },
    {
      name: "info_title",
      title: "Info title",
      type: "string",
    },
    {
      name: "tax_subtitle",
      title: "Tax subtitle",
      type: "string",
    },
    {
      name: "tax",
      title: "Tax deduction",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "tax_link",
      title: "Tax link",
      type: "string",
    },
    {
      name: "data_subtitle",
      title: "Data subtitle",
      type: "string",
    },
    {
      name: "data",
      title: "Data policy",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "data_link",
      title: "Data link",
      type: "string",
    },
    {
      name: "read_more_label",
      title: "Read more label",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      initialValue: "profile",
      description: "Relative to dashboard",
      validation: (Rule: any) => Rule.required().custom(isShallowSlug),
    },
  ],

  preview: {
    select: {
      title: "slug.current",
    },
  },
} as const;
