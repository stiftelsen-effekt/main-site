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
  ],
  preview: {
    select: {
      title: "graphcontext.description",
      subtitle: "graphcontext.detailed_description",
    },
  },
};
