import { defineType, defineField } from "sanity";
import { HelpCircle } from "react-feather";

export default defineType({
  name: "questionandanswer",
  type: "object",
  title: "Q&A",
  icon: HelpCircle,
  fields: [
    defineField({
      name: "question",
      type: "string",
      title: "Question",
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "links_title",
      title: "Links title",
      type: "string",
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [{ type: "link" }, { type: "navitem" }],
    }),
  ],
  preview: {
    select: {
      title: "question",
      subtitle: "answer",
    },
  },
});
