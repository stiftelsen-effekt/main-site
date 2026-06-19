import { defineType, defineField } from "sanity";
import { Bookmark } from "react-feather";

export default defineType({
  name: "quote",
  type: "object",
  title: "Quote",
  icon: Bookmark,
  fields: [
    defineField({
      name: "quote",
      type: "text",
      rows: 3,
      title: "Quote",
    }),
    defineField({
      name: "quotation_marks",
      type: "boolean",
      title: "Quotation marks",
    }),
    defineField({
      name: "offset",
      type: "string",
      title: "Offset",
      options: {
        list: ["Left", "Right"],
      },
    }),
  ],
  preview: {
    select: {
      title: "quote",
    },
  },
});
