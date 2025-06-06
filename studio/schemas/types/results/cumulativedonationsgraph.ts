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
    {
      type: "cumulativedonationstabletext",
      name: "tableText",
      title: "Table Text Configuration",
      description: "Configure the table headers and text",
    },
  ],
  preview: {
    select: {
      title: "graphcontext.description",
      subtitle: "graphcontext.detailed_description",
    },
  },
};
