import { defineType, defineField } from "sanity";

export default defineType({
  name: "teaser",
  type: "object",
  title: "Teaser",
  preview: {
    select: {
      title: "title",
      media: "image",
    },
  },
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "paragraph",
      type: "text",
      rows: 3,
      title: "Paragraph",
    }),
    defineField({
      name: "disclaimer",
      type: "text",
      rows: 2,
      title: "Disclaimer",
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
