import { Type } from "react-feather";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "column",
  type: "object",
  title: "Full image",
  icon: Type,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "paragraph",
      type: "text",
      rows: 5,
      title: "Paragraph",
    }),
    defineField({
      name: "links",
      type: "array",
      title: "Links",
      of: [{ type: "link" }, { type: "navitem" }],
    }),
  ],
});
