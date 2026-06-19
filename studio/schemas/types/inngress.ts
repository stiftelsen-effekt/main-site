import { Type } from "react-feather";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "inngress",
  type: "object",
  title: "Inngress",
  icon: Type,
  fields: [
    defineField({
      name: "heading",
      type: "string",
      title: "Heading",
    }),
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "block" }],
      title: "body",
    }),
    defineField({
      name: "sidelinks",
      type: "array",
      of: [{ type: "link" }, { type: "navitem" }],
      title: "Sidelinks",
    }),
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "body",
    },
  },
});
