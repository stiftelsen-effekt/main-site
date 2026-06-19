import { defineType, defineField } from "sanity";
import { Columns } from "react-feather";

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
      name: "paragraph",
      type: "text",
      rows: 3,
      title: "Paragraph",
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
