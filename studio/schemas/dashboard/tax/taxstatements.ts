import { defineType, defineField } from "sanity";
import { isShallowSlug } from "../../../validators/isShallowSlug";

export default defineType({
  title: "Tax statements",
  name: "taxstatements",
  type: "object",

  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "aggregate_estimated_impact",
      title: "Aggregate estimated impact configuration",
      type: "reference",
      to: [{ type: "aggregateestimatedimpact" }],
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      initialValue: "annual-statements",
      description: "Relative to tax page",
      validation: (Rule) => Rule.required().custom(isShallowSlug),
    }),
  ],
});
