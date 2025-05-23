import { BarChart2 } from "react-feather";

export default {
  type: "object",
  name: "referralgraph",
  icon: BarChart2,
  fields: [
    {
      type: "graphcontext",
      name: "graphcontext",
      title: "Graph Context",
    },
    {
      type: "referralstabletext",
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
