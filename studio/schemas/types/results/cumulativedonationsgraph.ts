import { BarChart, BarChart2 } from "react-feather";
import { defineType, defineField } from "sanity";

export default defineType({
  type: "object",
  name: "cumulativedonationsgraph",
  icon: BarChart,
  fields: [
    defineField({
      type: "graphcontext",
      name: "graphcontext",
      title: "Graph Context",
    }),
  ],
  preview: {
    select: {
      title: "graphcontext.description",
      subtitle: "graphcontext.detailed_description",
    },
  },
});
