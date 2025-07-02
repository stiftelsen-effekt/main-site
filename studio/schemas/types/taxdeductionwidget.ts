import { defineType, defineField } from "sanity";
import { DollarSign } from "react-feather";

export default defineType({
  name: "taxdeductionwidget",
  type: "object",
  title: "Tax deduction widget",
  icon: DollarSign,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
    }),
    defineField({
      name: "suggested_sums",
      type: "array",
      title: "Suggested sums",
      of: [{ type: "number" }],
    }),
    defineField({
      name: "minimum_treshold",
      type: "number",
      title: "Minimum treshold",
      description: "The minimum amount that must be donated to trigger the tax deduction.",
    }),
    defineField({
      name: "maximum_treshold",
      type: "number",
      title: "Maximum treshold",
      description: "The maximum amount that will count towards the tax deduction.",
    }),
    defineField({
      name: "percentage_reduction",
      type: "number",
      title: "Percentage reduction",
      description:
        "The percentage of the donation that will be saved in reduced tax. The deduction is the amount removed from taxable income, not the amount removed from the tax bill.",
    }),
  ],
});
