import { outputType } from "./_outputtype";
import { defineType, defineField } from "sanity";

export default defineType({
  type: "object",
  name: "resultsheadline",
  fields: [
    defineField({
      type: "string",
      name: "donors_label_template",
      title: "Donors label template",
      description:
        "The template for the text under the total donation number, e.g. 'from {donors} donors'",
    }),
    defineField({
      type: "array",
      name: "outputs",
      title: "Headline outputs",
      of: [outputType],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      outputs: "outputs",
    },
    prepare(selection) {
      const { outputs } = selection;
      return {
        title: `10 238 392 USD from 12 000 donors last updated 12.12.2021`,
        subtitle: outputs.join(", "),
      };
    },
  },
});
