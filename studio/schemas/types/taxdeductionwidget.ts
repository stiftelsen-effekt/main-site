import { DollarSign } from "react-feather";

export default {
  name: "taxdeductionwidget",
  type: "object",
  title: "Tax deduction widget",
  icon: DollarSign,
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "description",
      type: "text",
      title: "Description",
    },
    {
      name: "suggested_sums",
      type: "array",
      title: "Suggested sums",
      of: [{ type: "number" }],
    },
    {
      name: "minimum_treshold",
      type: "number",
      title: "Minimum treshold",
      description: "The minimum amount that must be donated to trigger the tax deduction.",
    },
    {
      name: "maximum_treshold",
      type: "number",
      title: "Maximum treshold",
      description: "The maximum amount that will count towards the tax deduction.",
    },
    {
      name: "percentage_reduction",
      type: "number",
      title: "Percentage reduction",
      description:
        "The percentage of the donation that will be saved in reduced tax. The deduction is the amount removed from taxable income, not the amount removed from the tax bill.",
    },
  ],
} as const;
