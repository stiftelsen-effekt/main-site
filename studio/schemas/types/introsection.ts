import { AlignLeft } from "react-feather";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "introsection",
  type: "object",
  title: "Intro section",
  icon: AlignLeft,
  preview: {
    select: {
      title: "heading",
      subtitle: "paragraph",
    },
  },
  fields: [
    defineField({
      name: "heading",
      type: "text",
      rows: 3,
      title: "Heading",
    }),
    defineField({
      name: "paragraph",
      type: "text",
      rows: 3,
      title: "Paragraph",
    }),
  ],
});
