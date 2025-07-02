import { Percent } from "react-feather";
import { defineType, defineField } from "sanity";

export default defineType({
  type: "document",
  name: "discountratecomparison",
  title: "Discount rate comparison",
  icon: Percent,
  fields: [
    defineField({
      name: "discount_rate_min",
      title: "Discount rate minimum",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "discount_rate_max",
      title: "Discount rate maximum",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
