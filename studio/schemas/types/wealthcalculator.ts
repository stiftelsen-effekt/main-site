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
      name: "impact_configuration",
      type: "reference",
      to: [{ type: "wealthcalculatorimpact" }],
      description:
        "Optional impact configuration for the wealth calculator. Will show a section below the calculator with a description and a button to open the donation widget.",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title || "Wealth Calculator",
      };
    },
  },
});
