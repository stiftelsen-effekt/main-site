import { defineType, defineField } from "sanity";
import { Star } from "react-feather";

export default defineType({
  name: "pointlistpoint",
  type: "object",
  title: "Pointlist point",
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
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "paragraph",
    },
  },
});
