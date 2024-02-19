import { DollarSign } from "react-feather";
import { ColumnsPreview } from "../../components/columnsPreview";

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
      name: "calculator_input_configuration",
      type: "object",
      title: "Calculator Input Configuration",
      fields: [
        {
          name: "subtitle_label",
          type: "string",
          title: "Subtitle Label",
        },
        {
          name: "income_input_configuration",
          type: "object",
          title: "Income Input Configuration",
          fields: [
            {
              name: "placeholder",
              type: "string",
              title: "Placeholder",
            },
            {
              name: "thousand_separator",
              type: "string",
              title: "Thousand Separator",
            },
            {
              name: "currency_label",
              type: "string",
              title: "Currency Label",
            },
            {
              name: "description",
              type: "string",
              title: "Description",
            },
          ],
        },
        {
          name: "children_input_configuration",
          type: "object",
          title: "Children Input Configuration",
          fields: [
            {
              name: "placeholder",
              type: "string",
              title: "Placeholder",
            },
            {
              name: "options",
              type: "array",
              of: [{ type: "string" }],
            },
          ],
        },
        {
          name: "adults_input_configuration",
          type: "object",
          title: "Adults Input Configuration",
          fields: [
            {
              name: "placeholder",
              type: "string",
              title: "Placeholder",
            },
            {
              name: "options",
              type: "array",
              of: [{ type: "string" }],
            },
          ],
        },
      ],
    },
    {
      name: "slider_configuration",
      type: "object",
      title: "Slider Configuration",
      fields: [
        {
          name: "donation_percentage_input_configuration",
          type: "object",
          title: "Donation Percentage Input Configuration",
          fields: [
            {
              name: "template_string",
              type: "string",
              title: "Template String",
            },
          ],
        },
      ],
    },
    {
      name: "x_axis_label",
      type: "string",
      title: "X Axis Label",
    },
    {
      name: "data_explanation_label",
      type: "string",
      title: "Data Explanation Label",
    },
    {
      name: "data_explanation",
      type: "reference",
      to: [{ type: "contentsection" }],
      title: "Data Explanation",
      options: {
        disableNew: false,
      },
    },
    {
      name: "donation_percentage",
      type: "number",
      title: "Donation Percentage",
      description: "The percentage of income that will be donated. For example 10 for 10%.",
    },
    {
      name: "income_percentile_label_template_string",
      type: "text",
      title: "Income Percentile Label Template String",
      lines: 3,
      description:
        'This is a template string that will be used to generate the income percentile label in the graph. The template string should contain a single placeholder, which will be replaced with the percentile value. There are two values that can be used in the template string: {percentile} and {donationpercentage}. For example "Om du donerer {donationpercentage} avinntekten din er du blantde {percentile} rikeste i verden." will be replaced with "Om du donerer 10% av inntekten din er du blant de 1,5% rikeste i verden."',
    },
    {
      name: "income_percentile_after_donation_label_template_string",
      type: "text",
      title: "Income Percentile After Donation Label Template String",
      lines: 3,
      description:
        'This is a template string that will be used to generate the income percentile label in the graph. The template string should contain a single placeholder, which will be replaced with the percentile value. There are two values that can be used in the template string: {percentile} and {donationpercentage}. For example "Om du donerer {donationpercentage} avinntekten din er du blantde {percentile} rikeste i verden." will be replaced with "Om du donerer 10% av inntekten din er du blant de 1,5% rikeste i verden."',
    },
    {
      name: "show_impact",
      type: "boolean",
      title: "Show Impact",
    },
    {
      name: "intervention_configuration",
      type: "object",
      title: "Impact Configuration",
      fields: [
        {
          name: "interventions",
          type: "array",
          of: [{ type: "intervention" }],
        },
        {
          name: "explanation_label",
          type: "string",
          title: "Explanation label",
        },
        {
          name: "explanation_text",
          type: "array",
          of: [{ type: "block" }],
        },
        {
          name: "explanation_links",
          type: "array",
          of: [{ type: "link" }, { type: "navitem" }],
        },
      ],
    },
  ],
} as const;
