import { defineType, defineField } from "sanity";
import { DollarSign } from "react-feather";
import { ColumnsPreview } from "../../components/columnsPreview";
import { blocktype } from "./blockcontent";

export default defineType({
  name: "wealthcalculatorteaser",
  type: "object",
  title: "Wealth Calculator Teaser",
  icon: DollarSign,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [blocktype],
    }),
    defineField({
      name: "median_income",
      type: "number",
      title: "Median Income",
    }),
    defineField({
      name: "button",
      type: "navitem",
      title: "Button",
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
      name: "x_axis_label",
      type: "string",
      title: "X Axis Label",
    }),
    defineField({
      name: "income_percentile_label_template_string",
      type: "text",
      title: "Income Percentile Label Template String",
      rows: 3,
      description:
        'This is a template string that will be used to generate the income percentile label in the graph. The template string should contain a single placeholder, which will be replaced with the percentile value. There are two values that can be used in the template string: {percentile} and {donationpercentage}. For example "Om du donerer {donationpercentage} avinntekten din er du blantde {percentile} rikeste i verden." will be replaced with "Om du donerer 10% av inntekten din er du blant de 1,5% rikeste i verden."',
    }),
    defineField({
      name: "income_percentile_after_donation_label_template_string",
      type: "text",
      title: "Income Percentile After Donation Label Template String",
      rows: 3,
      description:
        'This is a template string that will be used to generate the income percentile label in the graph. The template string should contain a single placeholder, which will be replaced with the percentile value. There are two values that can be used in the template string: {percentile} and {donationpercentage}. For example "Om du donerer {donationpercentage} avinntekten din er du blantde {percentile} rikeste i verden." will be replaced with "Om du donerer 10% av inntekten din er du blant de 1,5% rikeste i verden."',
    }),
  ],
});
