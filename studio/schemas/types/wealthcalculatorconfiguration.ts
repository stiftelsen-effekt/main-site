import { defineType, defineField } from "sanity";

export default defineType({
  type: "document",
  name: "wealthcalculatorconfiguration",
  title: "Wealth Calculator Configuration",
  fields: [
    defineField({
      name: "calculator_input_configuration",
      type: "object",
      title: "Calculator Input Configuration",
      fields: [
        defineField({
          name: "subtitle_label",
          type: "string",
          title: "Subtitle Label",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "period",
          type: "string",
          title: "Period type",
          options: {
            list: ["monthly", "yearly"],
          },
        }),
        defineField({
          name: "income_input_configuration",
          type: "object",
          title: "Income Input Configuration",
          fields: [
            defineField({
              name: "placeholder",
              type: "string",
              title: "Placeholder",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "thousand_separator",
              type: "string",
              title: "Thousand Separator",
            }),
            defineField({
              name: "currency_label",
              type: "string",
              title: "Currency Label",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              type: "string",
              title: "Description",
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
        defineField({
          name: "children_input_configuration",
          type: "object",
          title: "Children Input Configuration",
          fields: [
            defineField({
              name: "placeholder",
              type: "string",
              title: "Placeholder",
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  // Must be one of the options
                  const parent = context.parent as { options?: string[] };
                  if (parent.options && parent.options.includes(value)) {
                    return true;
                  } else {
                    return "Must be one of the options";
                  }
                }),
            }),
            defineField({
              name: "options",
              type: "array",
              of: [{ type: "string" }],
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
        defineField({
          name: "adults_input_configuration",
          type: "object",
          title: "Adults Input Configuration",
          fields: [
            defineField({
              name: "placeholder",
              type: "string",
              title: "Placeholder",
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  // Must be one of the options
                  const parent = context.parent as { options?: string[] };
                  if (parent.options && parent.options.includes(value)) {
                    return true;
                  } else {
                    return "Must be one of the options";
                  }
                }),
            }),
            defineField({
              name: "options",
              type: "array",
              of: [{ type: "string" }],
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
        defineField({
          name: "calculate_button_label",
          type: "string",
          title: "Calculate Button Label",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "slider_configuration",
      type: "object",
      title: "Slider Configuration",
      fields: [
        defineField({
          name: "donation_percentage_input_configuration",
          type: "object",
          title: "Donation Percentage Input Configuration",
          validation: (Rule) => Rule.required(),
          fields: [
            defineField({
              name: "template_string",
              type: "string",
              title: "Template String",
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "chart_label",
      type: "string",
      title: "Chart Label",
    }),
    defineField({
      name: "x_axis_label",
      type: "string",
      title: "X Axis Label",
    }),
    defineField({
      name: "data_explanation_label",
      type: "string",
      title: "Data Explanation Label",
      description: "Label for the arrow that opens the data explanation section.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "data_explanation",
      type: "reference",
      to: [{ type: "contentsection" }],
      title: "Data Explanation",
      options: {
        disableNew: false,
      },
    }),
    defineField({
      name: "donation_percentage",
      type: "number",
      title: "Donation Percentage",
      description: "The default percentage of income that will be donated. For example 10 for 10%.",
    }),
    defineField({
      name: "income_percentile_label_template_string",
      type: "text",
      title: "Income Percentile Label Template String",
      rows: 3,
      description:
        'This is a template string that will be used to generate the income percentile label in the graph. The template string should contain a single placeholder, which will be replaced with the percentile value. There are two values that can be used in the template string: {percentile} and {donationpercentage}. For example "Om du donerer {donationpercentage} avinntekten din er du blantde {percentile} rikeste i verden." will be replaced with "Om du donerer 10% av inntekten din er du blant de 1,5% rikeste i verden."',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "income_percentile_after_donation_label_template_string",
      type: "text",
      title: "Income Percentile After Donation Label Template String",
      rows: 3,
      description:
        'This is a template string that will be used to generate the income percentile label in the graph. The template string should contain a single placeholder, which will be replaced with the percentile value. There are two values that can be used in the template string: {percentile} and {donationpercentage}. For example "Om du donerer {donationpercentage} avinntekten din er du blantde {percentile} rikeste i verden." will be replaced with "Om du donerer 10% av inntekten din er du blant de 1,5% rikeste i verden."',
      validation: (Rule) => Rule.required(),
    }),
  ],
});
