import { Zap } from "react-feather";
import { blocktype } from "./blockcontent";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "interventionwidget",
  type: "object",
  title: "Intervention widget",
  icon: Zap,
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
      of: [blocktype, { type: "latex" }],
    }),
    defineField({
      name: "donation_label",
      type: "string",
      title: "Donation label",
    }),
    defineField({
      name: "default_sum",
      type: "number",
      title: "Default sum",
    }),
    defineField({
      name: "output_configuration",
      type: "reference",
      description: "Configuration for the interventions that the widget will show.",
      to: [{ type: "interventionwidgetoutputconfiguration" }],
      validation: (Rule) => Rule.required(),
    }),
  ],
});
