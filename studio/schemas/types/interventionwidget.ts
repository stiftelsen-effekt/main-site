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
      name: "donation_label",
      type: "string",
      title: "Donation label",
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
    {
      name: "explanation_label",
      type: "string",
      title: "Explanation label",
    },
    {
      name: "explanation_text",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "explanation_links",
      type: "array",
      of: [{ type: "link" }, { type: "navitem" }],
    },
  ],
} as const;
