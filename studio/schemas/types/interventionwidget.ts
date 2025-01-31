import { Zap } from "react-feather";
import { blocktype } from "./blockcontent";

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
      name: "description",
      title: "Description",
      type: "array",
      of: [blocktype, { type: "latex" }],
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
      name: "output_configuration",
      type: "reference",
      description: "Configuration for the interventions that the widget will show.",
      to: [{ type: "interventionwidgetoutputconfiguration" }],
      validation: (Rule: any) => Rule.required(),
    },
  ],
} as const;
