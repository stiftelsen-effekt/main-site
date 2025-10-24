import { defineType, defineField } from "sanity";
import { DollarSign } from "react-feather";

export default defineType({
  name: "dkgavebrevtaxwidget",
  type: "object",
  title: "DK Gavebrev Tax Widget",
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
      name: "income_label",
      type: "string",
      title: "Income label",
      description: "Label for the pre-tax income input field (e.g., 'Din indkomst før skat').",
    }),
    defineField({
      name: "donation_label",
      type: "string",
      title: "Donation label",
      description: "Label for the donation input field (e.g., 'Din donation').",
    }),
    defineField({
      name: "default_income",
      type: "number",
      title: "Default income",
      description: "Default value for the income input field.",
      initialValue: 500000,
    }),
    defineField({
      name: "default_donation",
      type: "number",
      title: "Default donation",
      description: "Default value for the donation input field.",
      initialValue: 69000,
    }),
    defineField({
      name: "result_description_template",
      type: "text",
      title: "Result description template",
      rows: 3,
      description:
        "Template for displaying the calculation result. Use {income}, {maxDeduction}, {donation}, and {taxBenefit} as placeholders.",
    }),
    defineField({
      name: "button_text",
      type: "string",
      title: "Button text",
      description:
        "Text for the CTA button. Leave empty to hide the button. Defaults to 'Få skattefradrag'.",
    }),
    defineField({
      name: "chart_labels",
      type: "object",
      title: "Chart labels",
      fields: [
        defineField({
          name: "maximum_deduction",
          type: "string",
          title: "Maximum deduction label",
          description:
            "Label for the maximum deduction tick on the chart (e.g., 'Maksimalt fradrag muligt').",
          initialValue: "Maksimalt fradrag muligt",
        }),
        defineField({
          name: "your_donation",
          type: "string",
          title: "Your donation label",
          description: "Label for the donation value on the chart (e.g., 'Din donation').",
          initialValue: "Din donation",
        }),
        defineField({
          name: "your_tax_benefit",
          type: "string",
          title: "Your tax benefit label",
          description: "Label for the tax benefit value on the chart (e.g., 'Dit fradrag').",
          initialValue: "Dit fradrag",
        }),
      ],
    }),
    defineField({
      name: "locale",
      type: "string",
      title: "Locale",
      description: "Locale for number formatting (e.g., 'da-DK' for Danish).",
      initialValue: "da-DK",
    }),
  ],
});
