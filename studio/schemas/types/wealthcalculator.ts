import { DollarSign } from "react-feather";

export default {
  name: "wealthcalculator",
  type: "object",
  title: "Wealth Calculator",
  icon: DollarSign,
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "configuration",
      type: "reference",
      to: [{ type: "wealthcalculatorconfiguration" }],
      validaton: (Rule) => Rule.required(),
    },
    {
      name: "intervention_configuration",
      type: "object",
      title: "Intervention Configuration",
      fields: [
        {
          name: "output_configuration",
          type: "reference",
          to: [{ type: "interventionwidgetoutputconfiguration" }],
          validaton: (Rule) => Rule.required(),
        },
      ],
    },
  ],
} as const;
