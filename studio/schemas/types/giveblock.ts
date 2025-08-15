import { Star } from "react-feather";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "giveblock",
  type: "object",
  title: "Give block",
  icon: Star,
  fields: [
    defineField({
      name: "heading",
      type: "string",
      title: "Heading",
    }),
    defineField({
      name: "paragraph",
      type: "text",
      rows: 3,
      title: "Paragraph",
    }),
    defineField({
      name: "donateLabel",
      type: "string",
      title: "donateLabel",
    }),
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "paragraph",
    },
  },
});
