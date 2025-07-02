import { defineType, defineField } from "sanity";
import { TrendingUp } from "react-feather";

export default defineType({
  name: "resultsteaser",
  type: "object",
  icon: TrendingUp,
  title: "Results teaser",
  preview: {
    select: {
      title: "title",
      subtitle: "paragraph",
    },
  },
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
  ],
});
