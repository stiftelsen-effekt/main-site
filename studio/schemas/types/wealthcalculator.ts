import { defineType, defineField } from "sanity";
import { DollarSign } from "react-feather";

export default defineType({
  name: "wealthcalculator",
  type: "object",
  title: "Wealth Calculator",
  icon: DollarSign,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "configuration",
      type: "reference",
      to: [{ type: "wealthcalculatorconfiguration" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "intervention_configuration",
      type: "object",
      title: "Intervention Configuration",
      fields: [
        defineField({
          name: "output_configuration",
          type: "reference",
          to: [{ type: "interventionwidgetoutputconfiguration" }],
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
});
