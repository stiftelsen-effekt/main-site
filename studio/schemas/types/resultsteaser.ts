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
    defineField({
      name: "sum_subtitle",
      type: "string",
      title: "Total sum subtitle",
    }),
    defineField({
      name: "donors_subtitle",
      type: "string",
      title: "Donors subtitle",
    }),
    defineField({
      name: "see_more_button",
      type: "navitem",
      title: "See more button",
      description: "Link to a page with more results",
    }),
  ],
});
