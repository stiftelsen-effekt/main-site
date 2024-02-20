import { Percent } from "react-feather";

export default {
  type: "document",
  name: "discountratecomparison",
  title: "Discount rate comparison",
  icon: Percent,
  fields: [
    {
      name: "discount_rate_min",
      title: "Discount rate minimum",
      type: "number",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "discount_rate_max",
      title: "Discount rate maximum",
      type: "number",
      validation: (Rule: any) => Rule.required(),
    },
  ],
};
