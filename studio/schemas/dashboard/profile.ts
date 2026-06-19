import { defineType, defineField } from "sanity";
import { isShallowSlug } from "../../validators/isShallowSlug";

export default defineType({
  title: "Profile",
  name: "profile",
  type: "document",
  fields: [
    defineField({
      name: "title_template",
      title: "Title template",
      type: "string",
      description: "Template for the title of the page, e.g. 'Hi {{name}}'",
    }),
    defineField({
      name: "info_configuration",
      title: "Info configuration",
      type: "object",
      fields: [
        defineField({
          name: "name_label",
          title: "Name label",
          type: "string",
        }),
        defineField({
          name: "email_label",
          title: "Email label",
          type: "string",
        }),
        defineField({
          name: "newsletter_label",
          title: "Newsletter label",
          type: "string",
        }),
        defineField({
          name: "save_button_label",
          title: "Save button label",
          type: "string",
        }),
        defineField({
          name: "success_message",
          title: "Success message",
          type: "string",
        }),
        defineField({
          name: "failure_message",
          title: "Failure message",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "info_title",
      title: "Info title",
      type: "string",
    }),
    defineField({
      name: "tax_subtitle",
      title: "Tax subtitle",
      type: "string",
    }),
    defineField({
      name: "tax",
      title: "Tax deduction",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "tax_link",
      title: "Tax link",
      type: "string",
    }),
    defineField({
      name: "data_subtitle",
      title: "Data subtitle",
      type: "string",
    }),
    defineField({
      name: "data",
      title: "Data policy",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "data_link",
      title: "Data link",
      type: "string",
    }),
    defineField({
      name: "read_more_label",
      title: "Read more label",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      initialValue: "profile",
      description: "Relative to dashboard",
      validation: (Rule) => Rule.required().custom(isShallowSlug),
    }),
  ],

  preview: {
    select: {
      title: "slug.current",
    },
  },
});
