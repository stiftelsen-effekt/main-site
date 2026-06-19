import { BarChart2 } from "react-feather";
import { defineType, defineField } from "sanity";

export default defineType({
  type: "object",
  name: "referralgraph",
  icon: BarChart2,
  fields: [
    defineField({
      type: "graphcontext",
      name: "graphcontext",
      title: "Graph Context",
    }),
    defineField({
      type: "referralstabletext",
      name: "tableText",
      title: "Table Text Configuration",
      description: "Configure the table headers and text",
    }),
  ],
  preview: {
    select: {
      title: "graphcontext.description",
      subtitle: "graphcontext.detailed_description",
    },
  },
});
