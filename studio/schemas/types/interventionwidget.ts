import { Zap } from "react-feather";

export default {
  name: "interventionwidget",
  type: "object",
  title: "Intervention widget",
  icon: Zap,
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "default_sum",
      type: "number",
      title: "Default sum",
    },
    {
      name: "interventions",
      type: "array",
      of: [{ type: "intervention" }],
    },
  ],
} as const;
