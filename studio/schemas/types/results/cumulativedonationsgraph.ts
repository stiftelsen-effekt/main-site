import { BarChart, BarChart2 } from "react-feather";

export default {
  type: "object",
  name: "cumulativedonationsgraph",
  icon: BarChart,
  fields: [
    {
      type: "graphcontext",
      name: "graphcontext",
      title: "Graph Context",
    },
  ],
  preview: {
    select: {
      title: "graphcontext.description",
      subtitle: "graphcontext.detailed_description",
    },
  },
};
