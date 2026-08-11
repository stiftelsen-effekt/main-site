import { defineType, defineField } from "sanity";
import { Columns } from "react-feather";
import { BlockTypePresets } from "../utils/blockContentHelpers";

export default defineType({
  name: "splitview",
  type: "object",
  icon: Columns,
  title: "Split view",
  preview: {
    select: {
      title: "title",
      media: "image",
      subtitle: "paragraph",
    },
  },
  fields: [
    defineField({
      name: "swapped",
      type: "boolean",
      title: "Swapped",
    }),
    defineField({
      name: "rowSwapped",
      type: "boolean",
      title: "Row Swapped",
      description: "If checked text is on top in mobile view",
    }),
    defineField({
      name: "darktext",
      type: "boolean",
      title: "Dark text",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "richText",
      type: "array",
      title: "Rich text",
      of: [BlockTypePresets.withoutCitations],
    }),
    defineField({
      name: "paragraph",
      type: "text",
      rows: 3,
      title: "LEGACY paragraph",
      description: "Existing content is retained and displayed until rich text is added.",
    }),
    defineField({
      name: "form",
      type: "object",
      title: "Email form",
      description: "Leave empty to hide the form.",
      fields: [
        defineField({
          name: "formType",
          type: "string",
          title: "Form type",
          description: "Sent to the backend as the hidden type value, for example campaign-2027.",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "inputLabel",
          type: "string",
          title: "Email label",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "inputPlaceholder",
          type: "string",
          title: "Email placeholder",
        }),
        defineField({
          name: "buttonLabel",
          type: "string",
          title: "Button text",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "successMessage",
          type: "string",
          title: "Success message",
        }),
        defineField({
          name: "errorMessage",
          type: "string",
          title: "Error message",
        }),
      ],
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Image",
    }),
    defineField({
      name: "links",
      type: "array",
      title: "Links",
      of: [{ type: "link" }, { type: "navitem" }],
    }),
  ],
});
