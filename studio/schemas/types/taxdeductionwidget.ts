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
    defineField({
      name: "donations_label",
      type: "string",
      title: "Donations label",
      description: "Label for the donations input field. Defaults to 'Donasjoner'.",
    }),
    defineField({
      name: "tax_deduction_return_description_template",
      type: "text",
      title: "Tax deduction return description template",
      rows: 3,
      description:
        "Template for the description of the tax deduction return. Use {taxDeduction} and {taxBenefit} as placeholders for the values.",
    }),
    defineField({
      name: "below_minimum_treshold_description_template",
      type: "text",
      title: "Below minimum treshold description template",
      rows: 3,
      description:
        "Template for the description when the donation is below the minimum treshold. Use {lastValidSum} and {minimumTreshold} as placeholders for the values.",
    }),
    defineField({
      name: "button_text",
      type: "string",
      title: "Button text",
      description:
        "Text for the button that triggers the tax deduction. Defaults to 'Få skattefradrag'.",
    }),
    defineField({
      name: "chart_labels",
      type: "object",
      title: "Chart labels",
      fields: [
        defineField({
          name: "maximum_threshold",
          type: "string",
          title: "Maximum threshold label",
          description:
            "Label for the maximum threshold tick on the chart. Defaults to 'Maks skattefradrag'.",
          initialValue: "Maks skattefradrag",
        }),
        defineField({
          name: "minimum_threshold",
          type: "string",
          title: "Minimum threshold label",
          description:
            "Label for the minimum threshold tick on the chart. Defaults to 'Minste grense'.",
          initialValue: "Minste grense",
        }),
        defineField({
          name: "deduction",
          type: "string",
          title: "Deduction label",
          description: "Label for the deduction value on the chart. Defaults to 'Skattefradrag'.",
          initialValue: "Skattefradrag",
        }),
        defineField({
          name: "tax_benefit",
          type: "string",
          title: "Tax benefit label",
          description:
            "Label for the tax benefit value on the chart. Defaults to 'Du får tilbake'.",
          initialValue: "Du får tilbake",
        }),
      ],
    }),
  ],
});
